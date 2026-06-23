import type { DealListItem, PipelineStageData } from "../types/deal.types";
import { DealCard } from "./DealCard";

interface KanbanColumnProps {
  stage: PipelineStageData;
  deals: DealListItem[];
  onDragStart: (deal: DealListItem) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (stageId: string) => void;
  onDealClick?: (dealId: string) => void;
  isDragOver?: boolean;
}

export function KanbanColumn({
  stage,
  deals,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  onDealClick,
}: KanbanColumnProps) {
  const getStageColor = (order: number) => {
    const colors = [
      "bg-surface-variant",
      "bg-tertiary-fixed-dim",
      "bg-secondary-container",
      "bg-primary",
    ];
    return colors[order % colors.length];
  };

  const calculateStageValue = () => {
    return deals.reduce((sum, deal) => {
      if (deal.value) {
        return sum + parseFloat(deal.value);
      }
      return sum;
    }, 0);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div
      className="w-[320px] shrink-0 flex flex-col max-h-full bg-surface-container-low rounded-lg border border-outline-variant/50"
      onDragOver={onDragOver}
      onDrop={() => onDrop(stage.id)}
    >
      <div className="p-3 border-b border-outline-variant/50 flex justify-between items-center bg-surface-container-low rounded-t-lg shrink-0">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${getStageColor(stage.order)}`} />
          <h3 className="font-label-md text-label-md text-on-surface font-semibold uppercase tracking-wider">
            {stage.name}
          </h3>
          <span className="bg-surface border border-outline-variant text-on-surface-variant text-[10px] px-1.5 py-0.5 rounded-full">
            {deals.length}
          </span>
        </div>
        <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">
          {formatCurrency(calculateStageValue())}
        </span>
      </div>
      <div className="p-3 flex-1 overflow-y-auto space-y-3 kanban-scroll min-h-[200px]">
        {deals.length === 0 ? (
          <div className="flex items-center justify-center h-full min-h-[100px] text-center opacity-50">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              No deals in this stage
            </p>
          </div>
        ) : (
          deals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onClick={() => onDealClick?.(deal.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
