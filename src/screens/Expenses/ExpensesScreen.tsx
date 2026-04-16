import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useThemeTokens } from '../../theme/ThemeProvider';
import { ThemeTokens } from '../../theme/tokens';
import { useQuery } from '@tanstack/react-query';
import { expensesService, Expense } from '../../supabase/expensesService';
import EmptyState from '../../components/EmptyState';
import ExpenseListSkeleton from '../../components/skeletons/ExpenseListSkeleton';
import FAB from '../../components/ui/FAB';
import AddExpenseSheet from '../../components/modals/AddExpenseSheet';
import ListHeader from '../../components/layout/ListHeader';
import {
  Wallet,
  AlertTriangle,
  Plus,
  CalendarDays,
  Tag,
  TrendingDown,
} from 'lucide-react-native';
import { useOrganization } from '../../contexts/OrganizationContext';

const formatCurrency = (amount: number) =>
  `₹${(amount ?? 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

const ExpensesScreen: React.FC = () => {
  const { tokens } = useThemeTokens();
  const styles = useMemo(() => createStyles(tokens), [tokens]);
  const [isExpenseSheetVisible, setExpenseSheetVisible] = useState(false);

  const { organizationId } = useOrganization();

  const {
    data: expenses = [],
    isLoading,
    isRefetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ['expenses', 'list', organizationId],
    queryFn: () => expensesService.listExpenses(organizationId!),
    enabled: !!organizationId,
  });

  const total = useMemo(
    () => expenses.reduce((sum, exp) => sum + (exp.amount ?? 0), 0),
    [expenses],
  );

  const handleAddExpense = () => {
    setExpenseSheetVisible(true);
  };

  const handleExpenseSheetClose = () => {
    setExpenseSheetVisible(false);
    refetch();
  };

  return (
    <View style={styles.screen}>
      <ListHeader title="Expenses" />

      {/* ── Total Summary Strip ── */}
      <View style={styles.summaryStrip}>
        <View style={styles.summaryCell}>
          <Text style={styles.summaryLabel}>TOTAL SPENT</Text>
          <Text style={styles.summaryValue}>{formatCurrency(total)}</Text>
        </View>
        <View style={styles.summaryCell}>
          <Text style={styles.summaryLabel}>ENTRIES</Text>
          <Text style={styles.summaryValue}>{expenses.length}</Text>
        </View>
      </View>

      {isLoading && !isRefetching ? (
        <ExpenseListSkeleton />
      ) : error ? (
        <EmptyState
          icon={<AlertTriangle color={tokens.destructive} size={32} />}
          title="Unable to load expenses"
          description="Check your connection and try again."
          actionLabel="Retry"
          onAction={() => refetch()}
        />
      ) : (
        <FlatList<Expense>
          data={expenses}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={tokens.primary}
            />
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={() => (
            <EmptyState
              icon={<Wallet color={tokens.primary} size={32} />}
              title="No expenses yet"
              description="Start tracking your business expenses to better manage your finances."
              actionLabel="Add Expense"
              onAction={handleAddExpense}
            />
          )}
          renderItem={({ item }) => (
            // No detail screen — render as static card (no Pressable wrapper)
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleBlock}>
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {item.description || 'Expense'}
                  </Text>
                  {item.party_name && (
                    <View style={styles.categoryBadge}>
                      <Tag color={tokens.primary} size={12} />
                      <Text style={styles.categoryText}>{item.party_name}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.amountBlock}>
                  <Text style={styles.cardAmount}>
                    {formatCurrency(item.amount)}
                  </Text>
                </View>
              </View>
              <View style={styles.cardFooter}>
                <View style={styles.cardMetaRow}>
                  <CalendarDays color={tokens.mutedForeground} size={14} />
                  <Text style={styles.cardMeta}>
                    {new Date(item.date).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                </View>
                <TrendingDown color={tokens.destructive} size={14} />
              </View>
            </View>
          )}
          contentContainerStyle={
            expenses.length === 0 ? styles.listEmpty : styles.listContent
          }
          style={styles.list}
        />
      )}

      <FAB
        label="Add Expense"
        icon={<Plus color={tokens.primaryForeground} size={20} />}
        onPress={handleAddExpense}
        accessibilityLabel="Add expense"
      />

      <AddExpenseSheet
        visible={isExpenseSheetVisible}
        onClose={handleExpenseSheetClose}
      />
    </View>
  );
};

const createStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: tokens.background,
    },
    // ── Summary strip ────────────────────────────────────────────────────
    summaryStrip: {
      flexDirection: 'row',
      gap: tokens.spacingXs,
      paddingHorizontal: tokens.spacingLg,
      paddingBottom: tokens.spacingSm,
    },
    summaryCell: {
      flex: 1,
      backgroundColor: tokens.surface_container_lowest,
      paddingVertical: tokens.spacingSm,
      paddingHorizontal: tokens.spacingSm,
      borderLeftWidth: 3,
      borderLeftColor: tokens.destructiveAlpha30,
    },
    summaryLabel: {
      fontSize: 10,
      fontWeight: '800',
      letterSpacing: 0.5,
      color: tokens.mutedForeground,
      textTransform: 'uppercase',
      marginBottom: tokens.spacingXs,
    },
    summaryValue: {
      fontSize: 16,
      fontWeight: '800',
      color: tokens.foreground,
      letterSpacing: -0.3,
    },
    // ── List ─────────────────────────────────────────────────────────────
    list: {
      flex: 1,
    },
    listContent: {
      paddingHorizontal: tokens.spacingLg,
      paddingBottom: 100,
    },
    listEmpty: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingHorizontal: tokens.spacingLg,
    },
    separator: {
      height: tokens.spacingMd,
    },
    // ── Card ─────────────────────────────────────────────────────────────
    card: {
      borderRadius: tokens.radiusLg,
      backgroundColor: tokens.surface_container_lowest,
      padding: tokens.spacingLg,
      marginBottom: tokens.spacingMd,
      // No-Line Rule: use shadow instead of border
      shadowColor: tokens.shadowColor,
      shadowOpacity: 0.06,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 8,
      elevation: 2,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: tokens.spacingMd,
    },
    cardTitleBlock: {
      flex: 1,
      paddingRight: tokens.spacingMd,
    },
    cardTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: tokens.foreground,
      marginBottom: tokens.spacingSm,
      lineHeight: 22,
    },
    categoryBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      backgroundColor: tokens.primaryAlpha15,
      borderRadius: tokens.radiusSm,
      paddingHorizontal: tokens.spacingSm + 2,
      paddingVertical: 4,
      gap: 6,
    },
    categoryText: {
      fontSize: 11,
      fontWeight: '600',
      color: tokens.primary,
    },
    amountBlock: {
      alignItems: 'flex-end',
    },
    cardAmount: {
      fontSize: 18,
      fontWeight: '800',
      color: tokens.destructive,
    },
    cardFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: tokens.spacingMd,
    },
    cardMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    cardMeta: {
      fontSize: 12,
      color: tokens.mutedForeground,
      fontWeight: '500',
    },
  });

export default ExpensesScreen;
