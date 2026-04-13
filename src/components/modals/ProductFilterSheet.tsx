import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import ActionSheet from './ActionSheet';
import { useThemeTokens } from '../../theme/ThemeProvider';
import { ThemeTokens } from '../../theme/tokens';
import { Check } from 'lucide-react-native';

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
    <ActionSheet visible={visible} onClose={onClose} title="Filter By">
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Status</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
        >
          {STATUS_OPTIONS.map(status => {
            const isSelected = selectedStatus === status;
            return (
              <Pressable
                key={status}
                style={[styles.chip, isSelected && styles.chipActive]}
                onPress={() => setSelectedStatus(status)}
              >
                <Text
                  style={[styles.chipText, isSelected && styles.chipTextActive]}
                >
                  {status}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Categories</Text>
        <ScrollView style={styles.list}>
          {categoriesToShow.map((cat: string) => {
            const isSelected = selectedCats.includes(cat);
            return (
              <Pressable
                key={cat}
                style={styles.row}
                onPress={() => toggleCategory(cat)}
              >
                <Text style={styles.label}>{cat}</Text>
                <View style={[styles.checkbox, isSelected && styles.checked]}>
                  {isSelected && (
                    <Check size={14} color={tokens.primaryForeground} />
                  )}
                </View>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            style={styles.clearBtn}
            onPress={() => {
              setSelectedCats([]);
              setSelectedStatus('All');
            }}
          >
            <Text style={styles.clearText}>Clear</Text>
          </Pressable>
          <Pressable style={styles.applyBtn} onPress={handleApply}>
            <Text style={styles.applyText}>Apply</Text>
          </Pressable>
        </View>
      </View>
    </ActionSheet>
  );
};

const createStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingBottom: 24,
      maxHeight: 600,
    },
    horizontalScroll: {
      flexDirection: 'row',
      marginBottom: 10,
    },
    chip: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: tokens.border,
      marginRight: 10,
      backgroundColor: tokens.background,
    },
    chipActive: {
      backgroundColor: tokens.primary,
      borderColor: tokens.primary,
    },
    chipText: {
      fontSize: 14,
      fontWeight: '500',
      color: tokens.foreground,
    },
    chipTextActive: {
      color: tokens.primaryForeground,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: tokens.foreground,
      marginBottom: 12,
    },
    list: {
      marginBottom: 20,
      maxHeight: 250,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: tokens.border,
    },
    label: {
      fontSize: 15,
      color: tokens.foreground,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: tokens.mutedForeground,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checked: {
      backgroundColor: tokens.primary,
      borderColor: tokens.primary,
    },
    footer: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 10,
    },
    clearBtn: {
      flex: 1,
      padding: 14,
      alignItems: 'center',
      borderRadius: 12,
      backgroundColor: tokens.background,
      borderWidth: 1,
      borderColor: tokens.border,
    },
    applyBtn: {
      flex: 1,
      padding: 14,
      alignItems: 'center',
      borderRadius: 12,
      backgroundColor: tokens.primary,
    },
    clearText: {
      fontWeight: '600',
      color: tokens.mutedForeground,
    },
    applyText: {
      fontWeight: '600',
      color: tokens.primaryForeground,
    },
  });

export default ProductFilterSheet;
