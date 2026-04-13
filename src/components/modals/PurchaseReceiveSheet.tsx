import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, ActivityIndicator, Alert } from 'react-native';
import { ThemeTokens } from '../../theme/tokens';
import { useThemeTokens } from '../../theme/ThemeProvider';
import Button from '../ui/Button';
import { X, PackagePlus } from 'lucide-react-native';

interface POReceiveItemInput {
  item_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  received_qty: number;
  already_received: number;
  unit_price: number;
  selling_price: number;
  mrp: number;
  batch_number: string;
  mfg_date: string;
  expiry_date: string;
  notes: string;
}

interface PurchaseReceiveSheetProps {
  visible: boolean;
  onClose: () => void;
  items: POReceiveItemInput[];
  onSubmit: (items: POReceiveItemInput[]) => Promise<void>;
  isLoading: boolean;
}

const PurchaseReceiveSheet: React.FC<PurchaseReceiveSheetProps> = ({
  visible,
  onClose,
  items,
  onSubmit,
  isLoading,
}) => {
  const { tokens } = useThemeTokens();
  const styles = useMemo(() => createStyles(tokens), [tokens]);
  const [formItems, setFormItems] = useState<POReceiveItemInput[]>(items);

  // Sync state when props change
  React.useEffect(() => {
    if (visible) {
      setFormItems(items.map(item => ({ ...item })));
    }
  }, [items, visible]);

  if (!visible) return null;

  const handleUpdateItem = (index: number, key: keyof POReceiveItemInput, value: any) => {
    const newItems = [...formItems];
    newItems[index] = { ...newItems[index], [key]: value };
    setFormItems(newItems);
  };

  const handleSubmit = async () => {
    // Basic validation
    const hasAnyQty = formItems.some(i => i.received_qty > 0);
    if (!hasAnyQty) {
      Alert.alert('Validation Error', 'Please receive at least one item.');
      return;
    }
    
    // Ensure numbers are numbers
    const cleaned = formItems.map(i => ({
      ...i,
      received_qty: Number(i.received_qty) || 0,
      unit_price: Number(i.unit_price) || 0,
      selling_price: Number(i.selling_price) || 0,
      mrp: Number(i.mrp) || 0,
    }));
    
    await onSubmit(cleaned);
  };

  const handleReceiveAll = () => {
    setFormItems(prev => prev.map(i => ({ ...i, received_qty: i.quantity - i.already_received })));
  };

  return (
    <View style={[StyleSheet.absoluteFill, styles.overlay]}>
      <View style={styles.sheet}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <PackagePlus size={20} color={tokens.primary} />
            <Text style={styles.title}>Receive Items</Text>
          </View>
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <X size={20} color={tokens.foreground} />
          </Pressable>
        </View>

        <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>Enter the quantities received to generate a Good Received Note (GRN) and update inventory.</Text>
          </View>

          {formItems.map((item, index) => (
            <View key={item.item_id} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemName}>{item.product_name}</Text>
                <View style={styles.qtyBadge}>
                  <Text style={styles.qtyText}>Order: {item.quantity} | Rcvd: {item.already_received}</Text>
                </View>
              </View>

              <View style={styles.inputGrid}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Receive Qty *</Text>
                  <TextInput
                    style={styles.input}
                    value={String(item.received_qty)}
                    onChangeText={(val) => handleUpdateItem(index, 'received_qty', val)}
                    keyboardType="numeric"
                    placeholder="0"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Batch # (Optional)</Text>
                  <TextInput
                    style={styles.input}
                    value={item.batch_number}
                    onChangeText={(val) => handleUpdateItem(index, 'batch_number', val)}
                    placeholder="BATCH123"
                  />
                </View>

                {/* Optional Dates row */}
                <View style={[styles.inputGroup, {flexDirection: 'row', gap: 8}]}>
                   <View style={{flex: 1}}>
                      <Text style={styles.inputLabel}>Mfg Date</Text>
                      <TextInput
                        style={styles.input}
                        value={item.mfg_date}
                        onChangeText={(val) => handleUpdateItem(index, 'mfg_date', val)}
                        placeholder="YYYY-MM-DD"
                      />
                   </View>
                   <View style={{flex: 1}}>
                      <Text style={styles.inputLabel}>Expiry</Text>
                      <TextInput
                        style={styles.input}
                        value={item.expiry_date}
                        onChangeText={(val) => handleUpdateItem(index, 'expiry_date', val)}
                        placeholder="YYYY-MM-DD"
                      />
                   </View>
                </View>
              </View>
            </View>
          ))}
          
        </ScrollView>

        <View style={styles.footer}>
           <Pressable onPress={handleReceiveAll} style={styles.receiveAllBtn}>
             <Text style={styles.receiveAllText}>Fill Max Qtys</Text>
           </Pressable>

          <View style={styles.actions}>
            <Button variant="secondary" label="Cancel" onPress={onClose} disabled={isLoading} style={{flex: 1, marginRight: 8}} />
            <Button label={isLoading ? 'Saving...' : 'Confirm'} onPress={handleSubmit} disabled={isLoading} style={{flex: 1}} />
          </View>
        </View>
      </View>
    </View>
  );
};

const createStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    overlay: {
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'flex-end',
      zIndex: 100,
    },
    sheet: {
      backgroundColor: tokens.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: '90%',
      minHeight: '50%',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: tokens.border,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      color: tokens.foreground,
      marginLeft: 8,
    },
    closeBtn: {
      padding: 4,
    },
    content: {
      padding: 16,
    },
    infoBox: {
      backgroundColor: tokens.card,
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: tokens.border,
      marginBottom: 16,
    },
    infoText: {
      color: tokens.mutedForeground,
      fontSize: 13,
      lineHeight: 18,
    },
    itemCard: {
      backgroundColor: tokens.card,
      borderWidth: 1,
      borderColor: tokens.border,
      borderRadius: 12,
      padding: 14,
      marginBottom: 16,
    },
    itemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    itemName: {
      fontSize: 15,
      fontWeight: '600',
      color: tokens.foreground,
      flex: 1,
    },
    qtyBadge: {
      backgroundColor: tokens.background,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: tokens.border,
    },
    qtyText: {
      fontSize: 12,
      color: tokens.mutedForeground,
      fontWeight: '600',
    },
    inputGrid: {
      gap: 12,
    },
    inputGroup: {},
    inputLabel: {
      fontSize: 12,
      color: tokens.mutedForeground,
      marginBottom: 4,
      fontWeight: '500',
    },
    input: {
      backgroundColor: tokens.background,
      borderWidth: 1,
      borderColor: tokens.border,
      borderRadius: 8,
      paddingHorizontal: 12,
      height: 40,
      color: tokens.foreground,
    },
    footer: {
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: tokens.border,
      backgroundColor: tokens.background,
    },
    receiveAllBtn: {
      alignSelf: 'center',
      marginBottom: 12,
    },
    receiveAllText: {
      color: tokens.primary,
      fontWeight: '600',
      textDecorationLine: 'underline',
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  });

export default PurchaseReceiveSheet;
