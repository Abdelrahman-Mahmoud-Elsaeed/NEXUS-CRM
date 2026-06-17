import * as React from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "../input";
import { Button } from "../button";

interface ResourceToolbarProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (val: string) => void;
  filtersCount: number;
  onFilterClick?: () => void;
  extraActions?: React.ReactNode;
}

export function ResourceToolbar({
  searchPlaceholder = "Search records...",
  searchValue,
  onSearchChange,
  filtersCount,
  onFilterClick,
  extraActions,
}: ResourceToolbarProps) {
  return (
    <div className="p-4 border-b border-outline-variant flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-low/50">
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5 pointer-events-none" />
          <Input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-lg text-body-sm focus-visible:ring-2 focus-visible:ring-primary/20 placeholder:text-on-surface-variant w-full"
            placeholder={searchPlaceholder}
          />
        </div>
        
        {onFilterClick && (
          <Button
            variant="outline"
            onClick={onFilterClick}
            className="gap-2 text-on-surface-variant border-outline-variant hover:bg-surface-container-high relative"
          >
            <Filter className="w-4 h-4" />
            Filter
            {filtersCount > 0 && (
              <span className="ml-1 w-5 h-5 rounded-full bg-primary-container text-on-primary-container font-medium text-[11px] flex items-center justify-center">
                {filtersCount}
              </span>
            )}
          </Button>
        )}
      </div>

      {extraActions && <div className="flex items-center gap-2 w-full sm:w-auto justify-end">{extraActions}</div>}
    </div>
  );
}