
import { useMemo, useCallback } from "react";

interface UseSlotPaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange?: (page: number) => void;
}

export const useSlotPagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}: UseSlotPaginationProps) => {
  const totalPages = useMemo(() => {
    if (totalItems === 0) return 1;
    return Math.ceil(totalItems / itemsPerPage);
  }, [totalItems, itemsPerPage]);

  const pageNumbers = useMemo(() => {
    if (totalPages <= 1) return [];
    
    const numbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        numbers.push(i);
      }
    } else {
      numbers.push(1);
      
      if (currentPage > 3) {
        numbers.push("ellipsis-start");
      }
      
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        numbers.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        numbers.push("ellipsis-end");
      }
      
      numbers.push(totalPages);
    }
    
    return numbers;
  }, [currentPage, totalPages]);

  // Stable callback references
  const handlePageChange = useCallback((page: number) => {
    if (onPageChange && page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  }, [onPageChange, currentPage, totalPages]);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  }, [currentPage, handlePageChange]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  }, [currentPage, totalPages, handlePageChange]);

  return {
    totalPages,
    pageNumbers,
    handlePageChange,
    handlePrevPage,
    handleNextPage,
  };
};
