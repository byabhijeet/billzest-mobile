import { supabase } from './supabaseClient';
import { toAppError } from '../utils/appError';
import { logger } from '../utils/logger';

export type CreditBookEntryStatus = 'critical' | 'overdue' | 'upcoming';

export type CreditBookEntry = {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  status: CreditBookEntryStatus;
};

export type CreditBookSummary = {
  totalOutstanding: number;
  accountCount: number;
  last30DaysSettled: number;
  entries: CreditBookEntry[];
};

const startOfToday = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

const daysBetween = (from: Date, to: Date) => {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((to.getTime() - from.getTime()) / msPerDay);
};

export const creditBookService = {
  /**
   * Get receivables (credit given to customers).
   * Uses credit_transactions with type='given' where party.type = 'CUSTOMER'.
   */
  async getReceivables(orgId: string): Promise<CreditBookSummary> {
    const [partiesResult, transactionsResult] = await Promise.all([
      supabase
        .from('parties')
        .select('id, name')
        .eq('organization_id', orgId)
        .eq('type', 'CUSTOMER')
        .is('deleted_at', null),
      supabase
        .from('credit_transactions')
        .select('id, party_id, amount, date, type')
        .eq('organization_id', orgId),
    ]);

    if (partiesResult.error) {
      logger.error('[CreditBook] Failed to fetch parties', partiesResult.error);
      throw toAppError(
        'creditbook.parties',
        partiesResult.error,
        'Unable to load parties for Credit Book.',
      );
    }

    if (transactionsResult.error) {
      logger.error(
        '[CreditBook] Failed to fetch transactions',
        transactionsResult.error,
      );
      throw toAppError(
        'creditbook.transactions',
        transactionsResult.error,
        'Unable to load transactions for Credit Book.',
      );
    }

    const parties = partiesResult.data ?? [];
    const transactions = transactionsResult.data ?? [];

    const today = startOfToday();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Build per-party balances from credit_transactions
    // 'given' = credit given (increases receivable)
    // 'received' = payment received (decreases receivable)
    const perParty = new Map<
      string,
      { outstanding: number; lastDate: Date | null }
    >();
    let last30DaysSettled = 0;

    for (const tx of transactions) {
      const partyId = tx.party_id;
      const existing = perParty.get(partyId) ?? {
        outstanding: 0,
        lastDate: null,
      };

      if (tx.type === 'given') {
        existing.outstanding += tx.amount ?? 0;
      } else if (tx.type === 'received') {
        existing.outstanding -= tx.amount ?? 0;

        // Track settlements in last 30 days
        if (tx.date) {
          const txDate = new Date(tx.date);
          if (txDate >= thirtyDaysAgo && txDate <= today) {
            last30DaysSettled += tx.amount ?? 0;
          }
        }
      }

      const txDate = tx.date ? new Date(tx.date) : null;
      if (txDate && (!existing.lastDate || txDate > existing.lastDate)) {
        existing.lastDate = txDate;
      }

      perParty.set(partyId, existing);
    }

    const partiesById = new Map(parties.map(p => [p.id, p.name]));

    const entries: CreditBookEntry[] = [];
    let totalOutstanding = 0;

    for (const [partyId, acc] of perParty.entries()) {
      if (acc.outstanding <= 0) continue;

      const partyName = partiesById.get(partyId);
      if (!partyName) continue; // Not a customer party

      totalOutstanding += acc.outstanding;

      let dueLabel = 'No due date';
      let status: CreditBookEntryStatus = 'upcoming';

      if (acc.lastDate) {
        const diff = daysBetween(today, acc.lastDate);
        if (diff < -30) {
          status = 'critical';
          dueLabel = `Overdue by ${Math.abs(diff)} days`;
        } else if (diff < 0) {
          status = 'overdue';
          dueLabel = `${Math.abs(diff)} days ago`;
        } else {
          dueLabel = `${diff} days ago`;
        }
      }

      entries.push({
        id: partyId,
        name: partyName,
        amount: acc.outstanding,
        dueDate: dueLabel,
        status,
      });
    }

    entries.sort((a, b) => b.amount - a.amount);

    return {
      totalOutstanding,
      accountCount: entries.length,
      last30DaysSettled,
      entries,
    };
  },

  /**
   * Get payables (credit received from vendors).
   * Uses credit_transactions where party.type = 'VENDOR'.
   */
  async getPayables(orgId: string): Promise<CreditBookSummary> {
    const [partiesResult, transactionsResult] = await Promise.all([
      supabase
        .from('parties')
        .select('id, name')
        .eq('organization_id', orgId)
        .eq('type', 'VENDOR')
        .is('deleted_at', null),
      supabase
        .from('credit_transactions')
        .select('id, party_id, amount, date, type')
        .eq('organization_id', orgId),
    ]);

    if (partiesResult.error || transactionsResult.error) {
      return {
        totalOutstanding: 0,
        accountCount: 0,
        last30DaysSettled: 0,
        entries: [],
      };
    }

    const parties = partiesResult.data ?? [];
    const transactions = transactionsResult.data ?? [];
    const vendorIds = new Set(parties.map(p => p.id));
    const partiesById = new Map(parties.map(p => [p.id, p.name]));

    const perVendor = new Map<string, number>();
    let last30DaysSettled = 0;
    const today = startOfToday();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    for (const tx of transactions) {
      if (!vendorIds.has(tx.party_id)) continue;

      const existing = perVendor.get(tx.party_id) ?? 0;
      if (tx.type === 'received') {
        perVendor.set(tx.party_id, existing + (tx.amount ?? 0));
      } else if (tx.type === 'given') {
        perVendor.set(tx.party_id, existing - (tx.amount ?? 0));

        if (tx.date) {
          const txDate = new Date(tx.date);
          if (txDate >= thirtyDaysAgo && txDate <= today) {
            last30DaysSettled += tx.amount ?? 0;
          }
        }
      }
    }

    const entries: CreditBookEntry[] = [];
    let totalOutstanding = 0;

    for (const [vendorId, amount] of perVendor.entries()) {
      if (amount <= 0) continue;
      totalOutstanding += amount;
      entries.push({
        id: vendorId,
        name: partiesById.get(vendorId) ?? 'Unknown Vendor',
        amount,
        dueDate: 'Pending',
        status: 'upcoming',
      });
    }

    entries.sort((a, b) => b.amount - a.amount);

    return {
      totalOutstanding,
      accountCount: entries.length,
      last30DaysSettled,
      entries,
    };
  },
};
