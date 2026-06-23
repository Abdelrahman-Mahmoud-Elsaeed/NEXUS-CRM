import type { CompanyStatus } from "../types/company.types";

export function CompanyStatusBadge({ status }: { status: CompanyStatus }) {
  const styles = {
    Active: "bg-secondary-container/30 text-primary-fixed-variant border-secondary-container/50",
    Inactive: "bg-surface-variant text-on-surface-variant border-outline-variant",
    Lead: "bg-blue-100 text-blue-800 border-blue-200",
    Customer: "bg-purple-100 text-purple-800 border-purple-200",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
      {status}
    </span>
  );
}
