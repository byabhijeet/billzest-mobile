import { supabase } from './supabaseClient';
import { toAppError } from '../utils/appError';
import { logger } from '../utils/logger';

/**
 * @deprecated Use partiesService with type filter instead.
 * This thin wrapper exists for backward compatibility with the CreditBook screens.
 */
export type CreditParty = {
  id: string;
  name: string;
  type: string;
  mobile?: string | null;
  balance?: number | null;
  organization_id?: string;
  created_at?: string | null;
  updated_at?: string | null;
};

export const creditPartiesService = {
  /**
   * Get parties that have credit balances (customers and vendors).
   */
  async getCreditParties(orgId: string): Promise<CreditParty[]> {
    const { data, error } = await supabase
      .from('parties')
      .select('id, name, type, mobile, balance, organization_id, created_at')
      .eq('organization_id', orgId)
      .is('deleted_at', null)
      .in('type', ['CUSTOMER', 'VENDOR'])
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('[CreditParties] Failed to fetch', error);
      throw toAppError(
        'creditParties.list',
        error,
        'Unable to load credit parties.',
      );
    }

    return (data ?? []) as CreditParty[];
  },
};
