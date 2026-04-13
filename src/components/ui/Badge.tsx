import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useThemeTokens } from '../../theme/ThemeProvider';

type BadgeVariant = 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  style,
  textStyle,
}) => {
  const { tokens } = useThemeTokens();
  
  const getStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          container: { backgroundColor: tokens.secondary, borderColor: tokens.border },
          text: { color: tokens.secondaryForeground },
        };
      case 'outline':
        return {
          container: { backgroundColor: 'transparent', borderColor: tokens.border, borderWidth: 1 },
          text: { color: tokens.mutedForeground },
        };
      case 'destructive':
        return {
          container: { backgroundColor: tokens.destructive, borderColor: tokens.destructive },
          text: { color: tokens.destructiveForeground },
        };
      case 'success':
        return {
          container: { backgroundColor: 'rgba(52, 211, 153, 0.2)', borderColor: 'rgba(52, 211, 153, 0.4)', borderWidth: 1 },
          text: { color: '#047857' }, // Emerald 700
        };
      case 'warning':
        return {
          container: { backgroundColor: 'rgba(251, 191, 36, 0.2)', borderColor: 'rgba(251, 191, 36, 0.4)', borderWidth: 1 },
          text: { color: '#b45309' }, // Amber 700
        };
      case 'default':
      default:
        return {
          container: { backgroundColor: tokens.primary, borderColor: tokens.primary },
          text: { color: tokens.primaryForeground },
        };
    }
  };

  const variantStyles = getStyles();

  return (
    <View style={[styles.badge, variantStyles.container, style]}>
      <Text style={[styles.text, variantStyles.text, textStyle]}>
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
