import * as React from "react";
import { Download, UserPlus, Upload, List, Grid } from "lucide-react";
import { cn } from "@/shared/utils/utils";

interface CompaniessHeaderProps {
  onExport: () => void;
  onCreate: () => void;
  viewMode: "list" | "grid";
  onViewChange: (mode: "list" | "grid") => void;
}

export function CompaniessHeader({
  onExport,
  onCreate,
  onViewChange,
  viewMode,
}: CompaniessHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h2 className="font-h2 text-h2 text-on-background font-bold tracking-tight">
          Companiess
        </h2>
        <p className="text-on-surface-variant font-body-sm text-body-sm mt-1">
          Manage and engage with your omnichannel network.
        </p>
      </div>
      <div className="flex items-center gap-2 text-on-surface-variant">
        <span className="font-body-sm text-body-sm mr-2 hidden md:inline select-none">
          Showing 1-10 of 2,491
        </span>
      </div>
      <div className="flex items-center gap-3">

        <div className="flex p-1 bg-surface-container-high rounded-lg mr-4">
          {/* List View Toggle */}
          <button
            onClick={() => onViewChange("list")}
            className={cn(
              "px-3 py-1.5 flex items-center space-x-2 transition-all rounded-md",
              viewMode === "list"
                ? "bg-surface text-primary"
                : "text-on-surface-variant hover:text-primary",
            )}
          >
            <List className="w-4 h-4" />
            <span className="text-label-sm">List</span>

          </button>

          {/* Grid View Toggle */}
          <button
            onClick={() => onViewChange("grid")}
            className={cn(
              "px-3 py-1.5 flex items-center space-x-2 transition-all rounded-md",
              viewMode === "grid"
                ? "bg-surface text-primary"
                : "text-on-surface-variant hover:text-primary",
            )}
          >
            <Grid className="w-4 h-4" />
            <span className="text-label-sm">Grid</span>
          </button>
        </div>
        {/* Export Button */}
        <button
          onClick={onExport}
          className={cn(
            "flex items-center gap-2 px-4 py-2 bg-surface text-on-surface-variant",
            "border border-outline-variant rounded-lg font-label-md text-label-md",
            "hover:bg-surface-container-high transition-colors shadow-sm cursor-pointer",
          )}
        >
          <Upload className="w-4 h-4" strokeWidth={2.25} />
          Import
        </button>
        <button
          onClick={onExport}
          className={cn(
            "flex items-center gap-2 px-4 py-2 bg-surface text-on-surface-variant",
            "border border-outline-variant rounded-lg font-label-md text-label-md",
            "hover:bg-surface-container-high transition-colors shadow-sm cursor-pointer",
          )}
        >
          <Download className="w-4 h-4" strokeWidth={2.25} />
          Export
        </button>

        {/* Add Companies Button */}
        <button
          onClick={onCreate}
          className={cn(
            "flex items-center gap-2 px-4 py-2 bg-primary text-on-primary",
            "rounded-lg font-label-md text-label-md",
            "hover:bg-primary/90 transition-colors shadow-sm cursor-pointer",
          )}
        >
          <UserPlus className="w-4 h-4 text-white" strokeWidth={2.25} />
          <h5 className=" text-white">Add Companies</h5>
        </button>
      </div>
    </div>
  );
}



