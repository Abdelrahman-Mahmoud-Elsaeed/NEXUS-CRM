import { Loader2 } from "lucide-react";

export function ContactsLoading() {
  return (
    <main className="mt-header-height md:ml-sidebar-width flex flex-col items-center justify-center min-h-[70vh] bg-background gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground animate-pulse">
        Loading contacts from database...
      </p>
    </main>
  );
}