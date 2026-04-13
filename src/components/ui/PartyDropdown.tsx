import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useThemeTokens } from '../../theme/ThemeProvider';
import { ThemeTokens } from '../../theme/tokens';
import { Party } from '../../types/domain';
import { useParties } from '../../hooks/useParties';
import { ChevronDown, User, UserPlus, X } from 'lucide-react-native';
import SearchBar from '../SearchBar';

type PartyDropdownProps = {
  selectedParty: Party | null;
  onSelectParty: (party: Party | null) => void;
  mode: 'sale' | 'purchase';
  placeholder?: string;
  label?: string;
  onAddNew?: () => void;
};

const WALKIN_PARTY: Party = {
  id: 'walk-in',
  organization_id: '',
  type: 'customer',
  name: 'Walk-in Customer',
  phone: null,
  mobile: null,
  email: null,
  address: null,
  notes: 'Generic customer',
  party_type: 'customer',
  balance: 0,
};

const PartyDropdown: React.FC<PartyDropdownProps> = ({
  selectedParty,
  onSelectParty,
  mode,
  placeholder,
  label,
  onAddNew,
}) => {
  const { tokens } = useThemeTokens();
  const styles = useMemo(() => createStyles(tokens), [tokens]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch parties with proper filtering
  const { data: allParties = [], isLoading } = useParties();

  // Filter parties based on mode
  const filteredParties = useMemo(() => {
    let parties = allParties;

    // Filter by party type based on mode - NEVER show expenses
    if (mode === 'sale') {
      // For invoices: only customers (customer or client), exclude expenses
      parties = parties.filter(
        p => p.type === 'customer' || p.type === 'client',
      );
    } else if (mode === 'purchase') {
      // For purchases: only vendors, exclude expenses
      parties = parties.filter(p => p.type === 'vendor');
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      parties = parties.filter(
        p =>
          p.name.toLowerCase().includes(term) ||
          (p.phone && p.phone.includes(term)) ||
          (p.mobile && p.mobile.includes(term)),
      );
    }

    return parties;
  }, [allParties, mode, searchTerm]);

  const handleSelect = (party: Party | null) => {
    onSelectParty(party);
    setIsOpen(false);
    setSearchTerm('');
  };

  const displayLabel =
    label || (mode === 'sale' ? 'Customer' : 'Vendor / Supplier');
  const displayPlaceholder =
    placeholder || (mode === 'sale' ? 'Select customer' : 'Select vendor');

  return (
    <View style={styles.container}>
      <Pressable style={styles.trigger} onPress={() => setIsOpen(true)}>
        <View style={styles.triggerContent}>
          <View style={styles.iconBox}>
            <User color={tokens.primary} size={20} />
          </View>
          <View style={styles.triggerText}>
            <Text style={styles.label}>{displayLabel}</Text>
            <Text style={styles.value} numberOfLines={1}>
              {selectedParty ? selectedParty.name : displayPlaceholder}
            </Text>
            {selectedParty?.phone && (
              <Text style={styles.meta} numberOfLines={1}>
                {selectedParty.phone}
              </Text>
            )}
          </View>
        </View>
        <ChevronDown color={tokens.mutedForeground} size={20} />
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setIsOpen(false)}>
          <Pressable
            style={styles.dropdownContainer}
            onPress={e => e.stopPropagation()}
          >
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownTitle}>
                {mode === 'sale' ? 'Select Customer' : 'Select Vendor'}
              </Text>
              <Pressable
                onPress={() => setIsOpen(false)}
                style={styles.closeButton}
              >
                <X color={tokens.foreground} size={20} />
              </Pressable>
            </View>

            <View style={styles.searchContainer}>
              <SearchBar
                value={searchTerm}
                onChangeText={setSearchTerm}
                placeholder="Search name or phone..."
                autoFocus
              />
            </View>

            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color={tokens.primary} size="large" />
              </View>
            ) : (
              <FlatList
                data={filteredParties}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <Pressable
                    style={[
                      styles.partyItem,
                      selectedParty?.id === item.id && styles.partyItemSelected,
                    ]}
                    onPress={() => handleSelect(item)}
                  >
                    <View style={styles.partyAvatar}>
                      <Text style={styles.partyAvatarText}>
                        {item.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.partyInfo}>
                      <Text style={styles.partyName}>{item.name}</Text>
                      <Text style={styles.partyMeta}>
                        {item.phone || item.mobile || 'No phone'}
                      </Text>
                    </View>
                    {selectedParty?.id === item.id && (
                      <View style={styles.checkmark}>
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                    )}
                  </Pressable>
                )}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                      {searchTerm
                        ? 'No parties found'
                        : mode === 'sale'
                        ? 'No customers found. Add one to get started.'
                        : 'No vendors found. Add one to get started.'}
                    </Text>
                  </View>
                }
                contentContainerStyle={styles.listContent}
                style={styles.list}
              />
            )}

            {mode === 'sale' && (
              <>
                <View style={styles.divider} />
                <Pressable
                  style={styles.walkInButton}
                  onPress={() => handleSelect(WALKIN_PARTY)}
                >
                  <View
                    style={[
                      styles.partyAvatar,
                      { backgroundColor: tokens.primary },
                    ]}
                  >
                    <User color={tokens.primaryForeground} size={20} />
                  </View>
                  <View style={styles.partyInfo}>
                    <Text style={styles.partyName}>Walk-in Customer</Text>
                    <Text style={styles.partyMeta}>No details recorded</Text>
                  </View>
                </Pressable>
              </>
            )}

            {onAddNew && (
              <>
                <View style={styles.divider} />
                <Pressable
                  style={styles.addNewButton}
                  onPress={() => {
                    setIsOpen(false);
                    onAddNew();
                  }}
                >
                  <UserPlus color={tokens.primary} size={18} />
                  <Text style={styles.addNewText}>
                    Add New {mode === 'sale' ? 'Customer' : 'Vendor'}
                  </Text>
                </Pressable>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const createStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    trigger: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: tokens.card,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: tokens.border,
    },
    triggerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    iconBox: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: tokens.background,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: tokens.border,
      marginRight: 12,
    },
    triggerText: {
      flex: 1,
    },
    label: {
      fontSize: 12,
      color: tokens.mutedForeground,
      marginBottom: 4,
    },
    value: {
      fontSize: 16,
      fontWeight: '600',
      color: tokens.foreground,
    },
    meta: {
      fontSize: 12,
      color: tokens.mutedForeground,
      marginTop: 2,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    dropdownContainer: {
      backgroundColor: tokens.card,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: '80%',
      borderWidth: 1,
      borderColor: tokens.border,
      overflow: 'hidden',
    },
    dropdownHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: tokens.border,
    },
    dropdownTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: tokens.foreground,
    },
    closeButton: {
      padding: 4,
    },
    searchContainer: {
      padding: 16,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: tokens.border,
    },
    loadingContainer: {
      padding: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    list: {
      maxHeight: 400,
    },
    listContent: {
      paddingBottom: 16,
    },
    partyItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: tokens.border,
    },
    partyItemSelected: {
      backgroundColor: tokens.background,
    },
    partyAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: tokens.background,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: tokens.border,
      marginRight: 12,
    },
    partyAvatarText: {
      fontSize: 16,
      fontWeight: '700',
      color: tokens.primary,
    },
    partyInfo: {
      flex: 1,
    },
    partyName: {
      fontSize: 15,
      fontWeight: '600',
      color: tokens.foreground,
      marginBottom: 2,
    },
    partyMeta: {
      fontSize: 12,
      color: tokens.mutedForeground,
    },
    checkmark: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: tokens.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkmarkText: {
      color: tokens.primaryForeground,
      fontSize: 14,
      fontWeight: '700',
    },
    emptyContainer: {
      padding: 40,
      alignItems: 'center',
    },
    emptyText: {
      color: tokens.mutedForeground,
      textAlign: 'center',
    },
    divider: {
      height: 1,
      backgroundColor: tokens.border,
      marginVertical: 8,
    },
    walkInButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
    },
    addNewButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: tokens.border,
      gap: 8,
    },
    addNewText: {
      color: tokens.primary,
      fontWeight: '600',
      fontSize: 15,
    },
  });

export default PartyDropdown;
