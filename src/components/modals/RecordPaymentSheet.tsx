import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  Pressable,
  Alert,
  TextInput,
} from 'react-native';
import { useThemeTokens } from '../../theme/ThemeProvider';
import { ThemeTokens } from '../../theme/tokens';
import { X, Calendar, Banknote } from 'lucide-react-native';
import { useAddCreditTransaction } from '../../hooks/useCredit';
import { Party } from '../../types/domain';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';

interface RecordPaymentSheetProps {
  visible: boolean;
  onClose: () => void;
  party: Party | null;
  outstandingAmount?: number;
}

const RecordPaymentSheet: React.FC<RecordPaymentSheetProps> = ({
  visible,
  onClose,
  party,
  outstandingAmount,
}) => {
  const { tokens } = useThemeTokens();
  const styles = React.useMemo(() => createStyles(tokens), [tokens]);
  const addTransaction = useAddCreditTransaction();

  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'upi', label: 'UPI' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'card', label: 'Card' },
  ];

  const validateAndSubmit = async () => {
    if (!party) {
      Alert.alert('Error', 'Please select a party.');
      return;
    }

    if (!amount.trim()) {
      Alert.alert('Validation Error', 'Please enter the payment amount.');
      return;
    }

    const amountNum = Number(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid amount greater than zero.');
      return;
    }

    if (outstandingAmount && amountNum > outstandingAmount) {
      Alert.alert(
        'Amount Exceeds Outstanding',
        `The payment amount (₹${amountNum.toLocaleString('en-IN')}) exceeds the outstanding balance (₹${outstandingAmount.toLocaleString('en-IN')}). Please enter a valid amount.`,
      );
      return;
    }

    setIsSubmitting(true);
    try {
      // Use creditService to record payment which will auto-allocate to invoices
      await addTransaction.mutateAsync({
        party_id: party.id,
        amount: amountNum,
        type: 'received', // Payment received from customer
        date: paymentDate.toISOString(),
        description: notes.trim() || undefined,
        payment_method: paymentMethod,
        reference_number: reference.trim() || undefined,
      });

      Alert.alert('Success', 'Payment recorded successfully!', [
        {
          text: 'OK',
          onPress: () => {
            // Reset form
            setAmount('');
            setPaymentDate(new Date());
            setReference('');
            setNotes('');
            setPaymentMethod('cash');
            onClose();
          },
        },
      ]);
    } catch (error: unknown) {
      const { logger } = await import('../../utils/logger');
      logger.error('[Payment] Failed to record payment', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to record payment. Please try again.';
      Alert.alert(
        'Error',
        errorMessage,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.title}>Record Payment</Text>
              {party && (
                <Text style={styles.subtitle}>
                  {party.name}
                  {outstandingAmount !== undefined && (
                    <Text style={styles.balanceText}>
                      {' '}• Outstanding: ₹{outstandingAmount.toLocaleString('en-IN')}
                    </Text>
                  )}
                </Text>
              )}
            </View>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X color={tokens.foreground} size={24} />
            </Pressable>
          </View>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {!party ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Please select a party to record payment.</Text>
            </View>
          ) : (
            <>
              {/* Amount Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Payment Amount *</Text>
                <View style={styles.amountContainer}>
                  <Text style={styles.currencySymbol}>₹</Text>
                  <TextInput
                    style={styles.amountInput}
                    value={amount}
                    onChangeText={setAmount}
                    placeholder="0.00"
                    placeholderTextColor={tokens.mutedForeground}
                    keyboardType="numeric"
                    autoFocus
                  />
                </View>
                {outstandingAmount !== undefined && outstandingAmount > 0 && (
                  <Text style={styles.hint}>
                    Outstanding balance: ₹{outstandingAmount.toLocaleString('en-IN')}
                  </Text>
                )}
              </View>

              {/* Payment Date */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Payment Date *</Text>
                <Pressable
                  style={styles.dateButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Calendar color={tokens.primary} size={18} />
                  <Text style={styles.dateText}>{formatDate(paymentDate)}</Text>
                </Pressable>
                {showDatePicker && (
                  <DateTimePicker
                    value={paymentDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(Platform.OS === 'ios');
                      if (selectedDate) {
                        setPaymentDate(selectedDate);
                      }
                    }}
                  />
                )}
              </View>

              {/* Payment Method */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Payment Method *</Text>
                <View style={styles.methodContainer}>
                  {paymentMethods.map(method => (
                    <Pressable
                      key={method.value}
                      style={[
                        styles.methodButton,
                        paymentMethod === method.value && styles.methodButtonActive,
                      ]}
                      onPress={() => setPaymentMethod(method.value)}
                    >
                      <Text
                        style={[
                          styles.methodButtonText,
                          paymentMethod === method.value && styles.methodButtonTextActive,
                        ]}
                      >
                        {method.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Reference Number */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Reference Number (Optional)</Text>
                <TextInput
                  style={styles.textInput}
                  value={reference}
                  onChangeText={setReference}
                  placeholder="e.g., UPI-123456, Cheque #123"
                  placeholderTextColor={tokens.mutedForeground}
                />
              </View>

              {/* Notes */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Notes (Optional)</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Additional notes about this payment"
                  placeholderTextColor={tokens.mutedForeground}
                  multiline
                  numberOfLines={3}
                />
              </View>
            </>
          )}
        </ScrollView>

        {/* Footer */}
        {party && (
          <View style={styles.footer}>
            <Pressable
              style={[
                styles.submitButton,
                isSubmitting && styles.submitButtonDisabled,
              ]}
              onPress={validateAndSubmit}
              disabled={isSubmitting}
            >
              <Banknote color={tokens.primaryForeground} size={20} />
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Recording...' : 'Record Payment'}
              </Text>
            </Pressable>
          </View>
        )}
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
      padding: 20,
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: tokens.border,
      backgroundColor: tokens.card,
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: tokens.foreground,
    },
    subtitle: {
      marginTop: 4,
      fontSize: 14,
      color: tokens.mutedForeground,
    },
    balanceText: {
      color: tokens.primary,
      fontWeight: '600',
    },
    closeButton: {
      padding: 4,
    },
    content: {
      flex: 1,
    },
    contentContainer: {
      padding: 20,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 40,
    },
    emptyText: {
      color: tokens.mutedForeground,
      fontSize: 16,
    },
    inputGroup: {
      marginBottom: 24,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: tokens.foreground,
      marginBottom: 8,
    },
    amountContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: tokens.border,
      borderRadius: 12,
      backgroundColor: tokens.card,
      paddingHorizontal: 16,
      height: 56,
    },
    currencySymbol: {
      fontSize: 20,
      fontWeight: '700',
      color: tokens.foreground,
      marginRight: 8,
    },
    amountInput: {
      flex: 1,
      fontSize: 20,
      fontWeight: '700',
      color: tokens.foreground,
      padding: 0,
    },
    hint: {
      marginTop: 6,
      fontSize: 12,
      color: tokens.mutedForeground,
    },
    dateButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      borderWidth: 1,
      borderColor: tokens.border,
      borderRadius: 12,
      backgroundColor: tokens.card,
      paddingHorizontal: 16,
      height: 50,
    },
    dateText: {
      fontSize: 16,
      color: tokens.foreground,
      fontWeight: '500',
    },
    methodContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    methodButton: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: tokens.border,
      backgroundColor: tokens.card,
    },
    methodButtonActive: {
      backgroundColor: tokens.primary,
      borderColor: tokens.primary,
    },
    methodButtonText: {
      fontSize: 14,
      fontWeight: '500',
      color: tokens.foreground,
    },
    methodButtonTextActive: {
      color: tokens.primaryForeground,
    },
    textInput: {
      borderWidth: 1,
      borderColor: tokens.border,
      borderRadius: 12,
      backgroundColor: tokens.card,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: tokens.foreground,
    },
    textArea: {
      minHeight: 80,
      textAlignVertical: 'top',
    },
    footer: {
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: tokens.border,
      backgroundColor: tokens.card,
    },
    submitButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: tokens.primary,
      paddingVertical: 16,
      borderRadius: 12,
    },
    submitButtonDisabled: {
      opacity: 0.6,
    },
    submitButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: tokens.primaryForeground,
    },
  });

export default RecordPaymentSheet;

