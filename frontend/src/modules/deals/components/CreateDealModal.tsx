import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import type { CreateDealPayload } from "../types/deal.types";

interface CreateDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateDealPayload) => Promise<{ success: boolean; msg?: string }>;
}

export function CreateDealModal({ isOpen, onClose, onSubmit }: CreateDealModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      value: "",
      currency: "USD",
      status: "Open",
      expectedCloseDate: "",
      notes: "",
      companyId: "",
      primaryContactId: "",
      pipelineId: "",
      stageId: "",
      assignedToId: "",
    },
  });

  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const payload: CreateDealPayload = {
        name: data.name,
        value: data.value ? parseFloat(data.value) : null,
        currency: data.currency || "USD",
        status: data.status || "Open",
        expectedCloseDate: data.expectedCloseDate || null,
        notes: data.notes || null,
        companyId: data.companyId || null,
        primaryContactId: data.primaryContactId || null,
        pipelineId: data.pipelineId || null,
        stageId: data.stageId || null,
        assignedToId: data.assignedToId || null,
      };

      const result = await onSubmit(payload);
      if (result.success) {
        reset();
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Deal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Deal Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Enterprise Software License"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-error">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                type="number"
                placeholder="0.00"
                {...register("value")}
              />
              {errors.value && (
                <p className="text-sm text-error">{errors.value.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                defaultValue="USD"
                {...register("currency")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedCloseDate">Expected Close Date</Label>
            <Input
              id="expectedCloseDate"
              type="date"
              {...register("expectedCloseDate")}
            />
            {errors.expectedCloseDate && (
              <p className="text-sm text-error">{errors.expectedCloseDate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              placeholder="Additional details..."
              {...register("notes")}
            />
            {errors.notes && (
              <p className="text-sm text-error">{errors.notes.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyId">Company ID</Label>
            <Input
              id="companyId"
              placeholder="Select company..."
              {...register("companyId")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stageId">Stage</Label>
            <Input
              id="stageId"
              placeholder="Select stage..."
              {...register("stageId")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignedToId">Assigned To</Label>
            <Input
              id="assignedToId"
              placeholder="Select assignee..."
              {...register("assignedToId")}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Deal"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
