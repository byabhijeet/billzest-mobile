import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import ActionSheet from './ActionSheet';
import SearchBar from '../SearchBar';
import { useThemeTokens } from '../../theme/ThemeProvider';
import { ThemeTokens } from '../../theme/tokens';
import { Product } from '../../types/domain';
import { useProducts } from '../../logic/productLogic';
import { Plus, Minus } from 'lucide-react-native';
import { InvoiceLineItem } from '../../stores/invoiceStore';

// Generic type for items that have product and quantity
type ItemWithProduct = {
  product?: Product;
  productId?: string;
  quantity: number | string;
};

type ItemSelectionSheetProps = {
  visible: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onUpdateQuantity?: (productId: string, delta: number) => void; // For adjusting quantity
  currentLineItems?: InvoiceLineItem[]; // For invoice items
  currentItems?: ItemWithProduct[]; // For purchase items or other formats
};

const ItemSelectionSheet: React.FC<ItemSelectionSheetProps> = ({
  visible,
  onClose,
  onSelectProduct,
  onUpdateQuantity,
  currentLineItems = [],
  currentItems = [],
}) => {
  const { tokens } = useThemeTokens();
  const styles = React.useMemo(() => createStyles(tokens), [tokens]);
  const { data: products = [] } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  // Calculate current quantities for each product in the bill
  const productQuantities = useMemo(() => {
    const quantities: Record<string, number> = {};

    // Handle InvoiceLineItem format (from invoice store)
    currentLineItems.forEach(item => {
      const productId = item.product.id;
      quantities[productId] = (quantities[productId] || 0) + item.quantity;
    });

    // Handle generic items format (from purchase screen)
    currentItems.forEach(item => {
      const productId = item.product?.id || item.productId;
      if (productId) {
        const qty =
          typeof item.quantity === 'string'
            ? parseFloat(item.quantity) || 0
            : item.quantity;
        quantities[productId] = (quantities[productId] || 0) + qty;
      }
    });

    return quantities;
  }, [currentLineItems, currentItems]);

  const handleQuantityChange = (product: Product, delta: number) => {
    if (onUpdateQuantity) {
      onUpdateQuantity(product.id, delta);
    } else {
      // Fallback: if no update handler, just add the product
      if (delta > 0) {
        onSelectProduct(product);
      }
    }
  };

  const filteredProducts = products.filter(
    p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const handleSelect = (product: Product) => {
    onSelectProduct(product);

    // Feedback animation logic
    setAddedItems(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const renderItem = ({ item }: { item: Product }) => {
    const currentQty = productQuantities[item.id] || 0;
    const hasInBill = currentQty > 0;

    return (
      <View style={styles.itemRow}>
        {/* Product Info on Left */}
        <Pressable
          style={styles.itemInfo}
          onPress={() => !hasInBill && handleSelect(item)}
        >
          <Text style={styles.itemName}>{item.name}</Text>
          <View style={styles.itemMetaRow}>
            <Text style={styles.itemMeta}>
              {item.sku ? `SKU: ${item.sku} • ` : ''}Stock:{' '}
              {item.stock_quantity ?? 0}
            </Text>
            <Text style={styles.itemPrice}>₹{item.selling_price}</Text>
          </View>
        </Pressable>

        {/* Quantity Selector on Right */}
        <View style={styles.quantitySelector}>
          {hasInBill ? (
            <>
              <Pressable
                style={styles.quantityButtonMinus}
                onPress={() => handleQuantityChange(item, -1)}
              >
                <Minus
                  color={tokens.destructiveForeground}
                  size={18}
                  strokeWidth={2.5}
                />
              </Pressable>
              <View style={styles.quantityDisplay}>
                <Text style={styles.quantityDisplayText}>{currentQty}</Text>
              </View>
              <Pressable
                style={styles.quantityButtonPlus}
                onPress={() => handleQuantityChange(item, 1)}
              >
                <Plus
                  color={tokens.primaryForeground}
                  size={18}
                  strokeWidth={2.5}
                />
              </Pressable>
            </>
          ) : (
            <Pressable
              style={[
                styles.quantityButtonPlus,
                addedItems[item.id] && styles.addedButton,
              ]}
              onPress={() => handleSelect(item)}
            >
              {addedItems[item.id] ? (
                <Text
                  style={{
                    color: tokens.primaryForeground,
                    fontSize: 16,
                    fontWeight: '700',
                  }}
                >
                  ✓
                </Text>
              ) : (
                <Plus
                  color={tokens.primaryForeground}
                  size={20}
                  strokeWidth={2.5}
                />
              )}
            </Pressable>
          )}
        </View>
      </View>
    );
  };

  return (
    <ActionSheet
      visible={visible}
      onClose={onClose}
      title="Add Item"
      subtitle="Select products to add to this invoice"
      scrollable={false}
      footer={
        <Pressable style={styles.doneButton} onPress={onClose}>
          <Text style={styles.doneButtonText}>Done</Text>
        </Pressable>
      }
    >
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="Search products..."
            autoFocus
          />
        </View>
        <FlatList
          style={styles.listContainer}
          data={filteredProducts}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No products found</Text>
          }
        />
      </View>
    </ActionSheet>
  );
};

const createStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    container: {
      height: 420,
    },
    searchContainer: {
      paddingBottom: 12,
    },
    listContainer: {
      flex: 1,
    },
    listContent: {
      paddingBottom: 8,
    },
    itemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: tokens.border,
      gap: 16,
      minHeight: 72,
    },
    quantitySelector: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 10,
      overflow: 'hidden',
      borderWidth: 1.5,
      borderColor: tokens.border,
      height: 40,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    quantityButtonMinus: {
      backgroundColor: tokens.destructive,
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    quantityDisplay: {
      backgroundColor: tokens.card,
      minWidth: 48,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 12,
      borderLeftWidth: 1.5,
      borderRightWidth: 1.5,
      borderColor: tokens.border,
    },
    quantityDisplayText: {
      fontSize: 16,
      fontWeight: '700',
      color: tokens.foreground,
    },
    quantityButtonPlus: {
      backgroundColor: tokens.primary,
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemInfo: {
      flex: 1,
      justifyContent: 'center',
      paddingRight: 8,
    },
    itemName: {
      fontSize: 16,
      fontWeight: '600',
      color: tokens.foreground,
      marginBottom: 6,
      lineHeight: 20,
    },
    itemMetaRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 12,
    },
    itemMeta: {
      fontSize: 13,
      color: tokens.mutedForeground,
      flex: 1,
    },
    itemPrice: {
      fontSize: 16,
      fontWeight: '700',
      color: tokens.foreground,
    },
    addedButton: {
      backgroundColor: tokens.success || tokens.accent,
    },
    doneButton: {
      backgroundColor: tokens.primary,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
    doneButtonText: {
      color: tokens.primaryForeground,
      fontSize: 16,
      fontWeight: '700',
    },
    emptyText: {
      textAlign: 'center',
      color: tokens.mutedForeground,
      marginTop: 20,
    },
  });

export default ItemSelectionSheet;
