import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/shared/utils/utils";

interface CompaniessPaginationProps {
  page: number;
  totalPages: number;
  selectedCount: number;
  onPageChange?: (page: number) => void;
}

export function CompaniessPagination({ 
  page, 
  totalPages, 
  selectedCount,
  onPageChange 
}: CompaniessPaginationProps) {
  // If there are no pages or only 1 page, we can still render the bar but with disabled controls
  const safeTotalPages = Math.max(1, totalPages);

  // Dynamically calculate which page numbers to show
  const getVisiblePages = () => {
    const visiblePages: (number | string)[] = [];
    
    // Always show first page
    visiblePages.push(1);

    if (page > 3) {
      visiblePages.push("...");
    }

    // Show pages around current page
    for (let i = Math.max(2, page - 1); i <= Math.min(safeTotalPages - 1, page + 1); i++) {
      if (!visiblePages.includes(i)) {
        visiblePages.push(i);
      }
    }

    if (page < safeTotalPages - 2) {
      visiblePages.push("...");
    }

    // Always show last page if it's greater than 1
    if (safeTotalPages > 1) {
      visiblePages.push(safeTotalPages);
    }

    return visiblePages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="p-4 border-t border-outline-variant flex items-center justify-between bg-surface-container-lowest">
      {/* Selected Items Counter */}
      <div className="text-sm text-on-surface-variant hidden sm:block">
        Selected <span className="font-medium text-on-background">{selectedCount}</span> Companies{selectedCount !== 1 ? 's' : ''}
      </div>
      
      {/* Pagination Controls */}
      <div className="flex items-center gap-2 ml-auto sm:ml-0">
        {/* Previous Page Button */}
        <button 
          disabled={page === 1}
          onClick={() => onPageChange?.(page - 1)}
          className={cn(
            "p-1 border border-outline-variant rounded text-on-surface-variant transition-colors",
            "hover:bg-surface-container-high disabled:opacity-50 disabled:cursor-not-allowed",
            page !== 1 && "cursor-pointer"
          )}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        {/* Dynamic Page Numbers */}
        {visiblePages.map((pageItem, index) => {
          if (pageItem === "...") {
            return (
              <span key={`ellipsis-${index}`} className="text-on-surface-variant px-1 select-none">
                ...
              </span>
            );
          }

          const pageNum = pageItem as number;
          return (
            <button 
              key={`page-${pageNum}`}
              onClick={() => onPageChange?.(pageNum)}
              className={cn(
                "w-8 h-8 flex items-center justify-center rounded text-sm transition-colors cursor-pointer",
                page === pageNum 
                  ? "bg-primary text-on-primary font-medium" 
                  : "hover:bg-surface-container-high text-on-surface-variant"
              )}
            >
              {pageNum}
            </button>
          );
        })}
        
        {/* Next Page Button */}
        <button 
          disabled={page === safeTotalPages}
          onClick={() => onPageChange?.(page + 1)}
          className={cn(
            "p-1 border border-outline-variant rounded text-on-surface-variant transition-colors",
            "hover:bg-surface-container-high disabled:opacity-50 disabled:cursor-not-allowed",
            page !== safeTotalPages && "cursor-pointer"
          )}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}


