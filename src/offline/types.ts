export type OfflineEntityType =
  | 'product'
  | 'party'
  | 'order'
  | 'payment'
  | 'purchase'
  | 'expense'
  | 'settings'
  | 'category';

export type OfflineOperationType = 'create' | 'update' | 'delete';

export type OfflineMutation = {
  id: string;
  entityType: OfflineEntityType;
  operation: OfflineOperationType;
  payload: any;
  createdAt: string;
  retryCount?: number; // Number of times this mutation has been retried
  lastRetryAt?: string; // ISO timestamp of last retry attempt
  nextRetryAt?: string; // ISO timestamp when this mutation should be retried next (for exponential backoff)
  errorMessage?: string; // Last error message for debugging
};

export type OfflineCacheKey =
  | 'products'
  | 'parties'
  | 'orders'
  | 'purchases'
  | 'settings'
  | 'categories'
  | 'billConfig'
  | 'lastSyncResult'
  | 'lastSyncAt';

export type SyncStatus = {
  isSyncing: boolean;
  lastSyncAt: string | null;
  lastSyncResult: SyncResult | null;
  pendingCount: number;
  failedCount: number;
};

export type SyncResult = {
  processed: number;
  failed: number;
  remaining: number;
  conflicts?: number; // Number of conflicts encountered
};
