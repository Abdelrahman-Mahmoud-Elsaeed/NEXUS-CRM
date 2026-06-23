import type { DealListItem } from "../types/deal.types";

interface DealCardProps {
  deal: DealListItem;
  onDragStart: (deal: DealListItem) => void;
  onDragEnd: () => void;
  onClick?: () => void;
}

export function DealCard({ deal, onDragStart, onDragEnd, onClick }: DealCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatCurrency = (value: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const isOverdue = deal.expectedCloseDate && new Date(deal.expectedCloseDate) < new Date() && deal.status === "Open";

  return (
    <div
      draggable
      onDragStart={() => onDragStart(deal)}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className="deal-card bg-surface p-4 rounded border border-outline-variant cursor-grab active:cursor-grabbing transition-all relative group hover:shadow-md"
    >
      <div className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-outline">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
        </svg>
      </div>
      <div className="ml-2">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-label-md text-label-md text-on-surface font-medium truncate pr-2">
            {deal.name}
          </h4>
          <button
            className="text-outline hover:text-on-surface opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </button>
        </div>
        {deal.value && (
          <div className="font-h3 text-h3 text-primary font-bold mb-3">
            {formatCurrency(parseFloat(deal.value), deal.currency)}
          </div>
        )}
        <div className="flex items-center gap-2 mb-4">
          {deal.company ? (
            <div className="w-5 h-5 rounded bg-surface-container-high flex items-center justify-center text-xs font-bold text-on-surface-variant border border-outline-variant/50">
              {getInitials(deal.company.name)}
            </div>
          ) : (
            <div className="w-5 h-5 rounded bg-surface-container-high flex items-center justify-center text-xs font-bold text-on-surface-variant border border-outline-variant/50">
              ?
            </div>
          )}
          <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
            {deal.company?.name || "No Company"}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-outline-variant/30 pt-3 mt-2">
          {deal.expectedCloseDate ? (
            <span
              className={`font-label-sm text-label-sm flex items-center gap-1 ${
                isOverdue ? "text-error font-medium bg-error-container/30 px-1.5 py-0.5 rounded" : "text-on-surface-variant/70"
              }`}
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
              </svg>
              {formatDate(deal.expectedCloseDate)}
            </span>
          ) : (
            <span className="font-label-sm text-label-sm text-on-surface-variant/70">
              No date
            </span>
          )}
          {deal.assignee && (
            <div className="w-6 h-6 rounded-full border border-surface bg-surface-container-highest flex items-center justify-center text-[10px] font-bold text-on-surface-variant">
              {getInitials(deal.assignee.name || "User")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
