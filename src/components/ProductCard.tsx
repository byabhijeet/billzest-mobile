import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Share2, Printer } from 'lucide-react-native';
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
  // Use low_stock_threshold if available, otherwise default to 10
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
      return {
        label: 'Low Stock',
        backgroundColor: 'rgba(254,176,77,0.18)',
        color: tokens.warning,
      };
    case 'out-of-stock':
      return {
        label: 'Out of Stock',
        backgroundColor: 'rgba(220,76,70,0.2)',
        color: tokens.destructive,
      };
    case 'near-expiry':
      return {
        label: 'Near Expiry',
        backgroundColor: 'rgba(250,204,21,0.18)',
        color: tokens.warning,
      };
    default:
      return {
        label: 'In Stock',
        backgroundColor: 'rgba(34,197,94,0.2)',
        color: tokens.accent,
      };
  }
};

const formatCurrency = (value: number) => `₹${value.toFixed(2)}`;

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  onShare?: () => void;
  onPrint?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onShare = () => {},
  onPrint = () => {},
}) => {
  const { tokens } = useThemeTokens();
  const styles = React.useMemo(() => createStyles(tokens), [tokens]);
  const status = getProductStatus(product);
  const statusVisual = getStatusVisual(status, tokens);
  const stockColor =
    product.stock_quantity <= 0 ? tokens.destructive : tokens.accent;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      accessibilityRole="button"
      accessibilityLabel={`View details for ${product.name}`}
      onPress={onPress}
    >
      <View style={styles.cardHeader}>
        <View style={styles.titleBlock}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productMeta}>{product.sku || 'No SKU'}</Text>
        </View>
        <View
          style={[
            styles.statusChip,
            { backgroundColor: statusVisual.backgroundColor },
          ]}
        >
          <Text style={[styles.statusChipText, { color: statusVisual.color }]}>
            {statusVisual.label}
          </Text>
        </View>
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.detailBlock}>
          <Text style={styles.detailLabel}>Sale Price</Text>
          <Text style={styles.detailValue}>
            {formatCurrency(product.selling_price)}
          </Text>
        </View>
        <View style={styles.detailBlock}>
          <Text style={styles.detailLabel}>Purchase Price</Text>
          <Text style={styles.detailValue}>
            {product.purchase_price
              ? formatCurrency(product.purchase_price)
              : '-'}
          </Text>
        </View>
        <View style={styles.detailBlock}>
          <Text style={styles.detailLabel}>In Stock</Text>
          <Text style={[styles.detailValue, { color: stockColor }]}>
            {product.stock_quantity}
          </Text>
        </View>
      </View>

      {/* Inventory Cost Display */}
      {!!product.purchase_price && product.stock_quantity > 0 && (
        <View style={styles.inventoryCostRow}>
          <Text style={styles.inventoryCostLabel}>Inventory Cost</Text>
          <Text style={styles.inventoryCostValue}>
            {formatCurrency(product.purchase_price * product.stock_quantity)}
          </Text>
        </View>
      )}

      <View style={styles.footerRow}>
        <View>
          <Text style={styles.footerLabel}>Category</Text>
          <Text style={styles.footerValue}>
            {(product as any).categories?.name || '-'}
          </Text>
        </View>
        <View>
          <Text style={styles.footerLabel}>Expiry</Text>
          <Text style={styles.footerValue}>
            {product.expiry_date
              ? new Date(product.expiry_date).toLocaleDateString()
              : '-'}
          </Text>
        </View>
        <View style={styles.footerActions}>
          <Pressable
            style={styles.cardIconButton}
            accessibilityRole="button"
            accessibilityLabel={`Share ${product.name}`}
            onPress={onShare}
          >
            <Share2 color={tokens.foreground} size={16} />
          </Pressable>
          <Pressable
            style={styles.cardIconButton}
            accessibilityRole="button"
            accessibilityLabel={`Print ${product.name}`}
            onPress={onPrint}
          >
            <Printer color={tokens.foreground} size={16} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

const createStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    card: {
      backgroundColor: tokens.card,
      borderRadius: 20,
      padding: 16,
      borderWidth: 1,
      borderColor: tokens.border,
      marginBottom: 16,
    },
    cardPressed: {
      opacity: 0.95,
      transform: [{ scale: 0.99 }],
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 14,
    },
    titleBlock: {
      flex: 1,
      paddingRight: 12,
    },
    productName: {
      fontSize: 16,
      color: tokens.foreground,
      fontWeight: '700',
    },
    productMeta: {
      fontSize: 12,
      color: tokens.mutedForeground,
      marginTop: 4,
    },
    statusChip: {
      borderRadius: 999,
      paddingHorizontal: 14,
      paddingVertical: 6,
    },
    statusChipText: {
      fontWeight: '700',
      fontSize: 12,
    },
    detailsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 14,
    },
    detailBlock: {
      flex: 1,
      paddingRight: 10,
    },
    detailLabel: {
      fontSize: 12,
      color: tokens.mutedForeground,
      marginBottom: 4,
    },
    detailValue: {
      fontSize: 16,
      fontWeight: '700',
      color: tokens.foreground,
    },
    footerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    footerLabel: {
      fontSize: 12,
      color: tokens.mutedForeground,
      marginBottom: 4,
    },
    footerValue: {
      fontSize: 13,
      color: tokens.foreground,
      fontWeight: '600',
    },
    footerActions: {
      flexDirection: 'row',
      marginLeft: -8,
    },
    cardIconButton: {
      borderRadius: 999,
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderWidth: 1,
      borderColor: tokens.border,
      marginLeft: 8,
    },
    inventoryCostRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 8,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: tokens.border,
    },
    inventoryCostLabel: {
      fontSize: 13,
      color: tokens.mutedForeground,
      fontWeight: '600',
    },
    inventoryCostValue: {
      fontSize: 16,
      color: tokens.foreground,
      fontWeight: '700',
    },
  });

export default React.memo(ProductCard);
