import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Pressable } from 'react-native';
import { useThemeTokens } from '../theme/ThemeProvider';
import { ThemeTokens } from '../theme/tokens';
import { WifiOff, Wifi, AlertCircle, RefreshCw } from 'lucide-react-native';
import { useOfflineSync } from '../hooks/useOfflineSync';

const OfflineIndicator: React.FC = () => {
  const { tokens } = useThemeTokens();
  const styles = React.useMemo(() => createStyles(tokens), [tokens]);
  const {
    isSyncing,
    performSync,
    getPendingCount,
    getFailedCount,
    isOnline: checkOnline,
  } = useOfflineSync();
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [slideAnim] = useState(new Animated.Value(-100));

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    const checkStatus = async () => {
      const online = await checkOnline();
      const pending = await getPendingCount();
      const failed = await getFailedCount();

      setIsOnline(online);
      setPendingCount(pending);
      setFailedCount(failed);

      // Animate slide in/out based on status
      if (!online || pending > 0 || failed > 0) {
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
        }).start();
      } else {
        Animated.spring(slideAnim, {
          toValue: -100,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
        }).start();
      }
    };

    // Check immediately
    checkStatus();

    // Check every 5 seconds
    interval = setInterval(checkStatus, 5000);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [slideAnim, checkOnline, getPendingCount, getFailedCount]);

  // Don't render if online and no pending/failed mutations
  if (isOnline && pendingCount === 0 && failedCount === 0) {
    return null;
  }

  const handleRetry = async () => {
    if (!isSyncing) {
      await performSync();
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.content}>
        {!isOnline ? (
          <>
            <WifiOff size={16} color={tokens.primaryForeground} />
            <Text style={styles.text}>
              You&apos;re offline. Changes will sync when connected.
            </Text>
          </>
        ) : failedCount > 0 ? (
          <>
            <AlertCircle size={16} color={tokens.destructiveForeground} />
            <Text
              style={[styles.text, { color: tokens.destructiveForeground }]}
            >
              {failedCount} {failedCount === 1 ? 'change' : 'changes'} failed to
              sync
            </Text>
            <Pressable
              onPress={handleRetry}
              disabled={isSyncing}
              style={styles.retryButton}
            >
              {isSyncing ? (
                <RefreshCw size={14} color={tokens.primaryForeground} />
              ) : (
                <Text style={styles.retryText}>Retry</Text>
              )}
            </Pressable>
          </>
        ) : pendingCount > 0 ? (
          <>
            {isSyncing ? (
              <RefreshCw size={16} color={tokens.primaryForeground} />
            ) : (
              <Wifi size={16} color={tokens.primaryForeground} />
            )}
            <Text style={styles.text}>
              {isSyncing
                ? 'Syncing...'
                : `${pendingCount} ${
                    pendingCount === 1 ? 'change' : 'changes'
                  } pending sync`}
            </Text>
          </>
        ) : null}
      </View>
    </Animated.View>
  );
};

const createStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      backgroundColor: tokens.primary,
      paddingVertical: 8,
      paddingHorizontal: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    text: {
      color: tokens.primaryForeground,
      fontSize: 13,
      fontWeight: '600',
      flex: 1,
    },
    retryButton: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 6,
      backgroundColor: tokens.primary,
      marginLeft: 8,
    },
    retryText: {
      fontSize: 12,
      fontWeight: '600',
      color: tokens.primaryForeground,
    },
  });

export default OfflineIndicator;
