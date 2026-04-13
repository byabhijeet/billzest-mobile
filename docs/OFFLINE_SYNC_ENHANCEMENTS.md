# Offline Sync Enhancements

## Overview
Enhanced the offline sync engine with exponential backoff retry logic, conflict resolution, and improved sync status tracking.

## Features Implemented

### 1. Exponential Backoff Retry Logic
- **Configuration:**
  - Max retries: 5 attempts
  - Initial delay: 1 second
  - Max delay: 60 seconds
  - Backoff multiplier: 2x

- **How it works:**
  - First retry: 1 second delay
  - Second retry: 2 seconds delay
  - Third retry: 4 seconds delay
  - Fourth retry: 8 seconds delay
  - Fifth retry: 16 seconds delay
  - After 5 retries: Mutation is dropped

- **Implementation:**
  - Mutations track `retryCount`, `lastRetryAt`, and `nextRetryAt`
  - Only mutations ready for retry (based on `nextRetryAt`) are processed
  - Mutations not ready are kept in queue for later

### 2. Conflict Resolution
- **Conflict Detection:**
  - Detects duplicate key errors
  - Detects unique constraint violations
  - Detects version/concurrent modification errors

- **Resolution Strategies:**
  - **Create operations:** If entity already exists, treat as success (idempotency)
  - **Update operations:** Retry once more, then drop if still failing
  - **Default:** Drop mutation if conflict can't be resolved

### 3. Enhanced Sync Status Tracking
- **New Status Fields:**
  - `isSyncing`: Whether sync is currently in progress
  - `lastSyncAt`: Timestamp of last sync attempt
  - `lastSyncResult`: Result of last sync (processed, failed, conflicts)
  - `pendingCount`: Number of mutations ready to retry
  - `failedCount`: Number of mutations that exceeded max retries

- **Storage:**
  - Sync results and timestamps are cached in AsyncStorage
  - Accessible via `offlineSyncEngine.getSyncStatus()`

### 4. Improved OfflineIndicator Component
- **New Features:**
  - Shows failed mutations count
  - Displays "Syncing..." status during sync
  - Retry button for failed mutations
  - Better visual feedback with icons

- **States:**
  - Offline: Shows "You're offline" message
  - Pending: Shows count of pending mutations
  - Failed: Shows count of failed mutations with retry button
  - Syncing: Shows "Syncing..." with spinner

## API Changes

### Updated Types

```typescript
// Enhanced OfflineMutation type
type OfflineMutation = {
  id: string;
  entityType: OfflineEntityType;
  operation: OfflineOperationType;
  payload: any;
  createdAt: string;
  retryCount?: number;        // NEW
  lastRetryAt?: string;        // NEW
  nextRetryAt?: string;       // NEW
  errorMessage?: string;       // NEW
};

// New SyncStatus type
type SyncStatus = {
  isSyncing: boolean;
  lastSyncAt: string | null;
  lastSyncResult: SyncResult | null;
  pendingCount: number;
  failedCount: number;
};

// Enhanced SyncResult type
type SyncResult = {
  processed: number;
  failed: number;
  remaining: number;
  conflicts?: number;          // NEW
};
```

### New Methods

```typescript
// Get count of failed mutations
offlineSyncEngine.getFailedCount(): Promise<number>

// Get detailed sync status
offlineSyncEngine.getSyncStatus(): Promise<SyncStatus>

// Check if error is a conflict
offlineSyncEngine.isConflictError(error: unknown): boolean

// Resolve conflict between local and server state
offlineSyncEngine.resolveConflict(mutation, error): Promise<boolean>
```

### Enhanced useOfflineSync Hook

```typescript
const {
  isSyncing,
  lastSyncResult,
  performSync,
  getPendingCount,
  getFailedCount,      // NEW
  getSyncStatus,       // NEW
  isOnline,            // NEW
} = useOfflineSync();
```

## Configuration

You can adjust retry behavior by modifying constants in `src/offline/syncEngine.ts`:

```typescript
const MAX_RETRY_COUNT = 5;              // Maximum retries
const INITIAL_RETRY_DELAY_MS = 1000;    // Initial delay (1 second)
const MAX_RETRY_DELAY_MS = 60000;       // Maximum delay (60 seconds)
const BACKOFF_MULTIPLIER = 2;            // Exponential multiplier
```

## Usage Examples

### Check Sync Status
```typescript
const status = await offlineSyncEngine.getSyncStatus();
console.log(`Pending: ${status.pendingCount}, Failed: ${status.failedCount}`);
```

### Manual Retry
```typescript
const { performSync } = useOfflineSync();
await performSync();
```

### Monitor Failed Mutations
```typescript
const failedCount = await offlineSyncEngine.getFailedCount();
if (failedCount > 0) {
  // Show user notification about failed mutations
}
```

## Benefits

1. **Better Reliability:** Exponential backoff prevents overwhelming the server
2. **Conflict Handling:** Gracefully handles duplicate/conflict errors
3. **User Feedback:** Clear visibility into sync status and failures
4. **Retry Control:** Users can manually retry failed mutations
5. **Production Ready:** Proper error handling and logging

## Testing

To test the retry logic:
1. Go offline
2. Create/update entities
3. Go online - mutations should sync
4. If sync fails, mutations will retry with exponential backoff
5. Check OfflineIndicator for status updates

