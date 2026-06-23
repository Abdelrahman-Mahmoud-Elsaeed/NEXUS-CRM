import { useState } from "react";
import type { DealListItem, PipelineStageData } from "../types/deal.types";
import { KanbanColumn } from "./KanbanColumn";

interface KanbanBoardProps {
  stages: PipelineStageData[];
  deals: DealListItem[];
  onMoveDeal: (dealId: string, stageId: string) => Promise<{ success: boolean; msg?: string }>;
  onDealClick?: (dealId: string) => void;
  isLoading?: boolean;
}

export function KanbanBoard({ stages, deals, onMoveDeal, onDealClick, isLoading }: KanbanBoardProps) {
  const [draggedDeal, setDraggedDeal] = useState<DealListItem | null>(null);

  // Group deals by stage
  const groupedDeals = stages.reduce((acc, stage) => {
    acc[stage.id] = deals.filter((deal) => deal.stage?.id === stage.id);
    return acc;
  }, {} as Record<string, DealListItem[]>);

  const handleDragStart = (deal: DealListItem) => {
    setDraggedDeal(deal);
  };

  const handleDragEnd = () => {
    setDraggedDeal(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (stageId: string) => {
    if (draggedDeal && draggedDeal.stage?.id !== stageId) {
      const result = await onMoveDeal(draggedDeal.id, stageId);
      if (!result.success) {
        console.error("Failed to move deal:", result.msg);
      }
    }
    setDraggedDeal(null);
  };

  // Calculate total pipeline value
  const totalPipelineValue = deals.reduce((sum, deal) => {
    if (deal.value) {
      return sum + parseFloat(deal.value);
    }
    return sum;
  }, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Loading deals...</p>
        </div>
      </div>
    );
  }

  if (stages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-2">No pipeline stages found</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant/70">Create a pipeline to start managing deals</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Page Header */}
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h2 className="font-h2 text-h2 text-on-surface">Pipeline Deals</h2>
          <p className="font-body-base text-body-base text-on-surface-variant mt-1">
            Total Pipeline Value: <span className="font-bold text-on-surface">{formatCurrency(totalPipelineValue)}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-3 py-1.5 border border-outline-variant rounded bg-surface text-on-surface font-label-sm flex items-center gap-2 hover:bg-surface-container-high transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
            </svg>
            Filters
          </button>
          <div className="flex bg-surface-container-low rounded border border-outline-variant p-0.5">
            <button className="p-1.5 bg-surface rounded shadow-sm text-primary flex items-center justify-center">
              <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
              </svg>
            </button>
            <button className="p-1.5 text-on-surface-variant hover:text-primary flex items-center justify-center transition-colors">
              <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 14h4v-4H4v4zm0 5h4v-4H4v4zM4 9h4V5H4v4zm5 5h12v-4H9v4zm0 5h12v-4H9v4zM9 5v4h12V5H9z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto kanban-scroll pb-4 flex gap-gutter min-w-full gap-6">
        {stages.map((stage) => (
          <KanbanColumn
            key={stage.id}
            stage={stage}
            deals={groupedDeals[stage.id] || []}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDealClick={onDealClick}
          />
        ))}
        
        {/* Won/Lost columns (placeholder) */}
        <div className="w-[320px] shrink-0 flex flex-col max-h-full bg-surface-container-low/50 rounded-lg border border-outline-variant/30 border-dashed">
          <div className="p-3 border-b border-outline-variant/30 border-dashed flex justify-between items-center rounded-t-lg shrink-0 opacity-70">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-surface-tint" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
              <h3 className="font-label-md text-label-md text-on-surface font-semibold uppercase tracking-wider">Won</h3>
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">Drop to win</span>
          </div>
          <div className="p-3 flex-1 flex items-center justify-center min-h-[200px]">
            <div className="text-center opacity-50">
              <svg className="w-8 h-8 text-outline-variant mb-2 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
              </svg>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Drag deals here to<br />mark them as won.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
