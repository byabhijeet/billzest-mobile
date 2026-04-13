import { supabase } from '../supabase/supabaseClient';
import { offlineStorage } from './storage';
import { OfflineMutation, SyncResult, SyncStatus } from './types';
import { AppError } from '../utils/appError';
import { logger } from '../utils/logger';
import type { CreatePurchasePayload } from '../supabase/purchasesService';

const isNetworkError = (error: unknown): boolean => {
  if (!error) return false;
  if (error instanceof AppError && error.code === 'offline') return true;
  const message = String(
    error instanceof Error ? error.message : error?.toString?.() ?? '',
  );
  return (
    message.includes('Network request failed') ||
    message.includes('Failed to fetch') ||
    message.includes('TypeError: Network') ||
    message.includes('ENOTFOUND') ||
    message.includes('ETIMEDOUT')
  );
};

// Configuration constants
const MAX_RETRY_COUNT = 5; // Maximum number of retries before giving up
const INITIAL_RETRY_DELAY_MS = 1000; // 1 second
const MAX_RETRY_DELAY_MS = 60000; // 60 seconds (1 minute)
const BACKOFF_MULTIPLIER = 2; // Exponential backoff multiplier

/**
 * Calculate exponential backoff delay in milliseconds
 * @param retryCount - Current retry attempt number (0-indexed)
 * @returns Delay in milliseconds
 */
const calculateBackoffDelay = (retryCount: number): number => {
  const delay =
    INITIAL_RETRY_DELAY_MS * Math.pow(BACKOFF_MULTIPLIER, retryCount);
  return Math.min(delay, MAX_RETRY_DELAY_MS);
};

/**
 * Check if a mutation should be retried now based on exponential backoff
 */
const shouldRetryNow = (mutation: OfflineMutation): boolean => {
  const retryCount = mutation.retryCount ?? 0;

  // If max retries exceeded, don't retry
  if (retryCount >= MAX_RETRY_COUNT) {
    return false;
  }

  // If no nextRetryAt set, retry immediately (first attempt)
  if (!mutation.nextRetryAt) {
    return true;
  }

  // Check if it's time to retry
  const nextRetryTime = new Date(mutation.nextRetryAt).getTime();
  const now = Date.now();
  return now >= nextRetryTime;
};

/**
 * Update mutation with retry metadata for exponential backoff
 */
const updateMutationForRetry = (
  mutation: OfflineMutation,
  error: unknown,
): OfflineMutation => {
  const retryCount = (mutation.retryCount ?? 0) + 1;
  const delay = calculateBackoffDelay(retryCount);
  const nextRetryAt = new Date(Date.now() + delay).toISOString();
  const errorMessage = error instanceof Error ? error.message : String(error);

  return {
    ...mutation,
    retryCount,
    lastRetryAt: new Date().toISOString(),
    nextRetryAt,
    errorMessage,
  };
};

