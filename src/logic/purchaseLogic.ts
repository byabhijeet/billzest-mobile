import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  purchasesService,
  PurchaseOrder,
  CreatePurchasePayload,
} from '../supabase/purchasesService';
import { useOrganization } from '../contexts/OrganizationContext';

export const PURCHASE_QUERY_KEYS = {
  list: (orgId: string, search?: string, status?: string) => [
    'purchases',
    orgId,
    { search, status },
  ],
  detail: (orgId: string, id: string) => ['purchase', orgId, id],
};

export const usePurchases = (search?: string, status?: string) => {
  const { organizationId } = useOrganization();
  return useQuery<PurchaseOrder[]>({
    queryKey: PURCHASE_QUERY_KEYS.list(organizationId || '', search, status),
    queryFn: () =>
      purchasesService.listPurchases(organizationId!, { search, status }),
    enabled: !!organizationId,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnReconnect: true,
    refetchOnMount: false,
  });
};

export const usePurchaseDetail = (id?: string) => {
  const { organizationId } = useOrganization();
  return useQuery<PurchaseOrder | null>({
    queryKey: id
      ? PURCHASE_QUERY_KEYS.detail(organizationId || '', id)
      : ['purchase', 'none'],
    queryFn: () =>
      id ? purchasesService.getPurchaseById(id) : Promise.resolve(null),
    enabled: !!organizationId && !!id,
  });
};

export const useCreatePurchase = () => {
  const queryClient = useQueryClient();
  const { organizationId } = useOrganization();

  return useMutation({
    mutationFn: (payload: CreatePurchasePayload) =>
      purchasesService.createPurchase(organizationId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      queryClient.invalidateQueries({ queryKey: ['products'] }); // Invalidate products to refresh stock
    },
  });
};

export const useUpdatePurchaseStatus = () => {
  const queryClient = useQueryClient();
  const { organizationId } = useOrganization();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      purchasesService.updatePurchaseStatus(organizationId!, id, status),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      queryClient.invalidateQueries({ queryKey: ['purchase', variables.id] });
    },
  });
};

export const useReceiveItems = () => {
  const queryClient = useQueryClient();
  const { organizationId } = useOrganization();

  return useMutation({
    mutationFn: ({ p_po_id, p_items }: { p_po_id: string; p_items: any[] }) =>
      purchasesService.receiveAndVerifyItems({ p_po_id, p_organization_id: organizationId!, p_items }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      queryClient.invalidateQueries({ queryKey: ['purchase', variables.p_po_id] });
      queryClient.invalidateQueries({ queryKey: ['products'] }); // Invalidate products to refresh stock
    },
  });
};


export const usePurchaseTotals = (
  items: Array<{ quantity: number; unit_price: number; taxRate?: number }>,
) => {
  return useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0,
    );
    const taxAmount = items.reduce((sum, item) => {
      const rate = item.taxRate ?? 0;
      return sum + (item.unit_price * item.quantity * rate) / 100;
    }, 0);
    const grandTotal = subtotal + taxAmount;

    return { subtotal, taxAmount, grandTotal };
  }, [items]);
};
