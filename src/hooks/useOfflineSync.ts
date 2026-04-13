import { useEffect, useCallback, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { offlineSyncEngine } from '../offline/syncEngine';
import { SyncResult } from '../offline/types';
import { useQueryClient } from '@tanstack/react-query';
import { offlineStorage } from '../offline/storage';
import { logger } from '../utils/logger';

export const useOfflineSync = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<SyncResult | null>(null);
  const queryClient = useQueryClient();

  const performSync = useCallback(async (): Promise<SyncResult | null> => {
    // Check if online first
    const online = await offlineSyncEngine.isOnline();
    if (!online) {
      if (__DEV__) {
        logger.log('[Offline] Not online, skipping sync');
      }
      return null;
    }

    setIsSyncing(true);
    try {
      const result = await offlineSyncEngine.processQueue();
      setLastSyncResult(result);

      // Store sync result and timestamp
      await offlineStorage.setCache('lastSyncResult', result);
      await offlineStorage.setCache('lastSyncAt', new Date().toISOString());

      // If mutations were processed, invalidate relevant queries to refresh data
      if (result.processed > 0) {
        queryClient.invalidateQueries({ queryKey: ['products'] });
        queryClient.invalidateQueries({ queryKey: ['parties'] });
        queryClient.invalidateQueries({ queryKey: ['invoices'] });
        queryClient.invalidateQueries({ queryKey: ['purchases'] });
        queryClient.invalidateQueries({ queryKey: ['expenses'] });
        queryClient.invalidateQueries({ queryKey: ['payments'] });
      }

      // Log sync results
      if (
        __DEV__ &&
        (result.processed > 0 || result.failed > 0 || result.conflicts)
      ) {
        logger.log('[Offline] Sync completed', {
          processed: result.processed,
          failed: result.failed,
          remaining: result.remaining,
          conflicts: result.conflicts ?? 0,
        });
      }

      return result;
    } catch (error) {
      logger.error('[Offline] Sync failed', error);
      return null;
    } finally {
      setIsSyncing(false);
    }
  }, [queryClient]);

  // Sync when app comes to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        if (nextAppState === 'active') {
          // App has come to the foreground, try to sync
          performSync();
        }
      },
    );

    return () => {
      subscription.remove();
    };
  }, [performSync]);

  // Sync on mount
  useEffect(() => {
    performSync();
  }, [performSync]);

  return {
    isSyncing,
    lastSyncResult,
    performSync,
    getPendingCount: offlineSyncEngine.getPendingCount,
    getFailedCount: offlineSyncEngine.getFailedCount,
    getSyncStatus: offlineSyncEngine.getSyncStatus,
    isOnline: offlineSyncEngine.isOnline,
  };
};
