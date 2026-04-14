import React from 'react';
import { Text, TextStyle, StyleProp } from 'react-native';
import { useThemeTokens } from '../../theme/ThemeProvider';

interface TypographyProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  accessibilityLabel?: string;
}

export const Heading: React.FC<TypographyProps> = ({ children, style, ...rest }) => {
  const { tokens } = useThemeTokens();
  return (
    <Text
      style={[{ fontSize: 24, fontWeight: '700', color: tokens.foreground }, style]}
      {...rest}
    >
      {children}
    </Text>
  );
};

export const Subheading: React.FC<TypographyProps> = ({ children, style, ...rest }) => {
  const { tokens } = useThemeTokens();
  return (
    <Text
      style={[{ fontSize: 18, fontWeight: '700', color: tokens.foreground }, style]}
      {...rest}
    >
      {children}
    </Text>
  );
};

export const Body: React.FC<TypographyProps> = ({ children, style, ...rest }) => {
  const { tokens } = useThemeTokens();
  return (
    <Text
      style={[{ fontSize: 15, fontWeight: '400', color: tokens.foreground }, style]}
      {...rest}
    >
      {children}
    </Text>
  );
};

export const Label: React.FC<TypographyProps> = ({ children, style, ...rest }) => {
  const { tokens } = useThemeTokens();
  return (
    <Text
      style={[{ fontSize: 13, fontWeight: '600', color: tokens.foreground }, style]}
      {...rest}
    >
      {children}
    </Text>
  );
};

export const Caption: React.FC<TypographyProps> = ({ children, style, ...rest }) => {
  const { tokens } = useThemeTokens();
  return (
    <Text
      style={[{ fontSize: 12, fontWeight: '400', color: tokens.mutedForeground }, style]}
      {...rest}
    >
      {children}
    </Text>
  );
};

export const Overline: React.FC<TypographyProps> = ({ children, style, ...rest }) => {
  const { tokens } = useThemeTokens();
  return (
    <Text
      style={[
        {
          fontSize: 10,
          fontWeight: '800',
          color: tokens.mutedForeground,
          letterSpacing: 1.2,
          textTransform: 'uppercase',
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
};
