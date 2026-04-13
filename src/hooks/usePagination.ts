import { useState, useMemo, useCallback } from 'react';

export interface PaginationOptions {
  pageSize?: number;
  initialPage?: number;
}

export interface PaginationResult<T> {
  paginatedData: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  setPageSize: (size: number) => void;
}

/**
 * Hook for paginating data arrays
 * @param data - The full array of data to paginate
 * @param options - Pagination options (pageSize, initialPage)
 * @returns Pagination result with paginated data and navigation functions
 */
export function usePagination<T>(
  data: T[],
  options: PaginationOptions = {},
): PaginationResult<T> {
  const { pageSize = 20, initialPage = 1 } = options;
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(pageSize);

  const totalItems = data.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // Ensure current page is valid
  const validPage = Math.min(Math.max(1, currentPage), totalPages);
  if (validPage !== currentPage) {
    setCurrentPage(validPage);
  }

  const paginatedData = useMemo(() => {
    const startIndex = (validPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, validPage, itemsPerPage]);

  const goToPage = useCallback((page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if (validPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  }, [validPage, totalPages]);

  const previousPage = useCallback(() => {
    if (validPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }, [validPage]);

  const setPageSize = useCallback((size: number) => {
    const newSize = Math.max(1, size);
    setItemsPerPage(newSize);
    // Recalculate current page to stay within bounds
    const newTotalPages = Math.max(1, Math.ceil(totalItems / newSize));
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages);
    }
  }, [totalItems, currentPage]);

  return {
    paginatedData,
    currentPage: validPage,
    totalPages,
    totalItems,
    hasNextPage: validPage < totalPages,
    hasPreviousPage: validPage > 1,
    goToPage,
    nextPage,
    previousPage,
    setPageSize,
  };
}

