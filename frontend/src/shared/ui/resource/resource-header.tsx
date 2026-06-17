import { Download, Upload, List, Grid, Plus } from "lucide-react";
import { cn } from "@/shared/utils/utils";
import { Button } from "../button";

interface ResourceHeaderProps {
  title: string;
  description: string;
  totalRecords: number;
  currentRangeText?: string;
  onCreateClick: () => void;
  onImportClick?: () => void;
  onExportClick?: () => void;
  viewMode?: "list" | "grid";
  onViewModeChange?: (mode: "list" | "grid") => void;
  createButtonText?: string;
}

export function ResourceHeader({
  title,
  description,
  totalRecords,
  currentRangeText,
  onCreateClick,
  onImportClick,
  onExportClick,
  viewMode = "list",
  onViewModeChange,
  createButtonText = "Add New",
}: ResourceHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h2 className="font-h2 text-h2 text-on-background font-bold tracking-tight">
          {title}
        </h2>
        <p className="text-on-surface-variant font-body-sm text-body-sm mt-1">
          {description}
        </p>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {currentRangeText && (
          <span className="font-body-sm text-body-sm mr-2 hidden md:inline select-none text-on-surface-variant">
            {currentRangeText} of {totalRecords.toLocaleString()}
          </span>
        )}

        {onViewModeChange && (
          <div className="flex justify-center align-middle p-1 h-12 bg-surface-container-low border border-outline-variant rounded-lg items-center gap-1">
            <Button
              variant="ghost"
              className={cn(
                "h-9 px-3 flex items-center justify-center gap-2 rounded-md transition-all",
                viewMode === "list"
                  ? "bg-white shadow-sm text-primary font-medium"
                  : "text-on-surface-variant hover:text-primary",
              )}
              onClick={() => onViewModeChange("list")}
            >
              <List className="w-4 h-4" />
              <span className="text-label-sm">List</span>
            </Button>

            <Button
              variant="ghost"
              className={cn(
                "h-9 px-3 flex items-center justify-center gap-2 rounded-md transition-all",
                viewMode === "grid"
                  ? "bg-white shadow-sm text-primary font-medium"
                  : "text-on-surface-variant hover:text-primary",
              )}
              onClick={() => onViewModeChange("grid")}
            >
              <Grid className="w-4 h-4" />
              <span className="text-label-sm">Grid</span>
            </Button>
          </div>
        )}

        {onImportClick && (
          <Button
            variant="outline"
            onClick={onImportClick}
            className="gap-2 border-outline-variant text-on-surface-variant hover:bg-surface-container-high"
          >
            <Upload className="w-4 h-4" strokeWidth={2.25} />
            Import
          </Button>
        )}

        {onExportClick && (
          <Button
            variant="outline"
            onClick={onExportClick}
            className="gap-2 border-outline-variant text-on-surface-variant hover:bg-surface-container-high"
          >
            <Download className="w-4 h-4" strokeWidth={2.25} />
            Export
          </Button>
        )}

        <Button
          onClick={onCreateClick}
          className="gap-2 h-12 bg-[#3525cd] hover:bg-[#4f46e5] text-white shadow-sm"
        >
          <Plus className="w-4 h-4" strokeWidth={2.25} />
          {createButtonText}
        </Button>
      </div>
    </div>
  );
}
