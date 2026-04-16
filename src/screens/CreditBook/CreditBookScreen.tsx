import React, { useState, useMemo } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Platform,
} from 'react-native';
import Button from '../../components/ui/Button';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { useThemeTokens } from '../../theme/ThemeProvider';
import { ThemeTokens } from '../../theme/tokens';
import ScreenWrapper from '../../components/ScreenWrapper';
import SearchBar from '../../components/SearchBar';
import ListHeader from '../../components/layout/ListHeader';
import {
  Users,
  AlertTriangle,
  PlusCircle,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react-native';
import { useParties } from '../../hooks/useParties';
import { useOrganization } from '../../contexts/OrganizationContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../supabase/supabaseClient';
import EmptyState from '../../components/EmptyState';
import CreditBookSkeleton from '../../components/skeletons/CreditBookSkeleton';
import RecordPaymentSheet from '../../components/modals/RecordPaymentSheet';
import { Banknote } from 'lucide-react-native';
import { Party } from '../../types/domain';
import type { AppNavigationParamList } from '../../navigation/types';

const CreditBookScreen: React.FC = () => {
  const { tokens } = useThemeTokens();
  const styles = React.useMemo(() => createStyles(tokens), [tokens]);
  const navigation = useNavigation<NavigationProp<AppNavigationParamList>>();

  const [activeTab, setActiveTab] = useState<'customer' | 'vendor'>('customer');
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentSheetVisible, setPaymentSheetVisible] = useState(false);
  const [selectedPartyForPayment, setSelectedPartyForPayment] =
    useState<Party | null>(null);

  // Fetch real parties data
  const {
    data: allParties = [],
    isLoading: partiesLoading,
    error: partiesError,
    refetch: refetchParties,
  } = useParties();

  const { organizationId } = useOrganization();

  // Calculate balances from orders
  const { data: partiesWithCalculatedBalances = [] } = useQuery({
    queryKey: ['parties', organizationId, 'with-balances'],
    queryFn: async () => {
      if (!organizationId) return [];

      // V2: Orders track total_amount and received_amount directly
      const { data: orders } = await supabase
        .from('orders')
        .select(
          'id, party_id, total_amount, received_amount, status, is_cancelled',
        )
        .eq('organization_id', organizationId)
        .eq('is_cancelled', false);

      const orderRows = orders ?? [];

      // Calculate outstanding per party
      const balanceByParty = new Map<string, number>();
      orderRows.forEach(ord => {
        if (ord.status === 'cancelled') return;
        const total = ord.total_amount ?? 0;
        const received = (ord as any).received_amount ?? 0;
        const outstanding = Math.max(0, total - received);
        const current = balanceByParty.get(ord.party_id) ?? 0;
        balanceByParty.set(ord.party_id, current + outstanding);
      });

      // Map parties with calculated balances
      return (allParties ?? []).map(party => {
        if (party.party_type === 'customer') {
          return { ...party, balance: balanceByParty.get(party.id) ?? 0 };
        }
        return { ...party, balance: party.balance ?? 0 };
      });
    },
    enabled: allParties.length > 0 && !!organizationId,
  });

  const filteredParties = partiesWithCalculatedBalances.filter(
    p =>
      p.party_type === activeTab &&
      (p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.mobile && p.mobile.includes(searchQuery))),
  );

  // Calculate totals from real data (all active tabs?) 
  // No, the HTML shows totals across everything, we'll keep as before but show based on all entries
  const totalReceivable = useMemo(() => {
    return partiesWithCalculatedBalances
      .filter(p => p.party_type === 'customer')
      .reduce((sum, p) => sum + (p.balance ?? 0), 0);
  }, [partiesWithCalculatedBalances]);

  const totalPayable = useMemo(() => {
    return partiesWithCalculatedBalances
      .filter(p => p.party_type === 'vendor')
      .reduce((sum, p) => sum + (p.balance ?? 0), 0);
  }, [partiesWithCalculatedBalances]);
  
  const netBalance = Math.abs(totalReceivable - totalPayable);

  const handleAddParty = () => {
    navigation.navigate('AddPartySheet');
  };

  const handlePartyPress = (party: any) => {
    navigation.navigate('PartyLedgerScreen', { party });
  };

  const handleRecordPayment = (party: Party) => {
    setSelectedPartyForPayment(party);
    setPaymentSheetVisible(true);
  };

  const handleClosePaymentSheet = () => {
    setPaymentSheetVisible(false);
    setSelectedPartyForPayment(null);
    // Refresh data after payment
    refetchParties();
  };

  return (
    <ScreenWrapper>
      <ListHeader title="Credit Book" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* KPI Row: Invoice Style 3-Stats */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryStatItem, { flex: 1.2 }]}>
            <View style={[styles.summaryIconBox, styles.summaryIconBoxReceivable]}>
              <TrendingUp color={tokens.primary} size={14} />
            </View>
            <View style={styles.summaryStatText}>
              <Text style={styles.summaryStatLabel}>YOU GET</Text>
              <Text style={styles.summaryStatValue} numberOfLines={1}>
                ₹{totalReceivable.toLocaleString('en-IN')}
              </Text>
            </View>
          </View>
          <View style={styles.summaryDivider} />
          <View style={[styles.summaryStatItem, { flex: 1.2 }]}>
            <View style={[styles.summaryIconBox, styles.summaryIconBoxPayable]}>
              <TrendingDown color={tokens.destructive} size={14} />
            </View>
            <View style={styles.summaryStatText}>
              <Text style={styles.summaryStatLabel}>YOU PAY</Text>
              <Text style={styles.summaryStatValue} numberOfLines={1}>
                ₹{totalPayable.toLocaleString('en-IN')}
              </Text>
            </View>
          </View>
          <View style={styles.summaryDivider} />
          <View style={[styles.summaryStatItem, { flex: 0.8 }]}>
            <View style={[styles.summaryIconBox, styles.summaryIconBoxNet]}>
              <Wallet color={tokens.foreground} size={14} />
            </View>
            <View style={styles.summaryStatText}>
              <Text style={styles.summaryStatLabel}>NET</Text>
              <Text style={styles.summaryStatValue} numberOfLines={1}>
                ₹{netBalance.toLocaleString('en-IN')}
              </Text>
            </View>
          </View>
        </View>

        {/* Search & Filter Row */}
        <View style={styles.searchRow}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search parties..."
            showFilter={true}
            onFilterPress={() => {}}
            filterActive={false}
          />
        </View>

        {/* Quick Filters */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.quickFiltersScroll}
          contentContainerStyle={styles.quickFiltersContent}
        >
          <Pressable
            style={[
              styles.chip,
              activeTab === 'customer' ? styles.chipActive : styles.chipInactive
            ]}
            onPress={() => setActiveTab('customer')}
          >
            <Text style={[
              styles.chipText,
              activeTab === 'customer' ? styles.chipTextActive : styles.chipTextInactive
            ]}>
              CUSTOMERS ({partiesWithCalculatedBalances.filter(p => p.party_type === 'customer').length})
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.chip,
              activeTab === 'vendor' ? styles.chipActive : styles.chipInactive
            ]}
            onPress={() => setActiveTab('vendor')}
          >
            <Text style={[
              styles.chipText,
              activeTab === 'vendor' ? styles.chipTextActive : styles.chipTextInactive
            ]}>
              VENDORS ({partiesWithCalculatedBalances.filter(p => p.party_type === 'vendor').length})
            </Text>
          </Pressable>
        </ScrollView>

        {/* Ledger List: FlatList Style */}
        <View style={styles.listContainer}>
          {partiesLoading ? (
            <CreditBookSkeleton />
          ) : partiesError && !partiesLoading ? (
            <EmptyState
              icon={<AlertTriangle color={tokens.destructive} size={32} />}
              title="Unable to load credit book"
              description="Check your connection and try again."
              actionLabel="Retry"
              onAction={() => refetchParties()}
            />
          ) : !partiesLoading &&
            !partiesError &&
            filteredParties.length === 0 ? (
            <View style={styles.emptyStateContainer}>
               <EmptyState
                 icon={<Users color={tokens.primary} size={32} />}
                 title="No entries found."
                 description={
                   searchQuery 
                     ? `No results for "${searchQuery}"`
                     : activeTab === 'customer'
                     ? 'Add customers to start tracking receivables.'
                     : 'Add vendors to start tracking payables.'
                 }
                 actionLabel={searchQuery ? 'Clear Search' : (activeTab === 'customer' ? 'Add Customer' : 'Add Vendor')}
                 onAction={searchQuery ? () => setSearchQuery('') : handleAddParty}
               />
            </View>
          ) : (
            filteredParties.map((party, index) => {
              const isVendor = party.party_type === 'vendor';
              
              return (
                <View key={party.id}>
                  {index > 0 && <View style={styles.rowDivider} />}
                  <View style={styles.partyRow}>
                    <Pressable
                      style={({ pressed }) => [styles.partyPressable, pressed && styles.partyPressed]}
                      onPress={() => handlePartyPress(party)}
                      accessibilityRole="button"
                    >
                      <View style={styles.partyInfo}>
                        <View style={styles.avatar}>
                          <Text style={styles.avatarText}>
                            {party.name.charAt(0).toUpperCase()}{party.name.split(' ')[1] ? party.name.split(' ')[1].charAt(0).toUpperCase() : ''}
                          </Text>
                        </View>
                        <View>
                          <Text style={styles.partyName} numberOfLines={1}>{party.name}</Text>
                          {party.mobile ? (
                            <Text style={styles.partyMobile}>{party.mobile}</Text>
                          ) : null}
                        </View>
                      </View>
                      <View style={styles.partyBalanceContainer}>
                        {party.balance > 0 ? (
                           <>
                             <Text
                               style={[
                                 styles.balanceValue,
                                 isVendor ? { color: tokens.destructive } : { color: tokens.primary }
                               ]}
                             >
                               ₹ {party.balance.toLocaleString('en-IN')}
                             </Text>
                             <Text style={[styles.balanceSub, isVendor ? { color: tokens.destructive } : { color: tokens.primary }]}>
                               {isVendor ? 'You Pay' : 'You Get'}
                             </Text>
                           </>
                        ) : (
                          <>
                             <Text style={styles.settledValue}>Settled</Text>
                             <Text style={styles.settledSub}>Balanced</Text>
                          </>
                        )}
                      </View>
                    </Pressable>
                    {/* Embedded Pay Action strictly for Customers with Balance directly below info like original */}
                    {activeTab === 'customer' && party.balance > 0 && (
                      <Pressable 
                        style={styles.quickPayButton} 
                        onPress={() => handleRecordPayment(party)}
                      >
                         <Banknote size={14} color={tokens.primary} />
                         <Text style={styles.quickPayText}>Pay</Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* FAB: Entry */}
      <Pressable 
        style={[styles.fab, Platform.OS === 'ios' && styles.fabShadow]} 
        onPress={handleAddParty}
        accessibilityRole="button"
        accessibilityLabel="Add party"
      >
        <PlusCircle size={20} color={tokens.primaryForeground} />
        <Text style={styles.fabText}>+ ENTRY</Text>
      </Pressable>

      {/* Payment Recording Sheet */}
      <RecordPaymentSheet
        visible={paymentSheetVisible}
        onClose={handleClosePaymentSheet}
        party={selectedPartyForPayment}
        outstandingAmount={selectedPartyForPayment?.balance}
      />
    </ScreenWrapper>
  );
};

const createStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: tokens.background,
    },
    content: {
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 120, // Leave room for absolute FAB
    },
    summaryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      marginBottom: 16,
      gap: 0,
    },
    summaryStatItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    summaryIconBox: {
      width: 28,
      height: 28,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    summaryIconBoxPayable: {
      backgroundColor: tokens.destructiveAlpha10,
    },
    summaryIconBoxReceivable: {
      backgroundColor: tokens.primaryAlpha10,
    },
    summaryIconBoxNet: {
      backgroundColor: tokens.surface_container_low,
    },
    summaryStatText: {
      flex: 1,
      gap: 2,
    },
    searchRow: {
      marginBottom: 16,
    },
    quickFiltersScroll: {
      marginBottom: 16,
    },
    quickFiltersContent: {
      paddingBottom: 4,
      flexDirection: 'row',
      gap: 8,
    },
    chip: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 999,
      justifyContent: 'center',
      alignItems: 'center',
    },
    chipActive: {
      backgroundColor: tokens.primary, // Equivalent of bg-on-primary-container returning white text usually, but bg-primary fits our tokens best
    },
    chipInactive: {
      backgroundColor: tokens.surface_container_low,
    },
    chipText: {
      fontSize: 11,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    chipTextActive: {
      color: tokens.primaryForeground,
    },
    chipTextInactive: {
      color: tokens.mutedForeground,
    },
    listContainer: {
      paddingBottom: 40,
    },
    partyRow: {
      backgroundColor: tokens.surface_container_lowest,
    },
    rowDivider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: tokens.border,
      marginLeft: 64, // To align past the avatar
      opacity: 0.5,
    },
    partyPressable: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 12,
      paddingVertical: 14,
    },
    partyPressed: {
      backgroundColor: tokens.muted,
    },
    partyInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flex: 1,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: tokens.surface_container_low,
      alignItems: 'center',
      justifyContent: 'center',
    },
    summaryStatLabel: {
      fontSize: 9,
      fontWeight: '700',
      letterSpacing: 0.5,
      color: tokens.mutedForeground,
      textTransform: 'uppercase',
    },
    summaryStatValue: {
      fontSize: 14,
      fontWeight: '800',
      color: tokens.foreground,
    },
    summaryDivider: {
      width: 1,
      height: 28,
      backgroundColor: tokens.border,
      marginHorizontal: 8,
      opacity: 0.4,
    },
    avatarText: {
      fontSize: 14,
      fontWeight: '700',
      color: tokens.foreground,
    },
    partyName: {
      fontSize: 14,
      fontWeight: '700',
      color: tokens.foreground,
    },
    partyMobile: {
      fontSize: 11,
      color: tokens.mutedForeground,
      marginTop: 2,
    },
    partyBalanceContainer: {
      alignItems: 'flex-end',
      marginLeft: 12,
    },
    balanceValue: {
      fontSize: 14,
      fontWeight: '800',
    },
    balanceSub: {
      fontSize: 10,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: -0.2,
      marginTop: 2,
    },
    settledValue: {
      fontSize: 14,
      fontWeight: '800',
      color: tokens.mutedForeground,
    },
    settledSub: {
      fontSize: 10,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: -0.2,
      marginTop: 2,
      color: tokens.mutedForeground,
    },
    quickPayButton: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-end',
      backgroundColor: tokens.primaryAlpha15,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      marginRight: 20,
      marginBottom: 12,
      gap: 4,
    },
    quickPayText: {
      fontSize: 11,
      fontWeight: '700',
      color: tokens.primary,
    },
    emptyStateContainer: {
      paddingVertical: 32,
    },
    fab: {
      position: 'absolute',
      bottom: 24, // Keep it above tabs
      right: 24,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: tokens.primary, // Using primary for gradient style placeholder
      paddingHorizontal: 20,
      paddingVertical: 14,
      borderRadius: 16,
      gap: 8,
      elevation: 6,
    },
    // iOS shadow specifically to match Tailwind shadow-xl loosely
    fabShadow: {
      shadowColor: tokens.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
    },
    fabText: {
      color: tokens.primaryForeground,
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
  });

export default CreditBookScreen;
