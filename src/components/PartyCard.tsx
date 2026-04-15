import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useThemeTokens } from '../theme/ThemeProvider';
import { ThemeTokens } from '../theme/tokens';

export type PartyStatus = 'RECEIVABLE' | 'PAYABLE' | 'SETTLED' | 'OVERDUE';

export interface PartyModel {
  id: string;
  name: string;
  phone: string;
  balance: number;
  status: PartyStatus;
  partyType?: 'CUSTOMER' | 'VENDOR';
}

interface PartyCardProps {
  party: PartyModel;
  onPress: () => void;
  alternate?: boolean;
}

const formatCurrency = (value: number) => {
  const absoluteValue = Math.abs(value);
  return `₹${absoluteValue.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const STATUS_LABELS: Record<PartyStatus, string> = {
  RECEIVABLE: 'Receivable',
  PAYABLE: 'Payable',
  SETTLED: 'Settled',
  OVERDUE: 'Overdue',
};

const PartyCard: React.FC<PartyCardProps> = ({ party, onPress, alternate = false }) => {
  const { tokens } = useThemeTokens();
  const styles = useMemo(() => createStyles(tokens), [tokens]);

  const isPayable = party.status === 'PAYABLE' || party.balance < 0;
  const isSettled = party.status === 'SETTLED' || party.balance === 0;
  const isOverdue = party.status === 'OVERDUE';

  const balanceColor = isOverdue
    ? tokens.destructive
    : isPayable
    ? tokens.destructive
    : isSettled
    ? tokens.mutedForeground
    : tokens.primary;

  const displayBalance = isPayable
    ? `-${formatCurrency(party.balance)}`
    : formatCurrency(party.balance);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        alternate && styles.containerAlternate,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      accessibilityLabel={`${party.name}, balance ${displayBalance}`}
    >
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{party.name}</Text>
        <Text style={styles.phone}>{party.phone}</Text>
      </View>

      <View style={styles.balanceContainer}>
        <Text style={[styles.balanceText, { color: balanceColor }]}>
          {displayBalance}
        </Text>
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, { backgroundColor: balanceColor }]} />
          <Text style={[styles.statusLabel, { color: balanceColor }]}>
            {STATUS_LABELS[party.status]}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const createStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: tokens.surface_container_lowest,
      paddingVertical: 16,
      paddingHorizontal: 20,
    },
    containerAlternate: {
      backgroundColor: tokens.muted,
    },
    pressed: {
      backgroundColor: tokens.muted,
    },
    info: {
      flex: 1,
      marginRight: 12,
    },
    name: {
      fontSize: 16,
      fontWeight: '700',
      color: tokens.foreground,
      marginBottom: 3,
    },
    phone: {
      fontSize: 13,
      color: tokens.mutedForeground,
    },
    balanceContainer: {
      alignItems: 'flex-end',
    },
    balanceText: {
      fontSize: 17,
      fontWeight: '800',
      letterSpacing: -0.3,
    },
    statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
      gap: 4,
    },
    statusDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    statusLabel: {
      fontSize: 9,
      fontWeight: '700',
      letterSpacing: 0.6,
      textTransform: 'uppercase',
    },
  });

export default React.memo(PartyCard);
