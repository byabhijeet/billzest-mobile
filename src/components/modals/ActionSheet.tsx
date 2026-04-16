import React, { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { useThemeTokens } from '../../theme/ThemeProvider';
import { ThemeTokens } from '../../theme/tokens';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SPRING_CONFIG = { damping: 28, stiffness: 300, mass: 0.8 };
const TIMING_CONFIG = { duration: 220 };

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
  const styles = React.useMemo(() => createStyles(tokens), [tokens]);

  const [modalVisible, setModalVisible] = useState(false);
  const backdropOpacity = useSharedValue(0);
  const translateY = useSharedValue(SCREEN_HEIGHT);

  const openSheet = () => {
    setModalVisible(true);
    backdropOpacity.value = withTiming(1, TIMING_CONFIG);
    translateY.value = withSpring(0, SPRING_CONFIG);
  };

  const closeSheet = () => {
    backdropOpacity.value = withTiming(0, TIMING_CONFIG);
    translateY.value = withTiming(SCREEN_HEIGHT, TIMING_CONFIG, (finished) => {
      if (finished) {
        runOnJS(setModalVisible)(false);
        runOnJS(onClose)();
      }
    });
  };

  useEffect(() => {
    if (visible) {
      openSheet();
    } else if (modalVisible) {
      closeSheet();
    }
  }, [visible]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

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
    return <View style={styles.nonScrollableContent}>{children}</View>;
  };

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="none"
      onRequestClose={closeSheet}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.backdropBase, backdropStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closeSheet} />
        </Animated.View>
        <Animated.View style={[styles.sheet, sheetStyle]}>
          {/* ── Fixed header ── */}
          <View style={styles.header}>
            <View style={styles.handle} />
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            <View style={styles.divider} />
          </View>

          {/* ── Scrollable body — grows to fill available space ── */}
          {renderContent()}

          {/* ── Pinned footer — always visible, never overflows ── */}
          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </Animated.View>
      </View>
    </Modal>
  );
};

const createStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    backdropBase: {
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    sheet: {
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      backgroundColor: tokens.card,
      maxHeight: '85%',
      flexDirection: 'column',
      shadowColor: tokens.shadowColor ?? '#000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.1,
      shadowRadius: 20,
      elevation: 16,
      overflow: 'hidden',
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 12,
    },
    handle: {
      alignSelf: 'center',
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: tokens.border,
      marginBottom: 14,
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
      height: StyleSheet.hairlineWidth,
      backgroundColor: tokens.border,
      marginTop: 14,
      marginBottom: 0,
      opacity: 0.5,
    },
    scroll: {
      flexShrink: 1,
    },
    nonScrollableContent: {
      flexShrink: 1,
      paddingHorizontal: 20,
      paddingTop: 16,
    },
    content: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 8,
    },
    footer: {
      marginTop: 4,
    },
  });

export default ActionSheet;
