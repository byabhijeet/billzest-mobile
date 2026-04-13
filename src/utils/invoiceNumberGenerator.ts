/**
 * Invoice Number Generation Service
 * Generates sequential invoice numbers in format: INV-00001, INV-00002, etc.
 */

import { supabase } from '../supabase/supabaseClient';

/**
 * Checks if an invoice number already exists for the current user
 * @param invoiceNumber - The invoice number to check
 * @returns Promise<boolean> - True if the invoice number exists
 */
export const checkInvoiceNumberExists = async (
  invoiceNumber: string,
  orgId?: string,
): Promise<boolean> => {
  try {
    if (!orgId) {
      return false;
    }

    const { data, error } = await supabase
      .from('orders')
      .select('id')
      .eq('organization_id', orgId)
      .eq('invoice_number', invoiceNumber)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.warn(
        '[InvoiceNumber] Error checking invoice number existence',
        error,
      );
      return false;
    }

    return data !== null;
  } catch (error) {
    console.error('[InvoiceNumber] Error checking invoice number', error);
    return false;
  }
};

/**
 * Generates the next invoice number for the current user
 * Format: INV-00001, INV-00002, etc.
 *
 * @returns Promise<string> - The next invoice number
 */
export const generateInvoiceNumber = async (
  orgId?: string,
): Promise<string> => {
  try {
    if (!orgId) {
      return `INV-${Date.now()}`;
    }

    // Get the highest invoice number for this organization
    const { data: orders, error } = await supabase
      .from('orders')
      .select('invoice_number')
      .eq('organization_id', orgId)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.warn(
        '[InvoiceNumber] Failed to fetch orders, using fallback',
        error,
      );
      return `INV-${Date.now()}`;
    }

    // Extract the highest number from existing orders
    let maxNumber = 0;

    if (orders && orders.length > 0) {
      for (const order of orders) {
        const match = order.invoice_number?.match(/INV-(\d+)/i);
        if (match) {
          const num = parseInt(match[1], 10);
          if (!isNaN(num) && num > maxNumber) {
            maxNumber = num;
          }
        }
      }
    }

    const nextNumber = maxNumber + 1;
    return `INV-${String(nextNumber).padStart(5, '0')}`;
  } catch (error) {
    console.error('[InvoiceNumber] Error generating invoice number', error);
    return `INV-${Date.now()}`;
  }
};

/**
 * Generates a purchase order number
 * Format: PO-00001, PO-00002, etc.
 */
export const generatePurchaseOrderNumber = async (
  orgId?: string,
): Promise<string> => {
  try {
    if (!orgId) {
      return `PO-${Date.now()}`;
    }

    const { data: purchases, error } = await supabase
      .from('purchase_orders')
      .select('order_number')
      .eq('organization_id', orgId)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.warn(
        '[PurchaseOrder] Failed to fetch purchases, using fallback',
        error,
      );
      return `PO-${Date.now()}`;
    }

    let maxNumber = 0;

    if (purchases && purchases.length > 0) {
      for (const purchase of purchases) {
        const match = purchase.order_number?.match(/PO-(\d+)/i);
        if (match) {
          const num = parseInt(match[1], 10);
          if (!isNaN(num) && num > maxNumber) {
            maxNumber = num;
          }
        }
      }
    }

    const nextNumber = maxNumber + 1;
    return `PO-${String(nextNumber).padStart(5, '0')}`;
  } catch (error) {
    console.error('[PurchaseOrder] Error generating order number', error);
    return `PO-${Date.now()}`;
  }
};
