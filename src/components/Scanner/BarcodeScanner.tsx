import React, { useCallback, useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, Pressable, Vibration, TextInput, Keyboard, Animated } from 'react-native';
import { useThemeTokens } from '../../theme/ThemeProvider';
import { ThemeTokens } from '../../theme/tokens';
import { ArrowLeft, Keyboard as KeyboardIcon } from 'lucide-react-native';

type BarcodeScannerProps = {
  onCodeScanned: (code: string) => void;
  onClose: () => void;
  itemsCount?: number;
  totalAmount?: number;
};

/**
 * Manual-only barcode entry component.
 * Camera scanning was removed during Expo Go migration.
 */
const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  onCodeScanned,
  onClose,
  itemsCount = 0,
  totalAmount = 0,
}) => {
  const { tokens } = useThemeTokens();
  const styles = React.useMemo(() => createStyles(tokens), [tokens]);
  const [manualCode, setManualCode] = useState('');
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Auto-focus the input on mount
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  const handleManualSubmit = useCallback(() => {
    const trimmedCode = manualCode.trim();
    if (trimmedCode.length > 0) {
      try {
        Vibration.vibrate(50);
      } catch (error) {
        // Vibration permission not granted - silently continue
      }
      onCodeScanned(trimmedCode);
      setManualCode('');
    }
  }, [manualCode, onCodeScanned]);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 1,
    }).format(val);

  return (
    <View style={[styles.container, { backgroundColor: tokens.background }]}>
      <View style={styles.header}>
        <Pressable onPress={onClose} style={styles.backButton}>
          <ArrowLeft color={tokens.foreground} size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Barcode Entry</Text>
        <View style={styles.rightButton} />
      </View>

      <View style={styles.manualContainer}>
        {itemsCount > 0 && (
          <Text style={[styles.cartInfo, { color: tokens.primary }]}>
            {itemsCount} items in cart{totalAmount > 0 ? ` • ${formatCurrency(totalAmount)}` : ''}
          </Text>
        )}

        <Text style={[styles.manualLabel, { color: tokens.foreground }]}>
          Enter barcode manually
        </Text>
        <TextInput
          ref={inputRef}
          style={[styles.manualInput, {
            backgroundColor: tokens.card,
            borderColor: tokens.border,
            color: tokens.foreground,
          }]}
          value={manualCode}
          onChangeText={setManualCode}
          placeholder="Enter barcode number"
          placeholderTextColor={tokens.mutedForeground}
          autoFocus
          keyboardType="numeric"
          returnKeyType="done"
          onSubmitEditing={handleManualSubmit}
          maxLength={50}
        />
        <Pressable
          onPress={handleManualSubmit}
          style={[styles.submitButton, {
            backgroundColor: tokens.primary,
            opacity: manualCode.trim().length > 0 ? 1 : 0.5,
          }]}
          disabled={manualCode.trim().length === 0}
        >
          <Text style={[styles.submitButtonText, { color: tokens.primaryForeground }]}>
            Submit
          </Text>
        </Pressable>
        <Text style={[styles.manualHint, { color: tokens.mutedForeground }]}>
          Type or scan with an external scanner
        </Text>
      </View>
    </View>
  );
};

const createStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 60,
      paddingBottom: 16,
      alignItems: 'center',
      backgroundColor: tokens.card,
      borderBottomWidth: 1,
      borderBottomColor: tokens.border,
    },
    backButton: {
      padding: 8,
    },
    headerTitle: {
      color: tokens.foreground,
      fontSize: 18,
      fontWeight: '600',
    },
    rightButton: {
      width: 40,
    },
    manualContainer: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 24,
      gap: 16,
    },
    cartInfo: {
      fontSize: 16,
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: 8,
    },
    manualLabel: {
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
    },
    manualInput: {
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 18,
      textAlign: 'center',
      letterSpacing: 2,
    },
    submitButton: {
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
    },
    submitButtonText: {
      fontSize: 16,
      fontWeight: '600',
    },
    manualHint: {
      fontSize: 14,
      textAlign: 'center',
    },
  });

export default BarcodeScanner;
