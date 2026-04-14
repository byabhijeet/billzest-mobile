import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { useThemeTokens } from '../../theme/ThemeProvider';
import { ThemeTokens } from '../../theme/tokens';
import { ShoppingBag } from 'lucide-react-native';
import type { AppNavigationParamList } from '../../navigation/types';

interface PurchaseReportCardProps {
  totalPurchases: number;
  isLoading: boolean;
}

const PurchaseReportCard: React.FC<PurchaseReportCardProps> = ({
  totalPurchases,
  isLoading,
}) => {
  const { tokens } = useThemeTokens();
  const styles = createStyles(tokens);
  const navigation = useNavigation<NavigationProp<AppNavigationParamList>>();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.purchaseCard,
        pressed && { opacity: 0.7 },
      ]}
      onPress={() => navigation.navigate('Purchases' as any, { screen: 'PurchaseList' } as any)}
    >
      <View style={styles.purchaseHeader}>
        <ShoppingBag size={18} color={tokens.mutedForeground} />
        <Text style={styles.purchaseLabel}>Total Purchases</Text>
      </View>
      <Text style={styles.purchaseValue}>
        {isLoading
          ? '…'
          : `₹${Math.round(totalPurchases).toLocaleString('en-IN')}`}
      </Text>
    </Pressable>
  );
};

const createStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    purchaseCard: {
      backgroundColor: tokens.card,
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: tokens.border,
    },
    purchaseHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
      gap: 8,
    },
    purchaseLabel: {
      fontSize: 12,
      color: tokens.mutedForeground,
      fontWeight: '600',
    },
    purchaseValue: {
      fontSize: 20,
      fontWeight: '700',
      color: tokens.foreground,
    },
  });

export default PurchaseReportCard;