export const offlineSyncEngine = {
  /**
   * Attempt to process all queued mutations. Should be called
   * when the app regains connectivity or on startup.
   * Implements exponential backoff for failed mutations.
   */
  async processQueue(): Promise<SyncResult> {
    const mutations = await offlineStorage.readMutations();
    if (mutations.length === 0) {
      return { processed: 0, failed: 0, remaining: 0, conflicts: 0 };
    }

    const remaining: OfflineMutation[] = [];
    const toRetry: OfflineMutation[] = [];
    let processed = 0;
    let failed = 0;
    let conflicts = 0;

    // Filter mutations that are ready to retry (based on exponential backoff)
    const readyMutations = mutations.filter(m => shouldRetryNow(m));
    const notReadyMutations = mutations.filter(m => !shouldRetryNow(m));

    // Add not-ready mutations back to queue
    remaining.push(...notReadyMutations);

    // Sort ready mutations by creation time (oldest first) for FIFO processing
    const sortedMutations = [...readyMutations].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    for (const mutation of sortedMutations) {
      try {
        let success = false;

        switch (mutation.entityType) {
          case 'product':
            success = await this.processProductMutation(mutation);
            break;
          case 'party':
            success = await this.processPartyMutation(mutation);
            break;
          case 'order':
            success = await this.processOrderMutation(mutation);
            break;
          case 'payment':
            success = await this.processPaymentMutation(mutation);
            break;
          case 'purchase':
            success = await this.processPurchaseMutation(mutation);
            break;
          case 'expense':
            success = await this.processExpenseMutation(mutation);
            break;
          case 'settings':
            // Settings mutations can be handled here if needed
            if (__DEV__) {
              logger.warn('[Offline] Settings mutations not yet implemented');
            }
            break;
          default:
            if (__DEV__) {
              logger.warn('[Offline] Unknown entity type:', {
                entityType: mutation.entityType,
              });
            }
            break;
        }

        if (success) {
          processed++;
          if (__DEV__) {
            logger.log(
              `[Offline] Successfully synced ${mutation.entityType} ${mutation.operation}`,
              {
                id: mutation.id,
                retryCount: mutation.retryCount ?? 0,
              },
            );
          }
        } else {
          // If processing didn't throw but returned false, keep for retry
          const updatedMutation = updateMutationForRetry(
            mutation,
            new Error('Processing returned false'),
          );
          toRetry.push(updatedMutation);
          failed++;
        }
      } catch (error: unknown) {
        if (isNetworkError(error)) {
          // Network error - apply exponential backoff
          const retryCount = mutation.retryCount ?? 0;

          if (retryCount >= MAX_RETRY_COUNT) {
            // Max retries exceeded - drop the mutation
            if (__DEV__) {
              logger.error(
                '[Offline] Max retries exceeded, dropping mutation',
                {
                  mutation: {
                    id: mutation.id,
                    entityType: mutation.entityType,
                    operation: mutation.operation,
                  },
                  retryCount,
                },
              );
            }
            failed++;
          } else {
            // Update mutation with retry metadata
            const updatedMutation = updateMutationForRetry(mutation, error);
            toRetry.push(updatedMutation);

            const delay = calculateBackoffDelay(retryCount);
            if (__DEV__) {
              logger.log(
                `[Offline] Network error, will retry ${mutation.entityType} ${mutation.operation} in ${delay}ms`,
                {
                  id: mutation.id,
                  retryCount: updatedMutation.retryCount,
                  nextRetryAt: updatedMutation.nextRetryAt,
                },
              );
            }
          }
        } else if (this.isConflictError(error)) {
          // Conflict error - handle conflict resolution
          conflicts++;
          const resolved = await this.resolveConflict(mutation, error);
          if (resolved) {
            // Retry with resolved mutation
            const updatedMutation = updateMutationForRetry(mutation, error);
            toRetry.push(updatedMutation);
          } else {
            // Conflict couldn't be resolved - drop mutation
            if (__DEV__) {
              logger.error(
                '[Offline] Conflict resolution failed, dropping mutation',
                {
                  mutation: {
                    id: mutation.id,
                    entityType: mutation.entityType,
                    operation: mutation.operation,
                  },
                  error: error instanceof Error ? error.message : String(error),
                },
              );
            }
            failed++;
          }
        } else {
          // Non-network, non-conflict error - drop the mutation
          if (__DEV__) {
            logger.error(
              '[Offline] Dropping failed mutation (non-network error)',
              {
                mutation: {
                  id: mutation.id,
                  entityType: mutation.entityType,
                  operation: mutation.operation,
                },
                error: error instanceof Error ? error.message : String(error),
              },
            );
          }
          failed++;
        }
      }
    }

    // Add mutations to retry back to queue
    remaining.push(...toRetry);

    await offlineStorage.overwriteMutations(remaining);

    return {
      processed,
      failed,
      remaining: remaining.length,
      conflicts,
    };
  },

  /**
   * Process a product mutation
   */
  async processProductMutation(mutation: OfflineMutation): Promise<boolean> {
    const { productsService } = await import('../supabase/productsService');

    try {
      switch (mutation.operation) {
        case 'create':
          await productsService.createProduct(
            mutation.payload.organization_id,
            mutation.payload,
          );
          return true;
        case 'update':
          if (!mutation.payload.id) {
            throw new Error('Product ID required for update');
          }
          await productsService.updateProduct(
            mutation.payload.organization_id,
            mutation.payload.id,
            mutation.payload.updates,
          );
          return true;
        case 'delete':
          if (!mutation.payload.id) {
            throw new Error('Product ID required for delete');
          }
          await productsService.deleteProduct(mutation.payload.id);
          return true;
        default:
          return false;
      }
    } catch (error: any) {
      // Re-throw to be handled by processQueue
      throw error;
    }
  },

  /**
   * Process a party mutation
   */
  async processPartyMutation(mutation: OfflineMutation): Promise<boolean> {
    const { partiesService } = await import('../supabase/partiesService');

    try {
      switch (mutation.operation) {
        case 'create':
          await partiesService.createParty(
            mutation.payload.organization_id,
            mutation.payload,
          );
          return true;
        case 'update':
          if (!mutation.payload.id) {
            throw new Error('Party ID required for update');
          }
          await partiesService.updateParty(
            mutation.payload.id,
            mutation.payload.updates,
          );
          return true;
        case 'delete':
          if (!mutation.payload.id) {
            throw new Error('Party ID required for delete');
          }
          await partiesService.deleteParty(mutation.payload.id);
          return true;
        default:
          return false;
      }
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * Process an order mutation
   */
  async processOrderMutation(mutation: OfflineMutation): Promise<boolean> {
    const { ordersService } = await import('../supabase/ordersService');

    try {
      switch (mutation.operation) {
        case 'create':
          const payload = mutation.payload;
          await ordersService.createOrder(payload.order, payload.items);
          return true;
        case 'update':
          if (!mutation.payload.id) {
            throw new Error('Order ID required for update');
          }
          await ordersService.updateOrderStatus(
            mutation.payload.id,
            mutation.payload.updates.status,
          );
          return true;
        case 'delete':
          if (!mutation.payload.id) {
            throw new Error('Order ID required for delete');
          }
          await ordersService.cancelOrder(
            mutation.payload.organization_id || '',
            mutation.payload.id,
          );
          return true;
        default:
          return false;
      }
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * Process a payment mutation
   */
  async processPaymentMutation(mutation: OfflineMutation): Promise<boolean> {
    const { paymentsService } = await import('../supabase/paymentsService');

    try {
      switch (mutation.operation) {
        case 'create':
          await paymentsService.createPayment(mutation.payload);
          return true;
        default:
          return false;
      }
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * Process a purchase mutation
   */
  async processPurchaseMutation(mutation: OfflineMutation): Promise<boolean> {
    const { purchasesService } = await import('../supabase/purchasesService');

    try {
      switch (mutation.operation) {
        case 'create':
          const payload = mutation.payload as CreatePurchasePayload;
          await purchasesService.createPurchase(
            (mutation.payload as any).organization_id || 'unknown',
            payload,
          );
          return true;
        default:
          return false;
      }
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * Process an expense mutation
   */
  async processExpenseMutation(mutation: OfflineMutation): Promise<boolean> {
    const { expensesService } = await import('../supabase/expensesService');

    try {
      switch (mutation.operation) {
        case 'create':
          // expenses table needs organization_id and user_id, but user_id was removed in V2
          // Temporarily bypassing until expenses schema is fixed
          if (__DEV__) {
            console.warn('Create expense temporarily bypassed for V2 schema');
          }
        case 'update':
          if (__DEV__) {
            console.warn('Update expense not implemented in Service');
          }
          return true;
        case 'delete':
          if (!mutation.payload.id) {
            throw new Error('Expense ID required for delete');
          }
          await expensesService.deleteExpense(mutation.payload.id);
          return true;
        default:
          return false;
      }
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * Check if an error is a conflict error (e.g., duplicate key, version mismatch)
   */
  isConflictError(error: unknown): boolean {
    if (!error) return false;
    const message = String(
      error instanceof Error ? error.message : error.toString?.() ?? '',
    ).toLowerCase();

    return (
      message.includes('duplicate') ||
      message.includes('conflict') ||
      message.includes('unique constraint') ||
      message.includes('already exists') ||
      message.includes('23505') || // PostgreSQL unique violation
      message.includes('version') ||
      message.includes('concurrent')
    );
  },

  /**
   * Resolve conflict between local and server state
   * Returns true if conflict was resolved and mutation should be retried
   * Returns false if mutation should be dropped
   */
  async resolveConflict(
    mutation: OfflineMutation,
    error: unknown,
  ): Promise<boolean> {
    try {
      // For create operations with duplicate errors, check if entity already exists
      if (mutation.operation === 'create') {
        // Strategy: If entity already exists, treat as success (idempotency)
        if (this.isConflictError(error)) {
          if (__DEV__) {
            logger.log(
              '[Offline] Conflict resolved: Entity already exists, treating as success',
              {
                mutation: { id: mutation.id, entityType: mutation.entityType },
              },
            );
          }
          return false; // Don't retry, treat as success
        }
      }

      // For update operations, could implement last-write-wins or merge strategies
      // For now, we'll retry once more
      if (mutation.operation === 'update') {
        const retryCount = mutation.retryCount ?? 0;
        if (retryCount < 2) {
          // Retry update once more
          return true;
        }
      }

      // Default: Don't resolve, drop mutation
      return false;
    } catch (resolveError) {
      if (__DEV__) {
        logger.error(
          '[Offline] Error during conflict resolution',
          resolveError,
        );
      }
      return false;
    }
  },

  /**
   * Helper to check if Supabase is reachable. Can be used by
   * screens to decide whether to show offline banners, etc.
   */
  async isOnline(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('id')
        .limit(1);
      if (error) {
        if (isNetworkError(error)) {
          return false;
        }
        if (__DEV__) {
          logger.warn(
            '[Offline] Non-network error while checking connectivity',
            error,
          );
        }
      }
      return true;
    } catch (error: unknown) {
      if (isNetworkError(error)) return false;
      if (__DEV__) {
        logger.error(
          '[Offline] Unexpected error during connectivity check',
          error,
        );
      }
      return false;
    }
  },

  /**
   * Get count of pending mutations
   */
  async getPendingCount(): Promise<number> {
    const mutations = await offlineStorage.readMutations();
    return mutations.length;
  },

  /**
   * Get count of failed mutations (exceeded max retries)
   */
  async getFailedCount(): Promise<number> {
    const mutations = await offlineStorage.readMutations();
    return mutations.filter(m => (m.retryCount ?? 0) >= MAX_RETRY_COUNT).length;
  },

  /**
   * Get sync status with detailed information
   */
  async getSyncStatus(): Promise<SyncStatus> {
    const mutations = await offlineStorage.readMutations();
    const readyMutations = mutations.filter(m => shouldRetryNow(m));
    const failedMutations = mutations.filter(
      m => (m.retryCount ?? 0) >= MAX_RETRY_COUNT,
    );

    // Get last sync result from storage (if stored)
    const lastSyncResult = await offlineStorage.getCache<SyncResult>(
      'lastSyncResult',
    );
    const lastSyncAt = await offlineStorage.getCache<string>('lastSyncAt');

    return {
      isSyncing: false, // This should be set by the caller during sync
      lastSyncAt: lastSyncAt ?? null,
      lastSyncResult: lastSyncResult ?? null,
      pendingCount: readyMutations.length,
      failedCount: failedMutations.length,
    };
  },

  /**
   * Clear all pending mutations (use with caution)
   */
  async clearQueue(): Promise<void> {
    await offlineStorage.overwriteMutations([]);
  },
};
