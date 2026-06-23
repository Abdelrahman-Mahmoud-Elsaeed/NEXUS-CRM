import * as React from "react";
import { cn } from "@/shared/utils/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

export interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;               // Added for screen reader / explicit title
  description?: string;         // Added for screen reader / explicit description
  headerContent?: React.ReactNode;
  footerContent?: React.ReactNode;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
  className?: string;
}

export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  headerContent,
  footerContent,
  onSubmit,
  children,
  className,
}: FormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={cn(
          "p-0 bg-surface-container-lowest max-w-4xl max-h-230.25 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden gap-0 border-none",
          className
        )}
      >
        {/* Accessibility Safeguards */}
        {title ? (
          <DialogTitle className="sr-only">{title}</DialogTitle>
        ) : (
          <DialogTitle asChild>
            <VisuallyHidden.Root>Form Dialog Window</VisuallyHidden.Root>
          </DialogTitle>
        )}

        {description ? (
          <DialogDescription className="sr-only">{description}</DialogDescription>
        ) : (
          <DialogDescription asChild>
            <VisuallyHidden.Root>Please fill out the form fields inside this modal overlay.</VisuallyHidden.Root>
          </DialogDescription>
        )}

        <DialogHeader className="px-6 py-4 border-b border-outline-variant flex flex-row items-center justify-between bg-white space-y-0">
          <div className="flex items-center gap-4 text-left">
            {headerContent}
          </div>
        </DialogHeader>

        <form 
          onSubmit={onSubmit} 
          className="flex-1 flex flex-col overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto modal-scrollbar p-6 space-y-8 bg-surface/30">
            {children}
          </div>

          {footerContent && (
            <div className="px-6 py-4 bg-white border-t border-outline-variant flex justify-end items-center gap-3 space-x-0">
              {footerContent}
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}