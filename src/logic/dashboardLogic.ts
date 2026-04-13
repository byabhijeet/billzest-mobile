import { useQuery } from '@tanstack/react-query';
import { dashboardService, DashboardKpis } from '../supabase/dashboardService';
import { useOrganization } from '../contexts/OrganizationContext';

export const DASHBOARD_QUERY_KEYS = {
  kpis: (orgId: string) => ['dashboard', 'kpis', orgId] as const,
};

export const useDashboardKpis = (
  dateRange: 'Today' | 'Week' | 'Month' | 'Year' = 'Today',
) => {
  const { organizationId } = useOrganization();
  return useQuery<DashboardKpis>({
    queryKey: [...DASHBOARD_QUERY_KEYS.kpis(organizationId || ''), dateRange],
    queryFn: () => dashboardService.getKpis(organizationId!, dateRange),
    enabled: !!organizationId,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnReconnect: true,
    refetchOnMount: false,
  });
};
