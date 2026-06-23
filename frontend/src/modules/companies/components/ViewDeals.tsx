import type { DealListItem } from "@/modules/deals/types/deal.types";
import { Dialog, DialogContent } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";

interface ViewDealsProps {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
  deals: DealListItem[];
}

export function ViewDeals({ isOpen, onClose, companyName, deals }: ViewDealsProps) {
  const formatCurrency = (value: string | null) => {
    if (!value) return "$0";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(parseFloat(value));
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStageColor = (stageName: string) => {
    const colors: Record<string, string> = {
      "Negotiation": "bg-primary-fixed text-on-primary-fixed-variant",
      "Proposal": "bg-secondary-container text-on-secondary-container",
      "Discovery": "bg-tertiary-fixed text-on-tertiary-fixed-variant",
      "Qualification": "bg-surface-variant text-on-surface-variant",
    };
    return colors[stageName] || "bg-surface-variant text-on-surface-variant";
  };

  const getProbabilityColor = (stageName: string) => {
    const colors: Record<string, string> = {
      "Negotiation": "bg-primary",
      "Proposal": "bg-secondary",
      "Discovery": "bg-tertiary-container",
      "Qualification": "bg-outline",
    };
    return colors[stageName] || "bg-outline";
  };

  const getProbability = (stageName: string) => {
    const probabilities: Record<string, number> = {
      "Negotiation": 80,
      "Proposal": 60,
      "Discovery": 25,
      "Qualification": 10,
    };
    return probabilities[stageName] || 0;
  };

  const activeDeals = deals.filter((d) => d.status === "Open");
  const closedDeals = deals.filter((d) => d.status !== "Open");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden bg-surface-bright p-0">
        <div className="flex-1 overflow-y-auto p-container-padding bg-surface-bright space-y-6">
          {/* Summary Stats (Bento Style) */}
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-4 glass-card p-6 rounded-xl">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                  </svg>
                </div>
                <span className="text-on-surface-variant font-label-sm text-label-sm">Active Pipeline</span>
              </div>
              <div className="flex flex-col">
                <span className="font-h2 text-h2">{formatCurrency(activeDeals.reduce((sum, d) => sum + (parseFloat(d.value || "0")), 0).toString())}</span>
                <div className="flex items-center gap-1 mt-1">
                  <svg className="w-4 h-4 text-error" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
                  </svg>
                  <span className="text-error font-label-sm text-label-sm">+12% vs last Q</span>
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-4 glass-card p-6 rounded-xl">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-secondary-container/20 rounded-lg">
                  <svg className="w-6 h-6 text-secondary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                  </svg>
                </div>
                <span className="text-on-surface-variant font-label-sm text-label-sm">Win Rate</span>
              </div>
              <div className="flex flex-col">
                <span className="font-h2 text-h2">64.2%</span>
                <div className="flex items-center gap-1 mt-1 text-on-surface-variant">
                  <span className="font-label-sm text-label-sm">Industry Avg: 42%</span>
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-4 glass-card p-6 rounded-xl overflow-hidden relative">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-tertiary-fixed/30 rounded-lg">
                    <svg className="w-6 h-6 text-tertiary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
                    </svg>
                  </div>
                  <span className="text-on-surface-variant font-label-sm text-label-sm">Velocity</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-h2 text-h2">22 Days</span>
                  <span className="text-on-surface-variant font-label-sm text-label-sm mt-1">Average time to close</span>
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-5">
                <svg className="w-[120px] h-[120px]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.38 8.57l-1.23 1.85a8 8 0 0 1-.22 7.58H5.07A8 8 0 0 1 8.8 5.08l.73-1.1A10 10 0 0 0 3.35 19h17.3a10 10 0 0 0-1.27-10.43zm-9.79 6.84a2 2 0 0 0 2.83 0l5.66-8.49-8.49 5.66a2 2 0 0 0 0 2.83z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Main Table Section */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
              <div className="flex gap-4">
                <button className="font-label-md text-label-md text-primary border-b-2 border-primary pb-4">
                  Active Deals ({activeDeals.length})
                </button>
                <button className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface pb-4">
                  Closed Deals ({closedDeals.length})
                </button>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
                  </svg>
                </button>
                <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                  </svg>
                </button>
              </div>
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-surface-container text-on-surface-variant text-left">
                  <th className="px-6 py-3 font-label-sm text-label-sm uppercase tracking-wider">Deal Name</th>
                  <th className="px-6 py-3 font-label-sm text-label-sm uppercase tracking-wider">Stage</th>
                  <th className="px-6 py-3 font-label-sm text-label-sm uppercase tracking-wider text-right">Value</th>
                  <th className="px-6 py-3 font-label-sm text-label-sm uppercase tracking-wider">Probability</th>
                  <th className="px-6 py-3 font-label-sm text-label-sm uppercase tracking-wider">Expected Close</th>
                  <th className="px-6 py-3 font-label-sm text-label-sm uppercase tracking-wider text-right">Owner</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {activeDeals.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-on-surface-variant">
                      No active deals for {companyName}
                    </td>
                  </tr>
                ) : (
                  activeDeals.map((deal) => (
                    <tr key={deal.id} className="group hover:bg-surface-container-low/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors cursor-pointer">
                            {deal.name}
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">New Business</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStageColor(deal.stage?.name || "")}`}>
                          {deal.stage?.name || "Unknown"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-table-data text-table-data text-on-surface font-semibold">
                        {formatCurrency(deal.value)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-full bg-surface-container-highest rounded-full h-1.5 max-w-[100px]">
                          <div className={`${getProbabilityColor(deal.stage?.name || "")} h-1.5 rounded-full`} style={{ width: `${getProbability(deal.stage?.name || "")}%` }}></div>
                        </div>
                        <span className="text-[10px] text-on-surface-variant mt-1">{getProbability(deal.stage?.name || "")}%</span>
                      </td>
                      <td className="px-6 py-4 font-table-data text-table-data text-on-surface-variant">
                        {formatDate(deal.expectedCloseDate)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end">
                          <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-surface-container-lowest bg-primary-container flex items-center justify-center text-[10px] text-white font-bold">
                            {deal.assignee?.name?.split(" ").map((n) => n[0]).join("") || "?"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Section */}
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-body-sm text-body-sm">
              Showing {activeDeals.length} active deals for {companyName}
            </span>
            <div className="flex gap-2">
              <Button variant="outline" disabled className="px-3 py-1 border border-outline-variant rounded hover:bg-surface-container transition-colors disabled:opacity-50">
                Previous
              </Button>
              <Button variant="outline" className="px-3 py-1 border border-outline-variant rounded bg-primary text-on-primary">
                1
              </Button>
              <Button variant="outline" className="px-3 py-1 border border-outline-variant rounded hover:bg-surface-container transition-colors">
                Next
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
