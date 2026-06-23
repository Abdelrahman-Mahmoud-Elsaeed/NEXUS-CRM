import { useState } from "react";
import { ResourceCreateSheet } from "@/shared/ui/resource/resource-createSheet";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import type { CreateDealPayload } from "@/modules/deals/types/deal.types";

interface AddDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
  onSubmit: (data: CreateDealPayload) => Promise<{ success: boolean; msg?: string }>;
}

export function AddDealModal({ isOpen, onClose, companyName, onSubmit }: AddDealModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [dealName, setDealName] = useState(`${companyName} - New Deal`);
  const [stage, setStage] = useState("Lead");
  const [value, setValue] = useState("");
  const [expectedCloseDate, setExpectedCloseDate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setApiError(null);
    try {
      const payload: CreateDealPayload = {
        name: dealName,
        value: value ? parseFloat(value) : null,
        currency: "USD",
        status: "Open",
        expectedCloseDate: expectedCloseDate || null,
        notes: null,
        companyId: null,
        primaryContactId: null,
        pipelineId: null,
        stageId: null,
        assignedToId: null,
      };

      const result = await onSubmit(payload);
      if (result.success) {
        onClose();
      } else {
        setApiError(result.msg || "Failed to create deal");
      }
    } catch (err: any) {
      setApiError(err?.message || "Failed to create deal");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ResourceCreateSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Add Deal"
      formId="add-deal-form"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      apiError={apiError}
    >
      <section className="bg-white border border-outline-variant rounded-lg p-6 space-y-6">
        {/* Selected Company */}
        <div className="flex gap-4 p-4 bg-surface-container-low rounded-lg border border-outline-variant">
          <div className="flex-1">
            <Label className="font-label-sm text-on-surface-variant block mb-1">Company</Label>
            <div className="flex items-center gap-2 font-body-base font-semibold text-secondary">
              <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
              </svg>
              {companyName}
            </div>
          </div>
        </div>

        {/* Deal Name */}
        <div>
          <Label htmlFor="dealName" className="font-label-sm text-on-surface-variant block mb-1.5">Deal Name</Label>
          <Input
            id="dealName"
            type="text"
            value={dealName}
            onChange={(e) => setDealName(e.target.value)}
            className="w-full bg-white border border-outline-variant rounded-lg px-4 py-2.5 font-body-base text-on-surface transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Pipeline Stage */}
          <div>
            <Label htmlFor="stage" className="font-label-sm text-on-surface-variant block mb-1.5">Pipeline Stage</Label>
            <div className="relative">
              <select
                id="stage"
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="w-full bg-white border border-outline-variant rounded-lg px-4 py-2.5 font-body-base text-on-surface appearance-none transition-all"
              >
                <option value="Lead">Lead</option>
                <option value="Meeting">Meeting</option>
                <option value="Proposal">Proposal</option>
                <option value="Negotiation">Negotiation</option>
              </select>
              <svg className="w-[20px] h-[20px] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
              </svg>
            </div>
          </div>

          {/* Deal Value */}
          <div>
            <Label htmlFor="value" className="font-label-sm text-on-surface-variant block mb-1.5">Deal Value</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-body-base">$</span>
              <Input
                id="value"
                type="number"
                placeholder="0.00"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full bg-white border border-outline-variant rounded-lg pl-8 pr-4 py-2.5 font-body-base text-on-surface transition-all"
              />
            </div>
          </div>
        </div>

        {/* Expected Close Date */}
        <div>
          <Label htmlFor="expectedCloseDate" className="font-label-sm text-on-surface-variant block mb-1.5">Expected Close Date</Label>
          <div className="relative">
            <Input
              id="expectedCloseDate"
              type="date"
              value={expectedCloseDate}
              onChange={(e) => setExpectedCloseDate(e.target.value)}
              className="w-full bg-white border border-outline-variant rounded-lg px-4 py-2.5 font-body-base text-on-surface transition-all"
            />
            <svg className="w-[20px] h-[20px] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
            </svg>
          </div>
        </div>
      </section>
    </ResourceCreateSheet>
  );
}
