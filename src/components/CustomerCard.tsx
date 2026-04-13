import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useThemeTokens } from '../theme/ThemeProvider';
import { ThemeTokens } from '../theme/tokens';
import StatusBadge from './ui/StatusBadge';
import { Phone, MessageSquare, Share2 } from 'lucide-react-native';

export type Customer = {
  id: string;
  name: string;
  businessType: string;
  location: string;
  dueAmount: number;
  totalSale: number;
  lastInvoice: string;
  status: 'clear' | 'due' | 'overdue';
  phone: string;
};

interface CustomerCardProps {
  customer: Customer;
  onPress: () => void;
  onPhonePress?: () => void;
  onMessagePress?: () => void;
  onSharePress?: () => void;
}

const formatCurrency = (value: number) => `₹${value.toLocaleString('en-IN')}`;

const CustomerCard: React.FC<CustomerCardProps> = ({
  customer,
  onPress,
  onPhonePress,
  onMessagePress,
  onSharePress,
}) => {
  const { tokens } = useThemeTokens();
  const styles = useMemo(() => createStyles(tokens), [tokens]);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        customer.status === 'overdue' && styles.containerOverdue,
        customer.status === 'clear' && styles.containerClear,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`View details for ${customer.name}`}
    >
      <View style={styles.header}>
        <View style={styles.titleBlock}>
          <Text style={styles.name}>{customer.name}</Text>
          <Text style={styles.meta}>
            {customer.businessType} · {customer.location}
          </Text>
        </View>
        <StatusBadge
          status={
            customer.status === 'clear'
              ? 'success'
              : customer.status === 'overdue'
              ? 'error'
              : 'warning'
          }
          label={customer.status.toUpperCase()}
          size="sm"
        />
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.detailBlock}>
          <Text style={styles.detailLabel}>Due Amount</Text>
          <Text style={styles.detailValue}>
            {formatCurrency(customer.dueAmount)}
          </Text>
        </View>
        <View style={styles.detailBlock}>
          <Text style={styles.detailLabel}>Total Sale</Text>
          <Text style={styles.detailValue}>
            {formatCurrency(customer.totalSale)}
          </Text>
        </View>
        <View style={styles.detailBlock}>
          <Text style={styles.detailLabel}>Last Invoice</Text>
          <Text style={styles.detailValue}>{customer.lastInvoice}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View>
          <Text style={styles.footerLabel}>Contact</Text>
          <Text style={styles.footerValue}>{customer.phone}</Text>
        </View>
        <View style={styles.footerActions}>
          <Pressable style={styles.iconButton} onPress={onPhonePress}>
            <Phone color={tokens.foreground} size={16} />
          </Pressable>
          <Pressable style={styles.iconButton} onPress={onMessagePress}>
            <MessageSquare color={tokens.foreground} size={16} />
          </Pressable>
          <Pressable style={styles.iconButton} onPress={onSharePress}>
            <Share2 color={tokens.foreground} size={16} />
          </Pressable>
        </View>
      </View>
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
    containerOverdue: {
      borderColor: tokens.destructive,
      backgroundColor: 'rgba(239, 68, 68, 0.05)', // Very subtle red tint
    },
    containerClear: {
      borderColor: tokens.border, // Keep default border for clear
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
    name: {
      color: tokens.foreground,
      fontWeight: '700',
      fontSize: 16,
    },
    meta: {
      color: tokens.mutedForeground,
      marginTop: 4,
      fontSize: 12,
    },
    detailsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 14,
    },
    detailBlock: {
      flex: 1,
      paddingRight: 10,
    },
    detailLabel: {
      color: tokens.mutedForeground,
      fontSize: 12,
      marginBottom: 4,
    },
    detailValue: {
      color: tokens.foreground,
      fontWeight: '700',
      fontSize: 15,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    footerLabel: {
      color: tokens.mutedForeground,
      fontSize: 12,
    },
    footerValue: {
      color: tokens.foreground,
      fontWeight: '600',
      marginTop: 4,
    },
    footerActions: {
      flexDirection: 'row',
      marginLeft: -8,
      marginTop: 8,
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

export default React.memo(CustomerCard);
