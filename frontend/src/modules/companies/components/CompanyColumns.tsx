import { type ColumnConfig } from "@/shared/ui/resource/resource-table";
import type { CompanyData } from "../types/company.types";
import { CompanyActionMenu } from "./CompanyActionMenu";
import { Role } from "@/modules/auth/types/auth.types";

interface ColumnOptions {
  role: Role;
  handleMenuDispatch: (actionType: string, companyId: string) => void;
}

export const createCompanyColumns = ({
  role,
  handleMenuDispatch,
}: ColumnOptions): ColumnConfig<CompanyData>[] => [
  {
    header: "Company Name",
    render: (company) => {
      const displayName = company.name || "Unknown Company";
      const fallbackUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}`;

      return (
        <div className="flex items-center gap-3">
          <img
            src={company.logoUrl || fallbackUrl}
            alt=""
            className="w-10 h-10 rounded-xl object-cover bg-surface-container-high shrink-0 select-none"
          />
          <div>
            <div className="font-body-base text-body-base font-semibold text-on-surface">
              {displayName}
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary-container/20 text-on-secondary-fixed-variant">
              {(company.industry || "General").toUpperCase()}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    header: "Total Deals Revenue",
    render: (company) => {
      console.log(company) 
      const revenue = Number(company.totalRevenue ?? company.totalDealValue ?? 0);
      const formatted =
        revenue >= 1_000_000
          ? `$${(revenue / 1_000_000).toFixed(1)}M`
          : revenue >= 1_000
            ? `$${(revenue / 1_000).toFixed(0)}K`
            : `$${revenue}`;
      return (
        <div className="font-table-data text-table-data font-medium">
          {formatted}
        </div>
      );
    },
  },
  {
    header: "Active Deals",
    cellAlignment: "center",
    render: (company) => (
      <div className="flex justify-center">
        <span className="font-table-data text-table-data font-semibold">
          {company.activeDealsCount ?? 0}
        </span>
      </div>
    ),
  },
  {
    header: "Location",
    render: (company) => (
      <div className="font-table-data text-table-data">
        {company.address || "—"}
      </div>
    ),
  },
  {
    header: "Key Contacts",
    cellAlignment: "center",
    render: (company) => {
      const relatedContacts = company.contacts ?? [];
      const visible = relatedContacts.slice(0, 3);
      const remaining = (company.contactsCount ?? relatedContacts.length) - visible.length;

      return (
        <div className="flex justify-center">
          {visible.length === 0 ? (
            <div className="font-table-data text-table-data">—</div>
          ) : (
            <div className="flex -space-x-2 overflow-hidden">
              {visible.map((contact) => {
                const fallback = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(contact.name)}`;
                return (
                  <img
                    key={contact.id}
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-surface object-cover"
                    src={contact.avatarUrl || fallback}
                    alt={contact.name}
                  />
                );
              })}
              {remaining > 0 && (
                <div className="inline-flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-surface bg-surface-container-highest text-[10px] font-bold text-on-surface-variant">
                  +{remaining}
                </div>
              )}
            </div>
          )}
        </div>
      );
    },
  },
  {
    header: "Actions",
    cellAlignment: "right",
    render: (company) => (
      <CompanyActionMenu
        companyId={company.id}
        context="list"
        userRole={role}
        onAction={handleMenuDispatch}
      />
    ),
  },
];
