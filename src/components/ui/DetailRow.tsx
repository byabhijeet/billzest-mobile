import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Pressable,
} from 'react-native';
import { useThemeTokens } from '../../theme/ThemeProvider';
import { ThemeTokens } from '../../theme/tokens';
import { Copy } from 'lucide-react-native';

interface DetailRowProps {
  label: string;
  value: string | number | React.ReactNode;
  subValue?: string;
  icon?: React.ReactNode;
  variant?: 'card' | 'plain';
  style?: ViewStyle;
  labelStyle?: TextStyle;
  valueStyle?: TextStyle;
  onPress?: () => void;
  copyable?: boolean;
}

const DetailRow: React.FC<DetailRowProps> = ({
  label,
  value,
  subValue,
  icon,
  variant = 'plain',
  style,
  labelStyle,
  valueStyle,
  onPress,
  copyable,
}) => {
  const { tokens } = useThemeTokens();
  const styles = createStyles(tokens);

  const Container = onPress ? Pressable : View;

  return (
    <Container
      style={[
        variant === 'card' && styles.cardContainer,
        styles.container,
        style,
      ]}
      onPress={onPress}
    >
      <View style={styles.content}>
        <Text style={[styles.label, labelStyle]}>{label}</Text>
        <View style={styles.valueRow}>
          {typeof value === 'string' || typeof value === 'number' ? (
            <Text style={[styles.value, valueStyle]}>{value}</Text>
          ) : (
            value
          )}
          {copyable && !icon && (
            <Copy
              size={14}
              color={tokens.mutedForeground}
              style={{ marginLeft: 6 }}
            />
          )}
          {icon && <View style={{ marginLeft: 6 }}>{icon}</View>}
        </View>
        {subValue && <Text style={styles.subValue}>{subValue}</Text>}
      </View>
    </Container>
  );
};

const createStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    container: {
      justifyContent: 'center',
    },
    cardContainer: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: tokens.border,
      padding: 12,
      backgroundColor: tokens.background,
    },
    content: {
      flexDirection: 'column',
    },
    label: {
      color: tokens.mutedForeground,
      marginBottom: 6,
      fontSize: 12,
      fontWeight: '500',
      letterSpacing: 0.3,
    },
    valueRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    value: {
      fontSize: 14,
      fontWeight: '600',
      color: tokens.foreground,
    },
    subValue: {
      color: tokens.mutedForeground,
      marginTop: 4,
      fontSize: 12,
    },
  });

export default DetailRow;
