import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  Text,
  ScrollView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeTokens } from '../../theme/ThemeProvider';
import { ThemeTokens } from '../../theme/tokens';

type ActionSheetProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  scrollable?: boolean;
};

const ActionSheet: React.FC<ActionSheetProps> = ({
  visible,
  onClose,
  title,
  subtitle,
  children,
  footer,
  scrollable = true,
}) => {
  const { tokens } = useThemeTokens();
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => createStyles(tokens, insets), [tokens, insets]);

  const renderContent = () => {
    if (scrollable) {
      return (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      );
    }
    return <View style={[styles.scroll, styles.nonScrollableContent]}>{children}</View>;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheetContainer}>
          <View style={styles.sheet}>
            <View style={styles.handle} />
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            <View style={styles.divider} />
            {renderContent()}
            {footer ? <View style={styles.footer}>{footer}</View> : null}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (tokens: ThemeTokens, insets: { bottom: number }) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
    },
    sheetContainer: {
      paddingHorizontal: 16,
      paddingBottom: Math.max(insets.bottom, 24),
    },
    sheet: {
      borderRadius: 24,
      backgroundColor: tokens.card,
      borderWidth: 1,
      borderColor: tokens.border,
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 8,
      maxHeight: 600,
    },
    handle: {
      alignSelf: 'center',
      width: 48,
      height: 4,
      borderRadius: 2,
      backgroundColor: tokens.border,
      marginBottom: 12,
    },
    title: {
      color: tokens.foreground,
      fontSize: 18,
      fontWeight: '700',
    },
    subtitle: {
      color: tokens.mutedForeground,
      marginTop: 6,
    },
    divider: {
      height: 1,
      backgroundColor: tokens.border,
      marginTop: 14,
      marginBottom: 12,
    },
    scroll: {
      maxHeight: 450,
    },
    nonScrollableContent: {
      overflow: 'hidden',
    },
    content: {
      paddingBottom: 16,
    },
    footer: {
      borderTopWidth: 1,
      borderTopColor: tokens.border,
      paddingTop: 12,
      paddingBottom: Math.max(insets.bottom, 12),
      marginTop: 8,
    },
  });

export default ActionSheet;
