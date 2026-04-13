import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { supabase } from '../supabase/supabaseClient';
import { useSupabase } from './SupabaseContext';
import { logger } from '../utils/logger';
import type { Organization } from '../types/domain';

interface OrganizationContextSchema {
  /** The resolved organization_id for the current user */
  organizationId: string | null;
  /** Full organization record */
  organization: Organization | null;
  /** User's role within the organization */
  memberRole: string | null;
  /** True while resolving the org on login */
  isLoading: boolean;
  /** Set when the user has no linked organization */
  hasNoOrg: boolean;
  /** Re-fetch organization data */
  refresh: () => Promise<void>;
}

const OrganizationContext = createContext<
  OrganizationContextSchema | undefined
>(undefined);

export const OrganizationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useSupabase();
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [memberRole, setMemberRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasNoOrg, setHasNoOrg] = useState(false);

  const resolveOrganization = useCallback(async () => {
    if (!user) {
      setOrganizationId(null);
      setOrganization(null);
      setMemberRole(null);
      setIsLoading(false);
      setHasNoOrg(false);
      return;
    }

    try {
      setIsLoading(true);
      setHasNoOrg(false);

      // 1. Find the user's organization via organization_members
      const { data: memberRow, error: memberError } = await supabase
        .from('organization_members')
        .select('organization_id, role')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .limit(1)
        .single();

      if (memberError || !memberRow) {
        logger.error(
          '[Org] No organization found for user',
          memberError?.message,
        );
        setHasNoOrg(true);
        setIsLoading(false);
        return;
      }

      const orgId = memberRow.organization_id;
      setOrganizationId(orgId);
      setMemberRole(memberRow.role ?? 'CASHIER');

      // 2. Fetch full organization record
      const { data: orgRow, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', orgId)
        .single();

      if (orgError || !orgRow) {
        logger.error(
          '[Org] Failed to fetch organization details',
          orgError?.message,
        );
        // We still have orgId, so the app can function
      } else {
        setOrganization(orgRow as Organization);
      }
    } catch (err) {
      logger.error('[Org] Unexpected error resolving organization', err);
      setHasNoOrg(true);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    resolveOrganization();
  }, [resolveOrganization]);

  return (
    <OrganizationContext.Provider
      value={{
        organizationId,
        organization,
        memberRole,
        isLoading,
        hasNoOrg,
        refresh: resolveOrganization,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};

/**
 * Returns the current user's organization context.
 *
 * Usage:
 * ```tsx
 * const { organizationId } = useOrganization();
 * // pass organizationId to all service calls
 * ```
 */
export const useOrganization = (): OrganizationContextSchema => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error(
      'useOrganization must be used within an OrganizationProvider',
    );
  }
  return context;
};
