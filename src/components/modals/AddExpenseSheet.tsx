import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Modal,
  Pressable,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { useThemeTokens } from '../../theme/ThemeProvider';
import { ThemeTokens } from '../../theme/tokens';
import { X, Calendar as CalendarIcon, Check } from 'lucide-react-native';
import { useExpenses, useExpenseMutations } from '../../logic/expenseLogic';
import { Party } from '../../types/domain';
import DateTimePicker from '@react-native-community/datetimepicker';

interface AddExpenseSheetProps {
  visible: boolean;
  onClose: () => void;
}

const AddExpenseSheet: React.FC<AddExpenseSheetProps> = ({
  visible,
  onClose,
}) => {
  const { tokens } = useThemeTokens();
  const styles = useMemo(() => createStyles(tokens), [tokens]);

  const { data: categoryData, isLoading: isLoadingCategories } = useExpenses();
  const categories: Party[] = categoryData ?? [];
  const { createExpenseCategory, addExpenseEntry } = useExpenseMutations();

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!amount || isNaN(Number(amount))) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount.');
      return;
    }
    if (!selectedCategory && !newCategoryName) {
      Alert.alert('Category Required', 'Please select or create a category.');
      return;
    }

    setIsSubmitting(true);
    try {
      let partyId = selectedCategory;

      // If creating new category on the fly
      if (isCreatingCategory && newCategoryName) {
        const newParty = await createExpenseCategory.mutateAsync({
          name: newCategoryName,
        });
        partyId = newParty.id;
      }

      if (partyId) {
        await addExpenseEntry.mutateAsync({
          partyId,
          amount: Number(amount),
          description,
          date: date.toISOString(),
        });
        Alert.alert('Success', 'Expense added.', [
          { text: 'OK', onPress: onClose },
        ]);
        // Reset form
        setAmount('');
        setDescription('');
        setSelectedCategory(null);
        setNewCategoryName('');
        setIsCreatingCategory(false);
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to save expense.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Add Expense</Text>
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <X color={tokens.foreground} size={24} />
          </Pressable>
        </View>

        <ScrollView style={styles.content}>
          {/* Amount Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="₹0"
              placeholderTextColor={tokens.mutedForeground}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              autoFocus
            />
          </View>

          {/* Category Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>

            {!isCreatingCategory ? (
              <View style={styles.categoryGrid}>
                {categories.map(cat => (
                  <Pressable
                    key={cat.id}
                    style={[
                      styles.categoryChip,
                      selectedCategory === cat.id &&
                        styles.categoryChipSelected,
                    ]}
                    onPress={() => setSelectedCategory(cat.id)}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        selectedCategory === cat.id &&
                          styles.categoryTextSelected,
                      ]}
                    >
                      {cat.name}
                    </Text>
                  </Pressable>
                ))}
                <Pressable
                  style={[styles.categoryChip, styles.addCategoryChip]}
                  onPress={() => {
                    setIsCreatingCategory(true);
                    setSelectedCategory(null);
                  }}
                >
                  <Text style={styles.addCategoryText}>+ Add New</Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.newCategoryRow}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter category name (e.g. Rent)"
                  placeholderTextColor={tokens.mutedForeground}
                  value={newCategoryName}
                  onChangeText={setNewCategoryName}
                />
                <Pressable
                  onPress={() => setIsCreatingCategory(false)}
                  style={styles.cancelBtn}
                >
                  <Text style={{ color: tokens.destructive }}>Cancel</Text>
                </Pressable>
              </View>
            )}
          </View>

          {/* Date Picker */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date</Text>
            <Pressable
              style={styles.dateBtn}
              onPress={() => setShowDatePicker(true)}
            >
              <CalendarIcon size={20} color={tokens.primary} />
              <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
            </Pressable>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={(e, d) => {
                  setShowDatePicker(false);
                  if (d) setDate(d);
                }}
              />
            )}
          </View>

          {/* Description Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Reference no, details..."
              placeholderTextColor={tokens.mutedForeground}
              multiline
              value={description}
              onChangeText={setDescription}
            />
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Pressable
            style={styles.submitBtn}
            onPress={handleSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color={tokens.primaryForeground} />
            ) : (
              <>
                <Check color={tokens.primaryForeground} size={20} />
                <Text style={styles.submitBtnText}>Save Expense</Text>
              </>
            )}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: tokens.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: tokens.border,
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      color: tokens.foreground,
    },
    closeBtn: {
      padding: 8,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    inputGroup: {
      marginBottom: 24,
    },
    label: {
      fontSize: 14,
      color: tokens.mutedForeground,
      marginBottom: 8,
      fontWeight: '600',
    },
    amountInput: {
      fontSize: 32,
      fontWeight: '800',
      color: tokens.primary,
      borderBottomWidth: 2,
      borderBottomColor: tokens.border,
      paddingVertical: 8,
    },
    input: {
      backgroundColor: tokens.card,
      borderWidth: 1,
      borderColor: tokens.border,
      borderRadius: 12,
      padding: 14,
      fontSize: 16,
      color: tokens.foreground,
    },
    textArea: {
      height: 100,
      textAlignVertical: 'top',
    },
    categoryGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    categoryChip: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      backgroundColor: tokens.card,
      borderWidth: 1,
      borderColor: tokens.border,
    },
    categoryChipSelected: {
      backgroundColor: tokens.primary,
      borderColor: tokens.primary,
    },
    categoryText: {
      fontSize: 14,
      color: tokens.foreground,
      fontWeight: '500',
    },
    categoryTextSelected: {
      color: tokens.primaryForeground,
    },
    addCategoryChip: {
      borderStyle: 'dashed',
    },
    addCategoryText: {
      color: tokens.primary,
      fontWeight: '600',
    },
    newCategoryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    cancelBtn: {
      padding: 10,
    },
    dateBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      padding: 14,
      backgroundColor: tokens.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: tokens.border,
    },
    dateText: {
      fontSize: 16,
      color: tokens.foreground,
    },
    footer: {
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: tokens.border,
    },
    submitBtn: {
      backgroundColor: tokens.primary,
      borderRadius: 16,
      padding: 16,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
    },
    submitBtnText: {
      color: tokens.primaryForeground,
      fontSize: 16,
      fontWeight: '700',
    },
  });

export default AddExpenseSheet;
