import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/shared/utils/utils";
import { Button } from "../button";

interface ResourcePaginationProps {
  page: number;
  totalPages: number;
  selectedCount: number;
  onPageChange: (page: number) => void;
}

export function ResourcePagination({
  page,
  totalPages,
  selectedCount,
  onPageChange,
}: ResourcePaginationProps) {
  const safeTotalPages = Math.max(1, totalPages);

  const getVisiblePages = () => {
    const visiblePages: (number | string)[] = [];
    visiblePages.push(1);

    if (page > 3) visiblePages.push("...");

    for (let i = Math.max(2, page - 1); i <= Math.min(safeTotalPages - 1, page + 1); i++) {
      if (!visiblePages.includes(i)) visiblePages.push(i);
    }

    if (page < safeTotalPages - 2) visiblePages.push("...");
    if (safeTotalPages > 1 && !visiblePages.includes(safeTotalPages)) visiblePages.push(safeTotalPages);

    return visiblePages;
  };

  return (
    <div className="px-6 h-16 border-t border-outline-variant flex items-center justify-between bg-surface-container-low/30">
      <div className="font-label-sm text-label-sm text-on-surface-variant select-none">
        {selectedCount > 0 ? `${selectedCount} row(s) selected` : "No rows selected"}
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="icon"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="h-8 w-8 border-outline-variant text-on-surface-variant disabled:opacity-50"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        {getVisiblePages().map((pageItem, index) => {
          if (pageItem === "...") {
            return (
              <span key={`ellipsis-${index}`} className="text-on-surface-variant px-2 text-sm font-medium select-none">
                ...
              </span>
            );
          }

          const pageNum = pageItem as number;
          return (
            <Button
              key={`page-${pageNum}`}
              variant={page === pageNum ? "default" : "ghost"}
              onClick={() => onPageChange(pageNum)}
              className={cn(
                "h-8 w-8 text-sm p-0 font-normal",
                page === pageNum ? "bg-[#3525cd] hover:bg-[#3525cd] text-white font-medium" : "text-on-surface-variant hover:bg-surface-container-high"
              )}
            >
              {pageNum}
            </Button>
          );
        })}

        <Button
          variant="outline"
          size="icon"
          disabled={page === safeTotalPages}
          onClick={() => onPageChange(page + 1)}
          className="h-8 w-8 border-outline-variant text-on-surface-variant disabled:opacity-50"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}