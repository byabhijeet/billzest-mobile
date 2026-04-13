import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import ActionSheet from './ActionSheet';
import { useThemeTokens } from '../../theme/ThemeProvider';
import { ThemeTokens } from '../../theme/tokens';
import Button from '../ui/Button';
import { X } from 'lucide-react-native';

type InvoiceFilterSheetProps = {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: InvoiceFilters) => void;
  initialFilters?: InvoiceFilters;
};

export type InvoiceFilters = {
  status?: string;
  dateRange?: 'all' | 'today' | 'week' | 'month' | 'year' | 'custom';
  startDate?: string;
  endDate?: string;
  clientId?: string;
};

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'sent', label: 'Sent' },
  { value: 'paid', label: 'Paid' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'cancelled', label: 'Cancelled' },
];

const DATE_RANGE_OPTIONS = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' },
  { value: 'custom', label: 'Custom Range' },
];

const InvoiceFilterSheet: React.FC<InvoiceFilterSheetProps> = ({
  visible,
  onClose,
  onApply,
  initialFilters,
}) => {
  const { tokens } = useThemeTokens();
  const styles = React.useMemo(() => createStyles(tokens), [tokens]);
  
  const [selectedStatus, setSelectedStatus] = useState<string>(
    initialFilters?.status || 'all'
  );
  const [selectedDateRange, setSelectedDateRange] = useState<string>(
    initialFilters?.dateRange || 'all'
  );

  useEffect(() => {
    if (initialFilters) {
      setSelectedStatus(initialFilters.status || 'all');
      setSelectedDateRange(initialFilters.dateRange || 'all');
    }
  }, [initialFilters]);

  const handleApply = () => {
    onApply({
      status: selectedStatus === 'all' ? undefined : selectedStatus,
      dateRange: selectedDateRange === 'all' ? undefined : selectedDateRange as any,
    });
    onClose();
  };

  const handleReset = () => {
    setSelectedStatus('all');
    setSelectedDateRange('all');
    onApply({});
    onClose();
  };

  return (
    <ActionSheet visible={visible} onClose={onClose} title="Filter Invoices">
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Status Filter */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>
          <View style={styles.optionsGrid}>
            {STATUS_OPTIONS.map(option => {
              const isSelected = selectedStatus === option.value;
              return (
                <Pressable
                  key={option.value}
                  style={[
                    styles.optionChip,
                    isSelected && styles.optionChipSelected,
                  ]}
                  onPress={() => setSelectedStatus(option.value)}
                >
                  <Text
                    style={[
                      styles.optionChipText,
                      isSelected && styles.optionChipTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Date Range Filter */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date Range</Text>
          <View style={styles.optionsGrid}>
            {DATE_RANGE_OPTIONS.map(option => {
              const isSelected = selectedDateRange === option.value;
              return (
                <Pressable
                  key={option.value}
                  style={[
                    styles.optionChip,
                    isSelected && styles.optionChipSelected,
                  ]}
                  onPress={() => setSelectedDateRange(option.value)}
                >
                  <Text
                    style={[
                      styles.optionChipText,
                      isSelected && styles.optionChipTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            label="Reset"
            variant="outline"
            onPress={handleReset}
            style={styles.resetButton}
          />
          <Button
            label="Apply Filters"
            onPress={handleApply}
            style={styles.applyButton}
          />
        </View>
      </ScrollView>
    </ActionSheet>
  );
};

const createStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    container: {
      maxHeight: '80%',
    },
    content: {
      padding: 20,
      paddingBottom: 32,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: tokens.foreground,
      marginBottom: 12,
    },
    optionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    optionChip: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: tokens.border,
      backgroundColor: tokens.card,
    },
    optionChipSelected: {
      backgroundColor: tokens.primary,
      borderColor: tokens.primary,
    },
    optionChipText: {
      fontSize: 14,
      fontWeight: '500',
      color: tokens.foreground,
    },
    optionChipTextSelected: {
      color: tokens.primaryForeground,
    },
    actions: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 8,
    },
    resetButton: {
      flex: 1,
    },
    applyButton: {
      flex: 1,
    },
  });

export default InvoiceFilterSheet;

