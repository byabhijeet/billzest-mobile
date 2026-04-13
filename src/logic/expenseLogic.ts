import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { partiesService } from '../supabase/partiesService';
import { expensesService, Expense } from '../supabase/expensesService';
import { supabase } from '../supabase/supabaseClient';
import { useOrganization } from '../contexts/OrganizationContext';

export const EXPENSE_QUERY_KEYS = {
  categories: (orgId: string) => ['expenses-categories', orgId],
  list: (orgId: string) => ['expenses-list', orgId],
};

// Hook to fetch only expense parties (categories)
export const useExpenses = () => {
  const { organizationId } = useOrganization();
  return useQuery({
    queryKey: EXPENSE_QUERY_KEYS.categories(organizationId || ''),
    queryFn: () => partiesService.getParties(organizationId!, 'expense'),
    enabled: !!organizationId,
  });
};

// Hook to fetch expense transactions
export const useExpenseList = (startDate?: string, endDate?: string) => {
  const { organizationId } = useOrganization();
  return useQuery<Expense[]>({
    queryKey: [
      ...EXPENSE_QUERY_KEYS.list(organizationId || ''),
      startDate,
      endDate,
    ],
    queryFn: () =>
      expensesService.listExpenses(organizationId!, { startDate, endDate }),
    enabled: !!organizationId,
  });
};

export const useExpenseMutations = () => {
  const queryClient = useQueryClient();
  const { organizationId } = useOrganization();

  // Create a new Expense Category (treated as an 'expense' party)
  const createExpenseCategory = useMutation({
    mutationFn: async (vars: { name: string }) => {
      if (!organizationId) throw new Error('No organization context');
      return partiesService.createParty(organizationId, {
        name: vars.name,
        type: 'expense',
        party_type: 'vendor', // Legacy compat
        email: null,
        phone: null,
        mobile: null,
        address: null,
        notes: null,
        balance: 0,
      });
    },
    onSuccess: () => {
      if (organizationId) {
        queryClient.invalidateQueries({
          queryKey: EXPENSE_QUERY_KEYS.categories(organizationId),
        });
      }
    },
  });

  // Record an Expense Transaction
  const addExpenseEntry = useMutation({
    mutationFn: async (vars: {
      partyId: string; // The expense category party ID from the UI picker
      amount: number;
      description: string;
      date: string;
    }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || !organizationId) throw new Error('Not authenticated');

      // Get the party/category to get its name
      const party = await partiesService.getPartyById(vars.partyId);
      const categoryName = party?.name || 'Uncategorized';

      return expensesService.createExpense(organizationId, user.id, {
        category: categoryName,
        amount: vars.amount,
        date: vars.date,
        description: vars.description,
      });
    },
    onSuccess: () => {
      if (organizationId) {
        queryClient.invalidateQueries({
          queryKey: EXPENSE_QUERY_KEYS.categories(organizationId),
        });
        queryClient.invalidateQueries({
          queryKey: EXPENSE_QUERY_KEYS.list(organizationId),
        });
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      }
    },
  });

  const deleteExpenseEntry = useMutation({
    mutationFn: (id: string) => expensesService.deleteExpense(id),
    onSuccess: () => {
      if (organizationId) {
        queryClient.invalidateQueries({
          queryKey: EXPENSE_QUERY_KEYS.list(organizationId),
        });
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      }
    },
  });

  return {
    createExpenseCategory,
    addExpenseEntry,
    deleteExpenseEntry,
  };
};
