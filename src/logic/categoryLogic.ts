import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesService } from '../supabase/categoriesService';
import { useOrganization } from '../contexts/OrganizationContext';
import { Category } from '../types/domain';

const QUERY_KEY = 'categories';

export const useCategories = () => {
  const { organizationId } = useOrganization();

  return useQuery({
    queryKey: [QUERY_KEY, organizationId],
    queryFn: async () => {
      if (!organizationId) throw new Error('No organization ID');
      return await categoriesService.getCategories(organizationId);
    },
    enabled: !!organizationId,
  });
};

export const useCategoryMutations = () => {
  const queryClient = useQueryClient();
  const { organizationId } = useOrganization();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY, organizationId] });
  };

  const createCategory = useMutation({
    mutationFn: async (input: {
      name: string;
      icon?: string;
      gst_rate?: number;
      parent_id?: string;
    }) => {
      if (!organizationId) throw new Error('No organization ID');
      const category = await categoriesService.createCategory(organizationId, input);
      if (!category) throw new Error('Failed to create category');
      return category;
    },
    onSuccess: invalidate,
  });

  const updateCategory = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Pick<Category, 'name' | 'icon' | 'gst_rate' | 'is_active'>>;
    }) => {
      const category = await categoriesService.updateCategory(id, updates);
      if (!category) throw new Error('Failed to update category');
      return category;
    },
    onSuccess: invalidate,
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      const success = await categoriesService.deleteCategory(id);
      if (!success) throw new Error('Failed to delete category');
      return success;
    },
    onSuccess: invalidate,
  });

  return {
    createCategory,
    updateCategory,
    deleteCategory,
  };
};
