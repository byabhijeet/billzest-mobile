import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { useThemeTokens } from '../../theme/ThemeProvider';
import { ThemeTokens } from '../../theme/tokens';
import ActionSheet from './ActionSheet';

type QuantityEditSheetProps = {
  visible: boolean;
  initialQuantity: number;
  itemName: string;
  onClose: () => void;
  onUpdate: (newQuantity: number) => void;
};

const QuantityEditSheet: React.FC<QuantityEditSheetProps> = ({
  visible,
  initialQuantity,
  itemName,
  onClose,
  onUpdate,
}) => {
  const { tokens } = useThemeTokens();
  const styles = React.useMemo(() => createStyles(tokens), [tokens]);
  const [quantityStr, setQuantityStr] = useState(initialQuantity.toString());

  useEffect(() => {
    if (visible) {
      setQuantityStr(initialQuantity.toString());
    }
  }, [visible, initialQuantity]);

  const handleSave = () => {
    const qty = parseInt(quantityStr, 10);
    if (!isNaN(qty) && qty > 0) {
      onUpdate(qty);
      onClose();
    } else {
      // Simple error handling or just close
      onClose();
    }
  };

  return (
    <ActionSheet
      visible={visible}
      onClose={onClose}
      title="Edit Quantity"
      subtitle={`For: ${itemName}`}
    >
      <View style={styles.container}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={quantityStr}
            onChangeText={setQuantityStr}
            keyboardType="number-pad"
            autoFocus={visible}
            selectTextOnFocus
            textAlign="center"
          />
        </View>

        <Pressable style={styles.updateBtn} onPress={handleSave}>
          <Text style={styles.updateBtnText}>Update Quantity</Text>
        </Pressable>
      </View>
    </ActionSheet>
  );
};

const createStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    container: {
      paddingBottom: 40,
      paddingHorizontal: 16,
    },
    inputWrapper: {
      borderBottomWidth: 2,
      borderBottomColor: tokens.primary,
      marginBottom: 24,
      marginHorizontal: 40,
    },
    input: {
      fontSize: 48,
      fontWeight: '700',
      color: tokens.foreground,
      paddingVertical: 12,
    },
    updateBtn: {
      backgroundColor: tokens.primary,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
    },
    updateBtnText: {
      color: tokens.primaryForeground,
      fontWeight: '700',
      fontSize: 16,
    },
  });

export default QuantityEditSheet;
