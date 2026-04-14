import { supabase } from './supabaseClient';
import { toAppError } from '../utils/appError';
import { logger } from '../utils/logger';

export type CustomerFinancialSummary = {
  totalBilled: number;
  totalPaid: number;
  outstanding: number;
  orderCount: number;
  lastOrderDate: string | null;
};

export type PartyLedgerTransaction = {
  id: string;
  date: string;
  type: 'order' | 'payment' | 'manual';
  description: string;
  amount: number;
  runningBalance: number;
  referenceId?: string;
  invoiceNumber?: string;
  paymentMethod?: string;
  metadata?: Record<string, any>;
};

export type PartyLedgerSummary = {
  partyId: string;
  partyName: string;
  partyType: string;
  openingBalance: number;
  closingBalance: number;
  totalCredit: number;
  totalDebit: number;
  toCollect: number;
  toPay: number;
  transactions: PartyLedgerTransaction[];
};

export const partyBalanceService = {
  /**
   * Get financial summary for a customer or vendor.
   * Uses orders + payments (via reference_id) + credit_transactions.
   */
  async getCustomerFinancialSummary(
    orgId: string,
    partyId: string,
  ): Promise<CustomerFinancialSummary> {
    // Fetch orders and credit transactions for this party in parallel
    const [ordersResult, creditResult] = await Promise.all([
      supabase
        .from('orders')
        .select('id, total_amount, created_at')
        .eq('organization_id', orgId)
        .eq('party_id', partyId)
        .eq('is_cancelled', false),
      supabase
        .from('credit_transactions')
        .select('amount, type')
        .eq('organization_id', orgId)
        .eq('party_id', partyId),
    ]);

    if (ordersResult.error) {
      logger.error('[PartyBalance] Failed to fetch orders', ordersResult.error);
      throw toAppError(
        'partyBalance.orders',
        ordersResult.error,
        'Unable to load party orders.',
      );
    }
    
    if (creditResult.error) {
      logger.error('[PartyBalance] Failed to fetch credit transactions', creditResult.error);
      // Non-fatal, just log it. We won't block the summary if only manual credits fail to load.
    }

    const orderRows = (ordersResult.data ?? []) as { id: string; total_amount: number; created_at: string }[];
    const creditRows = (creditResult.data ?? []) as { amount: number; type: string }[];

    const orderIds = orderRows.map(r => r.id);
    let paymentRows: { amount: number; order_id: string }[] = [];

    // Fetch payments for these orders if there are any
    if (orderIds.length > 0) {
      const { data: payments, error: paymentsError } = await supabase
        .from('payments')
        .select('amount, order_id')
        .eq('organization_id', orgId)
        .in('order_id', orderIds);

      if (paymentsError) {
        logger.error('[PartyBalance] Failed to fetch payments', paymentsError);
        throw toAppError(
          'partyBalance.payments',
          paymentsError,
          'Unable to load party payments.',
        );
      }
      paymentRows = (payments ?? []) as { amount: number; order_id: string }[];
    }

    let totalBilled = orderRows.reduce((sum, r) => sum + (r.total_amount ?? 0), 0);
    let totalPaid = paymentRows.reduce((sum, r) => sum + (r.amount ?? 0), 0);

    // Fold manual credit transactions into totals
    for (const credit of creditRows) {
      if (credit.type === 'given') {
        totalBilled += (credit.amount ?? 0);
      } else if (credit.type === 'received') {
        totalPaid += (credit.amount ?? 0);
      }
    }

    const lastOrderDate =
      orderRows
        .map(r => r.created_at)
        .filter(Boolean)
        .sort()
        .at(-1) ?? null;

    return {
      totalBilled,
      totalPaid,
      outstanding: totalBilled - totalPaid,
      orderCount: orderRows.length,
      lastOrderDate,
    };
  },

  /**
   * Get comprehensive ledger for a party with transaction history.
   * Combines orders, payments, and credit_transactions.
   */
  async getPartyLedger(
    orgId: string,
    partyId: string,
  ): Promise<PartyLedgerSummary> {
    // Get party info
    const { data: partyData, error: partyError } = await supabase
      .from('parties')
      .select('id, name, type')
      .eq('id', partyId)
      .eq('organization_id', orgId)
      .single();

    if (partyError || !partyData) {
      throw toAppError(
        'partyLedger.party',
        partyError,
        'Unable to load party information.',
      );
    }

    const partyType = partyData.type || 'CUSTOMER';

    // Fetch orders, payments, and credit_transactions in parallel
    const [ordersResult, creditTxResult] = await Promise.all([
      supabase
        .from('orders')
        .select('id, invoice_number, total_amount, created_at, status, notes')
        .eq('organization_id', orgId)
        .eq('party_id', partyId)
        .eq('is_cancelled', false)
        .order('created_at', { ascending: true }),
      supabase
        .from('credit_transactions')
        .select('id, amount, type, description, date, reference_number')
        .eq('organization_id', orgId)
        .eq('party_id', partyId)
        .order('date', { ascending: true }),
    ]);

    if (ordersResult.error) {
      throw toAppError(
        'partyLedger.orders',
        ordersResult.error,
        'Unable to load party orders.',
      );
    }

    const orderRows = ordersResult.data ?? [];
    const creditTxns = creditTxResult.error ? [] : creditTxResult.data ?? [];

    // Fetch payments for orders
    const orderIds = orderRows.map(o => o.id);
    let paymentRows: any[] = [];
    if (orderIds.length > 0) {
      const { data: payments } = await supabase
        .from('payments')
        .select('id, order_id, amount, created_at, payment_method')
        .eq('organization_id', orgId)
        .in('order_id', orderIds)
        .order('created_at', { ascending: true });
      paymentRows = payments ?? [];
    }

    // Build transaction list
    const transactions: PartyLedgerTransaction[] = [];

    // Process orders (credit given to customer)
    for (const order of orderRows) {
      transactions.push({
        id: order.id,
        date: order.created_at || new Date().toISOString(),
        type: 'order',
        description: order.notes || `Order #${order.invoice_number}`,
        amount: order.total_amount || 0,
        runningBalance: 0,
        referenceId: order.id,
        invoiceNumber: order.invoice_number || undefined,
        metadata: { orderId: order.id, invoiceNumber: order.invoice_number },
      });
    }

    // Process payments
    for (const payment of paymentRows) {
      transactions.push({
        id: payment.id,
        date: payment.created_at || new Date().toISOString(),
        type: 'payment',
        description: 'Payment Received',
        amount: payment.amount || 0,
        runningBalance: 0,
        referenceId: payment.order_id,
        paymentMethod: payment.payment_method || undefined,
      });
    }

    // Process credit transactions (manual)
    for (const txn of creditTxns) {
      transactions.push({
        id: txn.id,
        date: txn.date || new Date().toISOString(),
        type: 'manual',
        description: txn.description || 'Manual Transaction',
        amount: txn.amount || 0,
        runningBalance: 0,
        metadata: { type: txn.type, referenceNumber: txn.reference_number },
      });
    }

    // Sort by date
    transactions.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    // Calculate running balances
    let balance = 0;
    for (const txn of transactions) {
      if (txn.type === 'order') {
        balance += txn.amount;
      } else if (txn.type === 'payment') {
        balance -= txn.amount;
      } else if (txn.type === 'manual') {
        if (txn.metadata?.type === 'given') {
          balance += txn.amount;
        } else {
          balance -= txn.amount;
        }
      }
      txn.runningBalance = balance;
    }

    const totalCredit = transactions
      .filter(
        t =>
          t.type === 'order' ||
          (t.type === 'manual' && t.metadata?.type === 'given'),
      )
      .reduce((sum, t) => sum + t.amount, 0);

    const totalDebit = transactions
      .filter(
        t =>
          t.type === 'payment' ||
          (t.type === 'manual' && t.metadata?.type === 'received'),
      )
      .reduce((sum, t) => sum + t.amount, 0);

    const closingBalance = balance;
    const toCollect =
      partyType === 'CUSTOMER'
        ? Math.max(0, closingBalance)
        : Math.max(0, -closingBalance);
    const toPay =
      partyType === 'CUSTOMER'
        ? Math.max(0, -closingBalance)
        : Math.max(0, closingBalance);

    return {
      partyId,
      partyName: partyData.name || 'Unknown Party',
      partyType,
      openingBalance: 0,
      closingBalance,
      totalCredit,
      totalDebit,
      toCollect,
      toPay,
      transactions: transactions.reverse(),
    };
  },

  /**
   * Record a credit transaction (e.g., unpaid portion of an invoice or a payment).
   */
  async recordCreditTransaction(
    orgId: string,
    payload: {
      party_id: string;
      amount: number;
      type: 'given' | 'received'; // 'given' for credit to customer (receivable), 'received' for payment from customer
      description: string;
      reference_number?: string;
    }
  ): Promise<void> {
    const { error } = await supabase.from('credit_transactions').insert({
      organization_id: orgId,
      party_id: payload.party_id,
      amount: payload.amount,
      type: payload.type,
      description: payload.description,
      date: new Date().toISOString(),
      reference_number: payload.reference_number,
    });

    if (error) {
      logger.error('[PartyBalance] Failed to record credit transaction', error);
      throw toAppError(
        'partyBalance.recordTransaction',
        error,
        'Unable to record credit transaction.'
      );
    }
  },
};
