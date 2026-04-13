import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import ScreenWrapper from '../../components/ScreenWrapper';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useThemeTokens } from '../../theme/ThemeProvider';
import { ThemeTokens } from '../../theme/tokens';
import { Product } from '../../types/domain';

type StockAdjustRoute = RouteProp<
  {
    StockAdjust: {
      product: Product;
    };
  },
  'StockAdjust'
>;

type AdjustmentMode = 'increase' | 'decrease';

const ProductStockAdjustScreen: React.FC = () => {
  const { tokens } = useThemeTokens();
  const styles = React.useMemo(() => createStyles(tokens), [tokens]);
  const navigation = useNavigation();
  const route = useRoute<StockAdjustRoute>();
  const product = route.params?.product;

  const [mode, setMode] = React.useState<AdjustmentMode>('increase');
  const [quantity, setQuantity] = React.useState('1');
  const [referenceId, setReferenceId] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setSubmitting] = React.useState(false);

  const validate = React.useCallback(() => {
    const nextErrors: Record<string, string> = {};
    if (!quantity.trim()) nextErrors.quantity = 'Quantity is required';
    if (Number.isNaN(Number(quantity)) || Number(quantity) <= 0)
      nextErrors.quantity = 'Enter a positive number';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [quantity]);

  const handleSubmit = React.useCallback(() => {
    if (!validate()) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      Alert.alert(
        'Inventory updated',
        `${product?.name || 'Item'} marked for ${
          mode === 'increase' ? 'stock in' : 'stock out'
        }.`,
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    }, 400);
  }, [validate, navigation, product, mode]);

  const chips: { id: AdjustmentMode; label: string; helper: string }[] = [
    { id: 'increase', label: 'Add Stock', helper: 'Purchase / adjustment in' },
    { id: 'decrease', label: 'Remove Stock', helper: 'Sale / damage / audit' },
  ];

  return (
    /* OUT OF SCOPE FOR V1 — retained for future releases
    <ScreenWrapper>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Adjust Inventory</Text>
        <Text style={styles.subtitle}>
          Update physical counts so alerts, billing, and purchases stay accurate.
        </Text>

        <View style={styles.productCard}>
          <Text style={styles.productName}>{product?.name}</Text>
          <Text style={styles.productMeta}>
            SKU {product?.sku || 'NA'} · On hand {product?.stock_quantity ?? 0} {product?.unit}
          </Text>
        </View>

        <View style={styles.chipRow}>
          {chips.map(chip => {
            const active = mode === chip.id;
            return (
              <Pressable
                key={chip.id}
                onPress={() => setMode(chip.id)}
                style={[styles.modeChip, active && styles.modeChipActive]}
              >
                <Text
                  style={[styles.modeChipLabel, active && styles.modeChipLabelActive]}
                >
                  {chip.label}
                </Text>
                <Text style={styles.modeChipHelper}>{chip.helper}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.sectionCard}>
          <Input
            label="Quantity"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="number-pad"
            error={errors.quantity}
            placeholder="Enter units"
            containerStyle={styles.fieldSpacing}
          />
          <Input
            label="Reference / Bill ID"
            value={referenceId}
            onChangeText={setReferenceId}
            placeholder="PO123 / Audit note"
            containerStyle={styles.fieldSpacing}
          />
          <Input
            label="Internal notes"
            value={notes}
            onChangeText={setNotes}
            placeholder="Describe the adjustment"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.footerSpacing}>
          <Button
            label={mode === 'increase' ? 'Add to Stock' : 'Reduce Stock'}
            onPress={handleSubmit}
            loading={isSubmitting}
            fullWidth
          />
        </View>
      </ScrollView>
    </ScreenWrapper>
    */
    <ScreenWrapper>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: tokens.mutedForeground }}>
          Feature not available in V1
        </Text>
      </View>
    </ScreenWrapper>
  );
};

const createStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      padding: 20,
      paddingBottom: 80,
    },
    title: {
      fontSize: 26,
      fontWeight: '700',
      color: tokens.foreground,
    },
    subtitle: {
      color: tokens.mutedForeground,
      marginTop: 6,
      marginBottom: 16,
    },
    productCard: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: tokens.border,
      backgroundColor: tokens.card,
      padding: 16,
      marginBottom: 18,
    },
    productName: {
      fontSize: 18,
      fontWeight: '700',
      color: tokens.foreground,
    },
    productMeta: {
      marginTop: 4,
      color: tokens.mutedForeground,
    },
    chipRow: {
      flexDirection: 'row',
      marginBottom: 18,
    },
    modeChip: {
      flex: 1,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: tokens.border,
      padding: 14,
      marginRight: 12,
      backgroundColor: tokens.card,
    },
    modeChipActive: {
      backgroundColor: tokens.primary,
      borderColor: tokens.primary,
    },
    modeChipLabel: {
      fontSize: 15,
      fontWeight: '700',
      color: tokens.primary,
    },
    modeChipLabelActive: {
      color: tokens.primaryForeground,
    },
    modeChipHelper: {
      marginTop: 6,
      color: tokens.mutedForeground,
      fontSize: 12,
    },
    sectionCard: {
      borderRadius: 20,
      borderWidth: 1,
      borderColor: tokens.border,
      backgroundColor: tokens.card,
      padding: 18,
      marginBottom: 16,
    },
    fieldSpacing: {
      marginBottom: 12,
    },
    footerSpacing: {
      marginTop: 12,
    },
  });

export default ProductStockAdjustScreen;
