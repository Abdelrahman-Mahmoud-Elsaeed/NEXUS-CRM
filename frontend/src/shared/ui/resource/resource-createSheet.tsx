import * as React from "react";
import { AlertCircle } from "lucide-react";
// 1. Import SheetDescription from your local sheet primitives file
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "../sheet";
import { Button } from "../button";

interface ResourceCreateSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  formId: string;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  apiError?: string | null;
  children: React.ReactNode;
}

export function ResourceCreateSheet({
  isOpen,
  onClose,
  title,
  formId,
  onSubmit,
  isSubmitting,
  apiError,
  children,
}: ResourceCreateSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="top-0 right-0 h-full w-full max-w-[600px] p-0 bg-white shadow-lg flex flex-col overflow-hidden border-l border-outline-variant">
        
        <SheetHeader className="h-16 px-6 border-b border-outline-variant flex flex-row items-center justify-between bg-white shrink-0 space-y-0">
          <div className="flex flex-col">
            <SheetTitle className="text-[18px] font-bold text-on-surface">{title}</SheetTitle>
            {/* 2. Added screen-reader only description to satisfy Radix UI accessibility constraints */}
            <SheetDescription className="sr-only">
              Form container panel for creating a new {title.toLowerCase()} resource record.
            </SheetDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full h-9 w-9 flex items-center justify-center text-on-surface-variant"
          >
          </Button>
        </SheetHeader>

        <form
          onSubmit={onSubmit}
          className="space-y-6 flex-1 overflow-y-auto p-6"
          id={formId}
        >
          {apiError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
              <div className="space-y-1">
                <h4 className="text-[14px] font-bold text-red-800">Submission Failure</h4>
                <p className="text-[13px] text-red-700 leading-relaxed">{apiError}</p>
              </div>
            </div>
          )}

          {children}
        </form>

        <footer className="h-20 px-6 border-t border-outline-variant flex items-center justify-end gap-3 bg-white shrink-0">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg text-[14px]"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form={formId}
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-[#3525cd] hover:bg-[#4f46e5] text-white font-medium rounded-lg text-[14px] flex items-center gap-2 shadow-sm"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              "Create Record"
            )}
          </Button>
        </footer>

      </SheetContent>
    </Sheet>
  );
}