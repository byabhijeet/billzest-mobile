import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useThemeTokens } from '../theme/ThemeProvider';
import { ThemeTokens } from '../theme/tokens';

export type QuickLinkItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  shortcut?: string;
  onPress?: () => void;
};

type QuickLinksCardProps = {
  items: QuickLinkItem[];
  title?: string;
  showAllLabel?: string;
  onShowAll?: () => void;
};

const QuickLinksCard: React.FC<QuickLinksCardProps> = ({
  items,
  title = 'Quick Links',
  showAllLabel = 'Show All',
  onShowAll,
}) => {
  const { tokens } = useThemeTokens();
  const styles = useMemo(() => createStyles(tokens), [tokens]);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Pressable onPress={onShowAll}>
          <Text style={styles.link}>{showAllLabel}</Text>
        </Pressable>
      </View>
      <View style={styles.grid}>
        {items.map(item => (
          <Pressable key={item.id} style={styles.item} onPress={item.onPress}>
            <View style={styles.iconContainer}>{item.icon}</View>
            <Text style={styles.itemLabel}>{item.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const createStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    card: {
      backgroundColor: tokens.card,
      borderRadius: 16,
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderWidth: 1,
      borderColor: tokens.border,
      marginBottom: 16,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    title: {
      color: tokens.foreground,
      fontWeight: '700',
      fontSize: 14,
    },
    link: {
      color: tokens.primary,
      fontWeight: '600',
      fontSize: 12,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    item: {
      width: '23%',
      marginBottom: 10,
      alignItems: 'center',
      backgroundColor: tokens.card,
      borderRadius: 12,
      paddingVertical: 8,
      paddingHorizontal: 4,
      borderWidth: 1,
      borderColor: tokens.border,
    },
    iconContainer: {
      width: 36,
      height: 36,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: tokens.background,
      marginBottom: 6,
    },
    itemLabel: {
      color: tokens.foreground,
      fontWeight: '600',
      fontSize: 12,
      textAlign: 'center',
    },
  });

export default QuickLinksCard;
