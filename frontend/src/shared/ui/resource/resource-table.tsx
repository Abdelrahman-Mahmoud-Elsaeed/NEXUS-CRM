import * as React from "react";
import { cn } from "@/shared/utils/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../table";
import { Checkbox } from "../checkbox";

export interface ColumnConfig<T> {
  header: string;
  className?: string;
  cellAlignment?: "left" | "center" | "right";
  render: (item: T) => React.ReactNode;
}

interface ResourceTableProps<T extends { id: string }> {
  data: T[];
  columns: ColumnConfig<T>[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  rowActionsRender?: (item: T, isSelected: boolean) => React.ReactNode;
}

export function ResourceTable<T extends { id: string }>({
  data = [],
  columns,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  rowActionsRender,
}: ResourceTableProps<T>) {
  const safeData = Array.isArray(data) ? data : [];
  const allSelected = safeData.length > 0 && selectedIds.size === safeData.length;

  return (
    <div className="overflow-x-auto w-full">
      <Table className="w-full border-collapse min-w-[800px]">
        <TableHeader>
          <TableRow className="bg-surface-container-low border-b border-outline-variant hover:bg-surface-container-low">
            <TableHead className="w-12 text-center align-middle">
              <Checkbox
                checked={allSelected}
                onCheckedChange={onToggleSelectAll}
                className="rounded border-outline-variant data-[state=checked]:bg-primary"
              />
            </TableHead>
            {columns.map((col, idx) => (
              <TableHead
                key={idx}
                className={cn(
                  "font-medium font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant px-6 py-3",
                  col.cellAlignment === "center" && "text-center",
                  col.cellAlignment === "right" && "text-right",
                  col.className
                )}
              >
                {col.header}
              </TableHead>
            ))}
            {rowActionsRender && <TableHead className="text-right px-6 py-3 font-medium font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-outline-variant/50 bg-surface font-table-data text-table-data text-on-background">
          {safeData.map((item) => {
            if (!item || !item.id) return null;
            const isSelected = selectedIds.has(item.id);

            return (
              <TableRow
                key={item.id}
                className={cn(
                  "hover:bg-surface-container-low/50 transition-colors group border-b border-outline-variant/50",
                  isSelected && "border-l-2 border-primary bg-primary-container/5 relative"
                )}
              >
                <TableCell className="text-center align-middle px-6 py-3">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onToggleSelect(item.id)}
                    className="rounded border-outline-variant data-[state=checked]:bg-primary"
                  />
                </TableCell>
                {columns.map((col, idx) => (
                  <TableCell
                    key={idx}
                    className={cn(
                      "px-6 py-3 align-middle",
                      col.cellAlignment === "center" && "text-center",
                      col.cellAlignment === "right" && "text-right"
                    )}
                  >
                    {col.render(item)}
                  </TableCell>
                ))}
                {rowActionsRender && (
                  <TableCell className="text-right align-middle px-6 py-3">
                    <div className={cn("flex items-center justify-end gap-1.5 transition-opacity", isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100")}>
                      {rowActionsRender(item, isSelected)}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}