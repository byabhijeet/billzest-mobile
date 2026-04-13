import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeTokens } from '../../theme/ThemeProvider';
import { ThemeTokens } from '../../theme/tokens';
import { ArrowUpRight } from 'lucide-react-native';

interface TodaysSalesHeroProps {
  sales: number;
  isLoading: boolean;
}

const TodaysSalesHero: React.FC<TodaysSalesHeroProps> = ({
  sales,
  isLoading,
}) => {
  const { tokens, mode } = useThemeTokens();
  const styles = createStyles(tokens, mode);

  return (
    <View style={styles.todaysSalesCard}>
      <Text style={styles.todaysSalesLabel}>Today's Sales</Text>
      <Text style={styles.todaysSalesValue}>
        {isLoading ? '…' : `₹${Math.round(sales).toLocaleString('en-IN')}`}
      </Text>
      <View style={styles.growthBadge}>
        <ArrowUpRight size={14} color={tokens.accent} />
        <Text style={styles.growthText}>Live sales</Text>
      </View>
    </View>
  );
};

const createStyles = (tokens: ThemeTokens, mode: 'light' | 'dark') =>
  StyleSheet.create({
    todaysSalesCard: {
      backgroundColor: tokens.card,
      borderRadius: 24,
      padding: 24,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: tokens.border,
      alignItems: 'center',
    },
    todaysSalesLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: tokens.mutedForeground,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 8,
    },
    todaysSalesValue: {
      fontSize: 42,
      fontWeight: '900',
      color: tokens.primary,
      marginBottom: 8,
    },
    growthBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: mode === 'dark' ? 'rgba(29, 185, 84, 0.2)' : 'rgba(29, 185, 84, 0.1)', // Spotify Green with opacity
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
    },
    growthText: {
      color: tokens.primary, // Using primary which is Spotify Green
      fontSize: 12,
      fontWeight: '700',
      marginLeft: 4,
    },
  });

export default TodaysSalesHero;
