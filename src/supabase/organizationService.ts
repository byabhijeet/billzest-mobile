import { supabase } from './supabaseClient';
import { logger } from '../utils/logger';
import type { Organization } from '../types/domain';

/**
 * Service for organization-related Supabase queries.
 */
export const organizationService = {
  /**
   * Find the organization_id for a given user by looking up organization_members.
   */
  async getOrganizationForUser(
    userId: string,
  ): Promise<{ organizationId: string; role: string } | null> {
    const { data, error } = await supabase
      .from('organization_members')
      .select('organization_id, role')
      .eq('user_id', userId)
      .eq('is_active', true)
      .limit(1)
      .single();

    if (error || !data) {
      logger.error(
        '[OrgService] getOrganizationForUser failed',
        error?.message,
      );
      return null;
    }

    return {
      organizationId: data.organization_id,
      role: data.role ?? 'CASHIER',
    };
  },

  /**
   * Fetch the full organization record.
   */
  async getOrganization(orgId: string): Promise<Organization | null> {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', orgId)
      .single();

    if (error || !data) {
      logger.error('[OrgService] getOrganization failed', error?.message);
      return null;
    }

    return data as Organization;
  },

  /**
   * Update organization details (business info).
   */
  async updateOrganization(
    orgId: string,
    updates: Partial<Omit<Organization, 'id' | 'owner_id' | 'created_at'>>,
  ): Promise<Organization | null> {
    const { data, error } = await supabase
      .from('organizations')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', orgId)
      .select('*')
      .single();

    if (error || !data) {
      logger.error('[OrgService] updateOrganization failed', error?.message);
      return null;
    }

    return data as Organization;
  },

  /**
   * Fetch organization settings.
   */
  async getSettings(orgId: string) {
    const { data, error } = await supabase
      .from('organization_settings')
      .select('*')
      .eq('organization_id', orgId)
      .single();

    if (error) {
      logger.error('[OrgService] getSettings failed', error.message);
      return null;
    }

    return data;
  },
};
