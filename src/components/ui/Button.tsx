import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  GestureResponderEvent,
  View,
  TextStyle,
} from 'react-native';
import { useThemeTokens } from '../../theme/ThemeProvider';
import { ThemeTokens } from '../../theme/tokens';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive';

export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

export interface ButtonProps {
  label?: string;
  onPress?: (event: GestureResponderEvent) => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'default',
  icon,
  loading = false,
  disabled = false,
  fullWidth = false,
  accessibilityLabel,
  style,
  labelStyle,
}) => {
  const { tokens } = useThemeTokens();
  const styles = React.useMemo(() => createStyles(tokens), [tokens]);

  const isDisabled = disabled || loading;
  const variantStyle = styles[variant] || styles.primary;
  const sizeStyle =
    styles[
      size === 'icon'
        ? 'sizeIcon'
        : size === 'sm'
        ? 'sizeSm'
        : size === 'lg'
        ? 'sizeLg'
        : 'sizeDefault'
    ];

  const textColor =
    variant === 'secondary' || variant === 'outline' || variant === 'ghost'
      ? tokens.foreground
      : tokens.primaryForeground;

  const indicatorColor = textColor;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        fullWidth && styles.fullWidth,
        variantStyle,
        sizeStyle,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
    >
      {icon && <View style={styles.iconSlot}>{icon}</View>}
      {loading ? (
        <ActivityIndicator size="small" color={indicatorColor} />
      ) : (
        <Text style={[styles.label, { color: textColor }, labelStyle]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
};

const createStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    base: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 16,
      borderWidth: 1,
      minHeight: 40,
    },
    sizeDefault: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      minHeight: 48,
    },
    sizeSm: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      minHeight: 36,
    },
    sizeLg: {
      paddingHorizontal: 28,
      paddingVertical: 16,
      minHeight: 56,
    },
    sizeIcon: {
      padding: 8,
      width: 44,
      height: 44,
    },
    fullWidth: {
      width: '100%',
    },
    primary: {
      backgroundColor: tokens.primary,
      borderColor: tokens.primary,
    },
    secondary: {
      backgroundColor: tokens.card,
      borderColor: tokens.border,
    },
    outline: {
      backgroundColor: 'transparent',
      borderColor: tokens.border,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
    },
    destructive: {
      backgroundColor: tokens.destructive,
      borderColor: tokens.destructive,
    },
    label: {
      fontSize: 15,
      fontWeight: '600',
      color: tokens.primaryForeground,
    },
    pressed: {
      transform: [{ scale: 0.99 }],
      opacity: 0.95,
    },
    disabled: {
      opacity: 0.5,
    },
    iconSlot: {
      marginRight: 8,
    },
  });

export default Button;
