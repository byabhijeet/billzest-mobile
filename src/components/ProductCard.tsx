import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Product } from '../types/domain';
import { useThemeTokens } from '../theme/ThemeProvider';
import { ThemeTokens } from '../theme/tokens';

export type ProductStatus =
  | 'in-stock'
  | 'low-stock'
  | 'out-of-stock'
  | 'near-expiry';

export const getProductStatus = (product: Product): ProductStatus => {
  if (product.stock_quantity <= 0) return 'out-of-stock';
  const threshold = (product as any).low_stock_threshold ?? 10;
  if (product.stock_quantity < threshold) return 'low-stock';

  if (product.expiry_date) {
    const expiry = new Date(product.expiry_date);
    const now = new Date();
    const daysToExpiry = Math.ceil(
      (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (daysToExpiry > 0 && daysToExpiry <= 30) return 'near-expiry';
  }

  return 'in-stock';
};

const getStatusVisual = (status: ProductStatus, tokens: ThemeTokens) => {
  switch (status) {
    case 'low-stock':
      return { label: 'Low Stock', bgColor: 'rgba(168,53,62,0.1)', color: tokens.destructive };
    case 'out-of-stock':
      return { label: 'Out of Stock', bgColor: 'rgba(220,76,70,0.12)', color: tokens.destructive };
    case 'near-expiry':
      return { label: 'Near Expiry', bgColor: 'rgba(250,204,21,0.18)', color: tokens.warning };
    default:
      return { label: 'In Stock', bgColor: 'rgba(29,185,84,0.12)', color: tokens.primary };
  }
};

const formatCurrency = (value: number) =>
  `₹ ${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  onShare?: () => void;
  onPrint?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onShare,
  onPrint,
}) => {
  const { tokens } = useThemeTokens();
  const styles = React.useMemo(() => createStyles(tokens), [tokens]);
  const status = getProductStatus(product);
  const statusVisual = getStatusVisual(status, tokens);
  const categoryName = (product as any).categories?.name || (product as any).category || null;
  const skuMeta = [product.sku, categoryName].filter(Boolean).join(' · ');

  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      accessibilityRole="button"
      accessibilityLabel={`View details for ${product.name}`}
      onPress={onPress}
    >
      <View style={styles.topRow}>
        <Text style={styles.productName} numberOfLines={1} ellipsizeMode="tail">
          {product.name}
        </Text>
        <View style={styles.stockBlock}>
          <Text style={[styles.stockCount, { color: statusVisual.color }]}>
            {`Stock: ${product.stock_quantity}`}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: statusVisual.bgColor }]}>
            <Text style={[styles.statusBadgeText, { color: statusVisual.color }]}>
              {statusVisual.label.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.bottomRow}>
        <Text style={styles.price}>{formatCurrency(product.selling_price)}</Text>
        {skuMeta ? (
          <Text style={styles.skuMeta} numberOfLines={1}>{skuMeta}</Text>
        ) : null}
      </View>
    </Pressable>
  );
};

const createStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    row: {
      backgroundColor: tokens.surface_container_lowest,
      paddingHorizontal: 20,
      paddingVertical: 12,
      gap: 4,
    },
    rowPressed: {
      backgroundColor: tokens.muted,
    },
    topRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: 8,
    },
    productName: {
      flex: 1,
      fontSize: 15,
      fontWeight: '700',
      color: tokens.foreground,
      letterSpacing: -0.2,
    },
    stockBlock: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      flexShrink: 0,
    },
    stockCount: {
      fontSize: 12,
      fontWeight: '600',
    },
    statusBadge: {
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
    },
    statusBadgeText: {
      fontSize: 9,
      fontWeight: '700',
      letterSpacing: 0.4,
    },
    bottomRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    price: {
      fontSize: 14,
      fontWeight: '800',
      color: tokens.primary,
    },
    skuMeta: {
      fontSize: 11,
      color: tokens.mutedForeground,
      fontWeight: '500',
      flexShrink: 1,
      textAlign: 'right',
    },
  });

export default React.memo(ProductCard);
