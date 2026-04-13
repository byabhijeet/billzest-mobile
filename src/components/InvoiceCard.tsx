import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useThemeTokens } from '../theme/ThemeProvider';
import { ThemeTokens } from '../theme/tokens';
import StatusBadge from './ui/StatusBadge';
import { Share2, CreditCard } from 'lucide-react-native';

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
  status: string; // loose typing to allow varied backend strings, mapped internally
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

// Helper function to safely format dates
const formatDateSafe = (dateString: string | null | undefined): string => {
  if (!dateString) {
    return new Date().toLocaleDateString('en-IN');
  }
  
  // Handle date strings in YYYY-MM-DD format
  const date = dateString.includes('T') 
    ? new Date(dateString) 
    : new Date(dateString + 'T00:00:00');
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    // Fallback: try parsing as-is
    const fallbackDate = new Date(dateString);
    if (isNaN(fallbackDate.getTime())) {
      return new Date().toLocaleDateString('en-IN');
    }
    return fallbackDate.toLocaleDateString('en-IN');
  }
  
  return date.toLocaleDateString('en-IN');
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

  const mapStatus = (status: string | null | undefined) => {
    if (!status) return 'warning'; // default to 'pending' style if status is undefined/null
    const s = status.toLowerCase();
    if (s === 'paid') return 'success';
    if (s === 'overdue') return 'error';
    if (s === 'pending') return 'warning';
    if (s === 'draft') return 'neutral';
    return 'info';
  };

  const statusType = mapStatus(invoice.status);
  const safeStatus = invoice.status ?? 'pending';
  const statusLabel =
    safeStatus === 'draft' ? 'DRAFT' : safeStatus.toUpperCase();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        variant === 'compact' && styles.compactContainer,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      accessibilityRole="button"
    >
      <View style={styles.header}>
        <View style={styles.titleBlock}>
          <Text style={styles.clientName}>{invoice.clientName}</Text>
          <Text style={styles.meta}>
            #{invoice.invoiceNumber}
            {variant === 'default' &&
              ` · Issued ${formatDateSafe(invoice.date)}`}
            {variant === 'compact' &&
              ` · ${formatDateSafe(invoice.date)}`}
          </Text>
        </View>
        <StatusBadge status={statusType} label={statusLabel} size="sm" />
      </View>

      <View style={styles.valuesRow}>
        <View>
          <Text style={styles.label}>Total</Text>
          <Text style={styles.amount}>{formatCurrency(invoice.amount)}</Text>
        </View>

        {variant === 'default' && invoice.dueDate && (
          <View>
            <Text style={styles.label}>Due Date</Text>
            <Text style={styles.value}>
              {formatDateSafe(invoice.dueDate)}
            </Text>
          </View>
        )}

        {variant === 'compact' && (
          <View>
            <Text style={styles.label}>Balance</Text>
            <Text style={styles.value}>
              {invoice.balance !== undefined
                ? formatCurrency(invoice.balance)
                : statusType === 'success'
                ? '₹0'
                : formatCurrency(invoice.amount)}
            </Text>
          </View>
        )}

        {variant === 'default' && (
          <View>
            <Text style={styles.label}>Status</Text>
            <Text
              style={[
                styles.value,
                {
                  color:
                    tokens[
                      statusType === 'success'
                        ? 'accent'
                        : statusType === 'error'
                        ? 'destructive'
                        : 'warning'
                    ],
                },
              ]}
            >
              {statusLabel}
            </Text>
          </View>
        )}
      </View>

      {variant === 'default' && showActions && (
        <View style={styles.footer}>
          <Pressable
            style={styles.iconButton}
            onPress={onShare}
            accessibilityRole="button"
            accessibilityLabel="Share Invoice"
          >
            <Share2 color={tokens.foreground} size={16} />
          </Pressable>
          <Pressable
            style={styles.iconButton}
            onPress={onPayment}
            accessibilityRole="button"
            accessibilityLabel="Collect Payment"
          >
            <CreditCard color={tokens.foreground} size={16} />
          </Pressable>
        </View>
      )}
    </Pressable>
  );
};

const createStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    container: {
      backgroundColor: tokens.card,
      borderRadius: 20,
      padding: 16,
      borderWidth: 1,
      borderColor: tokens.border,
      marginBottom: 16,
    },
    compactContainer: {
      padding: 14,
      borderRadius: 16,
      marginBottom: 12,
    },
    pressed: {
      opacity: 0.95,
      transform: [{ scale: 0.99 }],
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    titleBlock: {
      flex: 1,
      paddingRight: 12,
    },
    clientName: {
      color: tokens.foreground,
      fontWeight: '700',
      fontSize: 16,
    },
    meta: {
      color: tokens.mutedForeground,
      marginTop: 4,
      fontSize: 12,
    },
    valuesRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    label: {
      color: tokens.mutedForeground,
      fontSize: 12,
      marginBottom: 4,
    },
    amount: {
      color: tokens.foreground,
      fontWeight: '700',
      fontSize: 18,
    },
    value: {
      color: tokens.foreground,
      fontWeight: '600',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginLeft: -8,
      marginTop: 4,
    },
    iconButton: {
      borderRadius: 999,
      borderWidth: 1,
      borderColor: tokens.border,
      paddingHorizontal: 14,
      paddingVertical: 6,
      marginLeft: 8,
    },
  });

export default React.memo(InvoiceCard);
