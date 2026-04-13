/**
 * Hook for creating cancellable React Query queries
 * Automatically cancels requests when component unmounts
 */

import { useEffect, useRef } from 'react';
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { withTimeout, createTimeoutSignal } from '../utils/networkUtils';

// AbortController is available in React Native 0.60+

interface CancellableQueryOptions<TData, TError> extends Omit<UseQueryOptions<TData, TError>, 'queryFn'> {
  queryFn: (signal?: AbortSignal) => Promise<TData>;
  timeout?: number; // Timeout in milliseconds (default: 30000)
}

/**
 * Hook that wraps useQuery with automatic cancellation and timeout
 */
export const useCancellableQuery = <TData = unknown, TError = Error>(
  options: CancellableQueryOptions<TData, TError>
): UseQueryResult<TData, TError> => {
  const abortControllerRef = useRef<AbortController | null>(null);
  const { queryFn, timeout = 30000, ...queryOptions } = options;

  // Create new abort controller for each query
  useEffect(() => {
    abortControllerRef.current = new AbortController();
    return () => {
      // Cancel request on unmount
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [queryOptions.queryKey]);

  const wrappedQueryFn = async (): Promise<TData> => {
    const signal = abortControllerRef.current?.signal;
    const timeoutSignal = createTimeoutSignal(timeout);

    // Combine signals - abort if either is aborted
    const combinedSignal = signal || timeoutSignal;
    
    try {
      return await withTimeout(
        queryFn(combinedSignal),
        timeout,
        'Request timed out'
      );
    } catch (error) {
      // Re-throw with proper error handling
      throw error;
    }
  };

  return useQuery<TData, TError>({
    ...queryOptions,
    queryFn: wrappedQueryFn,
  });
};

