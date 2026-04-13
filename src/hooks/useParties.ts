import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { partiesService } from '../supabase/partiesService';
import { Party } from '../types/domain';
import { useOrganization } from '../contexts/OrganizationContext';

export const useParties = (type?: Party['type']) => {
  const { organizationId } = useOrganization();
  return useQuery({
    queryKey: ['parties', organizationId, type],
    queryFn: () => partiesService.getParties(organizationId!, type),
    enabled: !!organizationId,
  });
};

export const usePartyMutations = () => {
  const queryClient = useQueryClient();
  const { organizationId } = useOrganization();

  const createParty = useMutation({
    mutationFn: (
      input: Omit<
        Party,
        'id' | 'created_at' | 'updated_at' | 'organization_id'
      >,
    ) => {
      if (!organizationId) throw new Error('No organization context');
      return partiesService.createParty(organizationId, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parties'] });
    },
  });

  const updateParty = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Party> }) => {
      if (!organizationId) throw new Error('No organization context');
      return partiesService.updateParty(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parties'] });
    },
  });

  const deleteParty = useMutation({
    mutationFn: partiesService.deleteParty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parties'] });
    },
  });

  return {
    createParty,
    updateParty,
    deleteParty,
  };
};
