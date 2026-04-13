import React from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import {
  ImagePlus,
  Tag,
  CircleDollarSign,
  Boxes,
  Barcode,
  Layers,
  ShieldCheck,
} from 'lucide-react-native';
import ActionSheet from './ActionSheet';
import { useThemeTokens } from '../../theme/ThemeProvider';
import { ThemeTokens } from '../../theme/tokens';

type AddProductSheetProps = {
  visible: boolean;
  onClose: () => void;
};

type ProductFormState = {
  name: string;
  salePrice: string;
  stock: string;
  sku: string;
};

const AddProductSheet: React.FC<AddProductSheetProps> = ({ visible, onClose }) => {
  const { tokens } = useThemeTokens();
  const styles = React.useMemo(() => createStyles(tokens), [tokens]);
  const [formState, setFormState] = React.useState<ProductFormState>({
    name: '',
    salePrice: '',
    stock: '',
    sku: '',
  });

  const handleChange = React.useCallback(
    (field: keyof ProductFormState, value: string) => {
      setFormState(prev => ({ ...prev, [field]: value }));
    },
    [],
  );

  return (
    <ActionSheet
      visible={visible}
      onClose={onClose}
      title="Add New Item"
      subtitle="Upload an image, price, and inventory so it is ready to bill or sync to store."
      footer={
        <View style={styles.footerButtons}>
          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Save Draft</Text>
          </Pressable>
          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Add Item</Text>
          </Pressable>
        </View>
      }
    >
      <Pressable style={styles.imageUpload}>
        <ImagePlus color={tokens.primary} size={24} />
        <View style={styles.imageCopy}>
          <Text style={styles.imageTitle}>Product Image</Text>
          <Text style={styles.imageSubtitle}>Tap to upload · JPG or PNG up to 3 MB</Text>
        </View>
      </Pressable>

      <View style={styles.formCard}>
        <View style={styles.inputRow}>
          <Tag color={tokens.primary} size={18} />
          <View style={styles.copyBlock}>
            <Text style={styles.inputLabel}>Item Name</Text>
            <TextInput
              style={styles.textInput}
              value={formState.name}
              onChangeText={value => handleChange('name', value)}
              placeholder="E.g. Classic Leather Wallet"
              placeholderTextColor={tokens.mutedForeground}
              autoCapitalize="words"
              autoCorrect={false}
              accessibilityLabel="Item name"
              returnKeyType="next"
            />
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.inputRow}>
          <CircleDollarSign color={tokens.primary} size={18} />
          <View style={styles.copyBlock}>
            <Text style={styles.inputLabel}>Sale Price</Text>
            <TextInput
              style={styles.textInput}
              value={formState.salePrice}
              onChangeText={value => handleChange('salePrice', value)}
              placeholder="₹0.00"
              placeholderTextColor={tokens.mutedForeground}
              keyboardType="decimal-pad"
              autoCorrect={false}
              accessibilityLabel="Sale price"
              returnKeyType="next"
            />
          </View>
          <Text style={styles.trailingBadge}>Incl. GST</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.inputRow}>
          <Boxes color={tokens.primary} size={18} />
          <View style={styles.copyBlock}>
            <Text style={styles.inputLabel}>Opening Stock</Text>
            <TextInput
              style={styles.textInput}
              value={formState.stock}
              onChangeText={value => handleChange('stock', value)}
              placeholder="Enter closing stock"
              placeholderTextColor={tokens.mutedForeground}
              keyboardType="number-pad"
              autoCorrect={false}
              accessibilityLabel="Opening stock"
              returnKeyType="next"
            />
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.inputRow}>
          <Barcode color={tokens.primary} size={18} />
          <View style={styles.copyBlock}>
            <Text style={styles.inputLabel}>SKU / Item Code</Text>
            <TextInput
              style={styles.textInput}
              value={formState.sku}
              onChangeText={value => handleChange('sku', value)}
              placeholder="Auto-generate code"
              placeholderTextColor={tokens.mutedForeground}
              autoCapitalize="characters"
              autoCorrect={false}
              accessibilityLabel="SKU or item code"
              returnKeyType="done"
            />
          </View>
        </View>
      </View>

      <View style={styles.quickSettings}>
        <Text style={styles.quickSettingsTitle}>Quick Settings</Text>
        <View style={styles.quickSettingRow}>
          <Layers color={tokens.primary} size={18} />
          <View style={styles.quickCopy}>
            <Text style={styles.quickLabel}>Track batches & expiry</Text>
            <Text style={styles.quickValue}>Disabled</Text>
          </View>
        </View>
        <View style={styles.quickSettingRow}>
          <ShieldCheck color={tokens.primary} size={18} />
          <View style={styles.quickCopy}>
            <Text style={styles.quickLabel}>Tax & compliance</Text>
            <Text style={styles.quickValue}>GST @ 18%</Text>
          </View>
          <Pressable>
            <Text style={styles.linkText}>Edit</Text>
          </Pressable>
        </View>
      </View>
    </ActionSheet>
  );
};

const createStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    imageUpload: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: tokens.border,
      backgroundColor: tokens.background,
      flexDirection: 'row',
      alignItems: 'center',
      padding: 14,
      marginBottom: 16,
    },
    imageCopy: {
      marginLeft: 12,
    },
    imageTitle: {
      color: tokens.foreground,
      fontWeight: '600',
      marginBottom: 4,
    },
    imageSubtitle: {
      color: tokens.mutedForeground,
      fontSize: 12,
    },
    formCard: {
      borderRadius: 20,
      borderWidth: 1,
      borderColor: tokens.border,
      backgroundColor: tokens.card,
      paddingHorizontal: 16,
      paddingVertical: 10,
      marginBottom: 16,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
    },
    copyBlock: {
      flex: 1,
      marginLeft: 12,
    },
    inputLabel: {
      color: tokens.mutedForeground,
      fontSize: 12,
      marginBottom: 4,
    },
    divider: {
      height: 1,
      backgroundColor: tokens.border,
    },
    trailingBadge: {
      borderRadius: 999,
      borderWidth: 1,
      borderColor: tokens.border,
      paddingHorizontal: 10,
      paddingVertical: 4,
      fontSize: 11,
      color: tokens.foreground,
      fontWeight: '600',
    },
    textInput: {
      borderRadius: 12,
      borderWidth: 1,
      borderColor: tokens.border,
      paddingHorizontal: 12,
      paddingVertical: 8,
      color: tokens.foreground,
      fontWeight: '600',
      backgroundColor: tokens.background,
      fontSize: 14,
      marginTop: 4,
    },
    quickSettings: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: tokens.border,
      backgroundColor: tokens.card,
      padding: 16,
      marginBottom: 12,
    },
    quickSettingsTitle: {
      color: tokens.foreground,
      fontWeight: '700',
      marginBottom: 10,
    },
    quickSettingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 6,
    },
    quickCopy: {
      flex: 1,
      marginLeft: 12,
    },
    quickLabel: {
      color: tokens.mutedForeground,
      fontSize: 12,
    },
    quickValue: {
      color: tokens.foreground,
      fontWeight: '600',
      marginTop: 2,
    },
    linkText: {
      color: tokens.primary,
      fontWeight: '600',
      fontSize: 12,
    },
    footerButtons: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    secondaryButton: {
      flex: 1,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: tokens.border,
      paddingVertical: 12,
      marginRight: 12,
      alignItems: 'center',
    },
    secondaryButtonText: {
      color: tokens.foreground,
      fontWeight: '600',
    },
    primaryButton: {
      flex: 1,
      borderRadius: 999,
      backgroundColor: tokens.primary,
      paddingVertical: 12,
      alignItems: 'center',
    },
    primaryButtonText: {
      color: tokens.primaryForeground,
      fontWeight: '700',
    },
  });

export default AddProductSheet;
