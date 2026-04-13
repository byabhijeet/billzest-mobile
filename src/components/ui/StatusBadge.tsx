import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useThemeTokens } from '../../theme/ThemeProvider';
import { ThemeTokens } from '../../theme/tokens';

export type StatusType = 'success' | 'warning' | 'error' | 'info' | 'neutral';
export type BadgeVariant = 'solid' | 'subtle';
export type BadgeSize = 'sm' | 'md';

interface StatusBadgeProps {
  status: StatusType;
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  variant = 'subtle',
  size = 'md',
  containerStyle,
  textStyle,
}) => {
  const { tokens } = useThemeTokens();
  const styles = createStyles(tokens);

  const getColors = () => {
    switch (status) {
      case 'success':
        return {
          bg: variant === 'solid' ? tokens.accent : 'rgba(34,197,94,0.2)',
          text: variant === 'solid' ? '#FFFFFF' : tokens.accent, // '#16a34a' matches the green used in other screens
        };
      case 'warning':
        return {
          bg: variant === 'solid' ? tokens.warning : 'rgba(250,204,21,0.2)', // Yellowish
          text: variant === 'solid' ? '#000000' : tokens.warning,
        };
      case 'error':
        return {
          bg: variant === 'solid' ? tokens.destructive : 'rgba(220,38,38,0.2)',
          text: variant === 'solid' ? '#FFFFFF' : tokens.destructive,
        };
      case 'info':
        return {
          bg: variant === 'solid' ? tokens.primary : 'rgba(59, 130, 246, 0.2)',
          text: variant === 'solid' ? tokens.primaryForeground : tokens.primary,
        };
      case 'neutral':
      default:
        return {
          bg: variant === 'solid' ? tokens.muted : tokens.muted,
          text:
            variant === 'solid'
              ? tokens.mutedForeground
              : tokens.mutedForeground,
        };
    }
  };

  const colors = getColors();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: colors.bg,
          paddingHorizontal: size === 'sm' ? 10 : 14,
          paddingVertical: size === 'sm' ? 4 : 6,
        },
        containerStyle,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: colors.text,
            fontSize: size === 'sm' ? 10 : 12,
          },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const createStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    badge: {
      borderRadius: 999,
      alignSelf: 'flex-start',
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      fontWeight: '700',
    },
  });

export default StatusBadge;
