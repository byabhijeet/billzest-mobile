import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { useThemeTokens } from '../theme/ThemeProvider';

const logoSource = require('../assets/BillZest_Logo.png');

type BrandHeaderProps = {
  size?: number;
  tagline?: string;
  align?: 'left' | 'center';
  showText?: boolean;
};

const BrandHeader: React.FC<BrandHeaderProps> = ({
  size = 48,
  tagline = 'Lightning-fast billing',
  align = 'left',
  showText = true,
}) => {
  const { tokens } = useThemeTokens();
  const alignment: ViewStyle = align === 'center'
    ? { justifyContent: 'center' }
    : { justifyContent: 'flex-start' };

  return (
    <View style={[styles.container, alignment]}>
      <Image
        source={logoSource}
        style={[styles.logo, { width: size, height: size }]}
        resizeMode="contain"
        accessibilityLabel="BillZest lightning logo"
      />
      {showText && (
        <View style={styles.textGroup}>
          <Text style={[styles.title, { color: tokens.foreground }]}>BillZest</Text>
          {tagline ? (
            <Text style={[styles.tagline, { color: tokens.mutedForeground }]} numberOfLines={1}>
              {tagline}
            </Text>
          ) : null}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    borderRadius: 12,
  },
  textGroup: {
    marginLeft: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  tagline: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '500',
  },
});

export default BrandHeader;
