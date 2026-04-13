import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import ActionSheet from './ActionSheet';
import { useThemeTokens } from '../../theme/ThemeProvider';
import { ThemeTokens } from '../../theme/tokens';
import { ChevronRight, EyeOff, Tag, Box } from 'lucide-react-native';

type ProductOptionsSheetProps = {
  visible: boolean;
  onClose: () => void;
  onSelectOption: (optionId: string) => void;
  showInactive?: boolean;
  onToggleShowInactive?: (value: boolean) => void;
};

const ProductOptionsSheet: React.FC<ProductOptionsSheetProps> = ({
  visible,
  onClose,
  onSelectOption,
  showInactive: showInactiveProp = false,
  onToggleShowInactive,
}) => {
  const { tokens } = useThemeTokens();
  const styles = React.useMemo(() => createStyles(tokens), [tokens]);
  const [showInactive, setShowInactive] = useState(showInactiveProp);

  const handleSelect = (id: string) => {
    onSelectOption(id);
    onClose();
  };

  return (
    <ActionSheet visible={visible} onClose={onClose} title="More Options">
      <View style={styles.container}>

        <Pressable
          style={styles.row}
          onPress={() => {
            const newValue = !showInactive;
            setShowInactive(newValue);
            onToggleShowInactive?.(newValue);
          }}
        >
          <Text style={styles.label}>Show Inactive</Text>
          <View style={[styles.checkbox, showInactive && styles.checked]} />
        </Pressable>

        <View style={styles.divider} />

        <Pressable style={styles.row} onPress={() => handleSelect('units')}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Box size={18} color={tokens.mutedForeground} />
            <Text style={styles.label}>Units</Text>
          </View>
          <ChevronRight size={20} color={tokens.mutedForeground} />
        </Pressable>
        <Pressable
          style={styles.row}
          onPress={() => handleSelect('categories')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Tag size={18} color={tokens.mutedForeground} />
            <Text style={styles.label}>Categories</Text>
          </View>
          <ChevronRight size={20} color={tokens.mutedForeground} />
        </Pressable>
      </View>
    </ActionSheet>
  );
};

const createStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingBottom: 24,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 16,
    },
    label: {
      fontSize: 16,
      color: tokens.foreground,
      fontWeight: '500',
    },
    divider: {
      height: 1,
      backgroundColor: tokens.border,
      marginVertical: 4,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: tokens.mutedForeground,
    },
    checked: {
      backgroundColor: tokens.primary,
      borderColor: tokens.primary,
    },
  });

export default ProductOptionsSheet;
