import type { ContactStatus } from "../types/contact.types";

export function ContactStatusBadge({ status }: { status: ContactStatus }) {
  const styles = {
    Active: "bg-secondary-container/30 text-primary-fixed-variant border-secondary-container/50",
    Cold: "bg-surface-variant text-on-surface-variant border-outline-variant",
    Prospect: "bg-blue-100 text-blue-800 border-blue-200",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
      {status}
    </span>
  );
}