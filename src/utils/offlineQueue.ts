import { offlineStorage } from '../offline/storage';
import { OfflineMutation, OfflineEntityType, OfflineOperationType } from '../offline/types';
import { AppError } from './appError';
import { logger } from './logger';

/**
 * Helper to queue a mutation for offline sync
 */
export const queueMutation = async (
  entityType: OfflineEntityType,
  operation: OfflineOperationType,
  payload: any,
): Promise<void> => {
  const mutation: OfflineMutation = {
    id: `mutation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    entityType,
    operation,
    payload,
    createdAt: new Date().toISOString(),
  };

  await offlineStorage.appendMutation(mutation);
  logger.log(`[Offline] Queued ${operation} mutation for ${entityType}`, { id: mutation.id });
};

/**
 * Helper to detect if an error should trigger offline queuing
 */
export const shouldQueueForOffline = (error: unknown): boolean => {
  if (error instanceof AppError && error.code === 'offline') {
    return true;
  }

  const message = (error as any)?.message ?? String(error ?? '');
  return (
    message.includes('Network request failed') ||
    message.includes('Failed to fetch') ||
    message.includes('TypeError: Network') ||
    message.includes('ENOTFOUND') ||
    message.includes('ETIMEDOUT') ||
    message.includes('ECONNREFUSED')
  );
};

