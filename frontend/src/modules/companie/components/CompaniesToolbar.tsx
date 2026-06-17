import { Search, Filter } from "lucide-react";

interface CompaniessToolbarProps {
  search: string;
  onSearchChange: (val: string) => void;
  filtersCount: number;
}

export function CompaniessToolbar({
  search,
  onSearchChange,
  filtersCount,
}: CompaniessToolbarProps) {
  return (
    <div className="p-4 border-b border-outline-variant flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-low/50">
      {/* Search & Filters */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-lg text-body-sm font-body-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-on-surface-variant"
            placeholder="Search contacts..."
          />
        </div>
        
        <button className="flex items-center gap-2 px-3 py-2 bg-surface border border-outline-variant rounded-lg text-on-surface-variant font-label-sm text-label-sm hover:bg-surface-container-high transition-colors whitespace-nowrap cursor-pointer">
          <Filter className="w-4 h-4" />
          Filter
          {filtersCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-[10px] font-bold ml-1">
              {filtersCount}
            </span>
          )}
        </button>
      </div>

      {/* View Options & Summary */}

    </div>
  );
}


