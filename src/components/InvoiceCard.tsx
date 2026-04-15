import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useThemeTokens } from '../theme/ThemeProvider';
import { ThemeTokens } from '../theme/tokens';
import { MoreVertical } from 'lucide-react-native';

export type InvoiceStatus =
  | 'paid'
  | 'pending'
  | 'overdue'
  | 'draft'
  | 'cancelled';

export interface InvoiceProp {
  id: string;
  invoiceNumber: string;
  clientName: string;
  date: string;
  dueDate?: string;
  amount: number;
  balance?: number;
  status: string;
  currency?: string;
}

interface InvoiceCardProps {
  invoice: InvoiceProp;
  onPress: () => void;
  variant?: 'default' | 'compact';
  showActions?: boolean;
  onShare?: () => void;
  onPayment?: () => void;
}

const formatCurrency = (value: number) => `₹${value.toLocaleString('en-IN')}`;

const formatDateSafe = (dateString: string | null | undefined): string => {
  if (!dateString) return new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const date = dateString.includes('T')
    ? new Date(dateString)
    : new Date(dateString + 'T00:00:00');
  if (isNaN(date.getTime())) {
    const fallback = new Date(dateString);
    if (isNaN(fallback.getTime())) return new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    return fallback.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const InvoiceCard: React.FC<InvoiceCardProps> = ({
  invoice,
  onPress,
  variant = 'default',
  showActions = true,
  onShare,
  onPayment,
}) => {
  const { tokens } = useThemeTokens();
  const styles = useMemo(() => createStyles(tokens), [tokens]);

  if (variant === 'compact') {
    return (
      <Pressable
        style={({ pressed }) => [styles.compactRow, pressed && styles.pressed]}
        onPress={onPress}
        accessibilityRole="button"
      >
        <View style={styles.compactLeft}>
          <Text style={styles.compactClientName} numberOfLines={1}>{invoice.clientName}</Text>
          <View style={styles.compactMeta}>
            <Text style={styles.compactInvoiceChip}>#{invoice.invoiceNumber}</Text>
            <Text style={styles.compactDate}>{formatDateSafe(invoice.date)}</Text>
          </View>
        </View>
        <Text style={styles.compactAmount}>{formatCurrency(invoice.amount)}</Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole="button"
    >
      <View style={styles.left}>
        <Text style={styles.clientName} numberOfLines={1}>{invoice.clientName}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.invoiceChip}>#{invoice.invoiceNumber}</Text>
          <Text style={styles.date}>{formatDateSafe(invoice.date)}</Text>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={styles.amount}>{formatCurrency(invoice.amount)}</Text>
        {showActions && (
          <Pressable
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={onPayment}
            accessibilityLabel="Invoice options"
          >
            <MoreVertical color={tokens.mutedForeground} size={20} />
          </Pressable>
        )}
      </View>
    </Pressable>
  );
};

const createStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    row: {
      backgroundColor: tokens.surface_container_lowest,
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    compactRow: {
      backgroundColor: tokens.surface_container_lowest,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    pressed: {
      backgroundColor: tokens.muted,
    },
    left: {
      flex: 1,
      paddingRight: 12,
      gap: 4,
    },
    clientName: {
      color: tokens.foreground,
      fontWeight: '700',
      fontSize: 14,
      letterSpacing: -0.2,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    invoiceChip: {
      fontSize: 10,
      fontFamily: 'monospace',
      color: tokens.mutedForeground,
      backgroundColor: tokens.muted,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      overflow: 'hidden',
    },
    date: {
      fontSize: 11,
      color: tokens.mutedForeground,
    },
    right: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    amount: {
      color: tokens.foreground,
      fontWeight: '800',
      fontSize: 14,
    },
    compactLeft: {
      flex: 1,
      paddingRight: 12,
      gap: 4,
    },
    compactClientName: {
      color: tokens.foreground,
      fontWeight: '700',
      fontSize: 13,
    },
    compactMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    compactInvoiceChip: {
      fontSize: 10,
      fontFamily: 'monospace',
      color: tokens.mutedForeground,
      backgroundColor: tokens.muted,
      paddingHorizontal: 5,
      paddingVertical: 1,
      borderRadius: 3,
      overflow: 'hidden',
    },
    compactDate: {
      fontSize: 11,
      color: tokens.mutedForeground,
    },
    compactAmount: {
      color: tokens.foreground,
      fontWeight: '800',
      fontSize: 13,
    },
  });

export default React.memo(InvoiceCard);
