
import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface SlotPaginationProps {
  currentPage: number;
  totalPages: number;
  pageNumbers: (number | string)[];
  onPageChange: (page: number) => void;
  handlePrevPage: () => void;
  handleNextPage: () => void;
}

const SlotPagination: React.FC<SlotPaginationProps> = ({
  currentPage,
  totalPages,
  pageNumbers,
  onPageChange,
  handlePrevPage,
  handleNextPage,
}) => {
  return (
    <Pagination className="mt-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={handlePrevPage}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        
        {pageNumbers.map((page, index) => {
          const key = typeof page === "string" 
            ? `${page}-${index}` 
            : `page-${page}`;
          
          return (
            page === "ellipsis-start" || page === "ellipsis-end" ? (
              <PaginationItem key={key}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={key}>
                <PaginationLink 
                  isActive={currentPage === page} 
                  onClick={() => onPageChange(Number(page))}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          );
        })}
        
        <PaginationItem>
          <PaginationNext 
            onClick={handleNextPage}
            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default React.memo(SlotPagination);
