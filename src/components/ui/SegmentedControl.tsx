import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  ViewStyle,
} from 'react-native';
import { useThemeTokens } from '../../theme/ThemeProvider';
import { ThemeTokens } from '../../theme/tokens';

export interface SegmentOption<T extends string = string> {
  value: T;
  label: string;
}

export interface SegmentedControlProps<T extends string = string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  scrollable?: boolean;
  containerStyle?: ViewStyle;
  accessibilityLabel?: string;
}

function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  scrollable = false,
  containerStyle,
  accessibilityLabel,
}: SegmentedControlProps<T>) {
  const { tokens } = useThemeTokens();
  const styles = React.useMemo(() => createStyles(tokens), [tokens]);

  const pills = options.map(option => {
    const isActive = option.value === value;
    return (
      <Pressable
        key={option.value}
        style={[styles.pill, isActive && styles.pillActive]}
        onPress={() => onChange(option.value)}
        accessibilityRole="button"
        accessibilityState={{ selected: isActive }}
        accessibilityLabel={option.label}
        hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
      >
        <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
          {option.label}
        </Text>
      </Pressable>
    );
  });

  if (scrollable) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.track, containerStyle]}
        accessibilityLabel={accessibilityLabel}
      >
        {pills}
      </ScrollView>
    );
  }

  return (
    <View
      style={[styles.track, containerStyle]}
      accessibilityLabel={accessibilityLabel}
    >
      {pills}
    </View>
  );
}

const createStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    track: {
      flexDirection: 'row',
      backgroundColor: tokens.card,
      borderRadius: tokens.radiusMd,
      borderWidth: 1,
      borderColor: tokens.border,
      padding: 4,
      alignSelf: 'flex-start',
    },
    pill: {
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: tokens.radiusSm,
    },
    pillActive: {
      backgroundColor: tokens.primary,
    },
    pillText: {
      fontSize: 13,
      fontWeight: '600',
      color: tokens.mutedForeground,
    },
    pillTextActive: {
      color: tokens.primaryForeground,
    },
  });

export default SegmentedControl;
