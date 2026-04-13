import { useQuery } from '@tanstack/react-query';
import {
  creditBookService,
  CreditBookSummary,
} from '../supabase/creditBookService';
import { useOrganization } from '../contexts/OrganizationContext';

export const CREDIT_BOOK_QUERY_KEYS = {
  receivables: (orgId: string) => ['creditBook', 'receivables', orgId] as const,
  payables: (orgId: string) => ['creditBook', 'payables', orgId] as const,
};

export const useCreditBookReceivables = () => {
  const { organizationId } = useOrganization();
  return useQuery<CreditBookSummary>({
    queryKey: CREDIT_BOOK_QUERY_KEYS.receivables(organizationId || ''),
    queryFn: () => creditBookService.getReceivables(organizationId!),
    enabled: !!organizationId,
    staleTime: 30 * 1000,
  });
};

export const useCreditBookPayables = () => {
  const { organizationId } = useOrganization();
  return useQuery<CreditBookSummary>({
    queryKey: CREDIT_BOOK_QUERY_KEYS.payables(organizationId || ''),
    queryFn: () => creditBookService.getPayables(organizationId!),
    enabled: !!organizationId,
    staleTime: 30 * 1000,
  });
};
