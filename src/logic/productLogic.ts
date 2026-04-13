import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsService } from '../supabase/productsService';
import { Product } from '../types/domain';
import { useOrganization } from '../contexts/OrganizationContext';

export const PRODUCT_QUERY_KEYS = {
  products: (orgId: string) => ['products', orgId],
  detail: (orgId: string, id: string) => ['product', orgId, id],
};

export const useProducts = () => {
  const { organizationId } = useOrganization();
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.products(organizationId || ''),
    queryFn: () => productsService.getProducts(organizationId!),
    enabled: !!organizationId,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnReconnect: true,
    refetchOnMount: false,
  });
};

export const useProductMutations = () => {
  const queryClient = useQueryClient();
  const { organizationId } = useOrganization();

  const createProduct = useMutation({
    mutationFn: (
      product: Omit<
        Product,
        'id' | 'organization_id' | 'created_at' | 'updated_at'
      >,
    ) => productsService.createProduct(organizationId!, product),
    onSuccess: () => {
      if (organizationId) {
        queryClient.invalidateQueries({
          queryKey: PRODUCT_QUERY_KEYS.products(organizationId),
        });
      }
    },
  });

  const updateProduct = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Product> }) =>
      productsService.updateProduct(organizationId!, id, updates),
    onSuccess: () => {
      if (organizationId) {
        queryClient.invalidateQueries({
          queryKey: PRODUCT_QUERY_KEYS.products(organizationId),
        });
      }
    },
  });

  const deleteProduct = useMutation({
    mutationFn: (id: string) => productsService.deleteProduct(id),
    onSuccess: () => {
      if (organizationId) {
        queryClient.invalidateQueries({
          queryKey: PRODUCT_QUERY_KEYS.products(organizationId),
        });
      }
    },
  });

  return {
    createProduct,
    updateProduct,
    deleteProduct,
  };
};
