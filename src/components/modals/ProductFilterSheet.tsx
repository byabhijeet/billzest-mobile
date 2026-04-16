import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import ActionSheet from './ActionSheet';
import { useThemeTokens } from '../../theme/ThemeProvider';
import { ThemeTokens } from '../../theme/tokens';
import { Check } from 'lucide-react-native';
import FormActionBar from '../ui/FormActionBar';

type ProductFilterSheetProps = {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
  availableCategories?: string[];
};

// Common categories - can be extended or fetched from products
const DEFAULT_CATEGORIES = [
  'General',
  'Food',
  'Beverages',
  'Electronics',
  'Clothing',
  'Home',
  'Services',
  'Medical',
  'Stationery',
  'Automotive',
];

const STATUS_OPTIONS = [
  'All',
  'Low Stock',
  'Out of Stock',
  'Near Expiry',
  'Expired',
];

const ProductFilterSheet: React.FC<ProductFilterSheetProps> = ({
  visible,
  onClose,
  onApply,
  availableCategories,
}) => {
  const { tokens } = useThemeTokens();
  const styles = React.useMemo(() => createStyles(tokens), [tokens]);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  
  // Use provided categories or fall back to default
  const categoriesToShow = availableCategories && availableCategories.length > 0 
    ? availableCategories 
    : DEFAULT_CATEGORIES;

  const toggleCategory = (cat: string) => {
    setSelectedCats(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat],
    );
  };

  const handleApply = () => {
    onApply({ categories: selectedCats, status: selectedStatus });
    onClose();
  };

  return (
    <ActionSheet
      visible={visible}
      onClose={onClose}
      title="Filter Products"
      scrollable={false}
      footer={
        <FormActionBar
          variant="dual"
          secondaryLabel="Clear All"
          onSecondary={() => {
            setSelectedCats([]);
            setSelectedStatus('All');
          }}
          primaryLabel="Apply Filters"
          onPrimary={handleApply}
        />
      }
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>STATUS</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {STATUS_OPTIONS.map(status => {
            const isSelected = selectedStatus === status;
            return (
              <Pressable
                key={status}
                style={[styles.chip, isSelected && styles.chipActive]}
                onPress={() => setSelectedStatus(status)}
                accessibilityLabel={status}
              >
                <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                  {status}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={[styles.sectionHeader, { marginTop: 20 }]}>
          <Text style={styles.sectionTitle}>CATEGORIES</Text>
        </View>
        <View style={styles.checkList}>
          {categoriesToShow.map((cat: string) => {
            const isSelected = selectedCats.includes(cat);
            return (
              <Pressable
                key={cat}
                style={styles.checkRow}
                onPress={() => toggleCategory(cat)}
                accessibilityLabel={cat}
              >
                <Text style={styles.checkLabel}>{cat}</Text>
                <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
                  {isSelected && <Check size={13} color={tokens.primaryForeground} strokeWidth={3} />}
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </ActionSheet>
  );
};

const createStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    scrollView: {
      flexShrink: 1,
    },
    scrollContent: {
      paddingBottom: 8,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 11,
      fontWeight: '700',
      color: tokens.mutedForeground,
      letterSpacing: 0.6,
    },
    chipRow: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 4,
    },
    chip: {
      paddingHorizontal: 16,
      paddingVertical: 9,
      borderRadius: 999,
      backgroundColor: tokens.muted,
    },
    chipActive: {
      backgroundColor: tokens.primary,
    },
    chipText: {
      fontSize: 14,
      fontWeight: '600',
      color: tokens.foreground,
    },
    chipTextActive: {
      color: tokens.primaryForeground,
    },
    checkList: {
      backgroundColor: tokens.muted,
      borderRadius: 14,
      paddingHorizontal: 16,
      paddingVertical: 4,
    },
    checkRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 13,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: tokens.border,
    },
    checkLabel: {
      fontSize: 15,
      fontWeight: '500',
      color: tokens.foreground,
    },
    checkbox: {
      width: 22,
      height: 22,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: tokens.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkboxActive: {
      backgroundColor: tokens.primary,
      borderColor: tokens.primary,
    },
  });

export default ProductFilterSheet;
