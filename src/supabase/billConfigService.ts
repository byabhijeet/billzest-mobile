import { supabase } from './supabaseClient';
import { Database } from '../database.types';
import { offlineStorage } from '../offline/storage';
import { toAppError } from '../utils/appError';
import { logger } from '../utils/logger';

export type BillConfigRow = Database['public']['Tables']['bill_config']['Row'];

export type BillConfigInput = {
  header_text?: string | null;
  footer_text?: string | null;
  show_logo?: boolean;
  show_tax_details?: boolean;
  font_size?: string;
  paper_size?: string;
  logo_url?: string | null;
  print_qr_code?: boolean;
  qr_code_data?: string | null;
};

export const billConfigService = {
  /**
   * Get bill config for the organization.
   */
  async getConfig(orgId: string): Promise<BillConfigRow | null> {
    try {
      const { data, error } = await supabase
        .from('bill_config')
        .select('*')
        .eq('organization_id', orgId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        logger.error('[BillConfig] Failed to fetch config', error);
        throw toAppError(
          'billConfig.fetch',
          error,
          'Unable to load bill settings.',
        );
      }

      const row = (data as BillConfigRow | null) ?? null;
      if (row) {
        await offlineStorage.setCache('billConfig', row);
      }
      return row;
    } catch (error) {
      logger.error('[BillConfig] Falling back to offline cache', error);
      const cached = await offlineStorage.getCache<BillConfigRow | null>(
        'billConfig',
      );
      if (cached) return cached;
      throw toAppError(
        'billConfig.offline',
        error,
        'Unable to load bill settings. Please check your connection.',
        {
          code: 'offline',
        },
      );
    }
  },

  /**
   * Save (upsert) bill config for the organization.
   */
  async saveConfig(
    orgId: string,
    input: BillConfigInput,
  ): Promise<BillConfigRow> {
    const existing = await this.getConfig(orgId);

    if (!existing) {
      const { data, error } = await supabase
        .from('bill_config')
        .insert({
          ...input,
          organization_id: orgId,
        })
        .select('*')
        .single();

      if (error) {
        logger.error('[BillConfig] Failed to create config', error);
        throw toAppError(
          'billConfig.create',
          error,
          'Unable to save bill settings.',
        );
      }

      const created = data as BillConfigRow;
      await offlineStorage.setCache('billConfig', created);
      return created;
    }

    const { data, error } = await supabase
      .from('bill_config')
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
      .select('*')
      .single();

    if (error) {
      logger.error('[BillConfig] Failed to update config', error);
      throw toAppError(
        'billConfig.update',
        error,
        'Unable to update bill settings.',
      );
    }

    const updated = data as BillConfigRow;
    await offlineStorage.setCache('billConfig', updated);
    return updated;
  },
};
