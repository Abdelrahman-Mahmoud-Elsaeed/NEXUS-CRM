/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnConfig } from "@/shared/ui/resource/resource-table";
import { ContactStatusBadge } from "./ContactStatusBadge";
import { ContactChannels } from "./ContactChannels";
import { ContactActionMenu  } from "./ContactActionMenu";
import type { Role } from "@/modules/auth/types/auth.types";

interface ColumnBuilderProps {
  role: Role ;
  handleMenuDispatch: (actionType: string, contactId: string) => void;
}

// Converted to a builder function to safely provide runtime parent handler contexts
export const getContactColumns = ({
  role,
  handleMenuDispatch,
}: ColumnBuilderProps): ColumnConfig<any>[] => [
  {
    header: "Name",
    render: (contact) => {
      const displayName = contact.name || "Unknown Contact";
      const fallbackUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        displayName,
      )}`;
      return (
        <div className="flex items-center gap-3">
          <img
            src={contact.avatarUrl || fallbackUrl}
            className="w-10 h-10 rounded-xl object-cover bg-surface-container-high shrink-0 select-none"
            alt=""
          />
          <div className="flex flex-col min-w-0">
            <span className="font-medium text-on-background tracking-tight truncate max-w-[180px]">
              {displayName}
            </span>
            {contact.jobTitle && (
              <span className="text-on-surface-variant text-[12px] truncate max-w-[160px]">
                {contact.jobTitle}
              </span>
            )}
          </div>
        </div>
      );
    },
  },
  {
    header: "Company",
    cellAlignment: "center",
    render: (contact) => {
      const hasCompany =
        contact.company &&
        typeof contact.company === "string" &&
        contact.company.trim() !== "";
      return hasCompany ? (
        <span className="inline-flex items-center px-2.5 py-1 bg-surface-container-high border border-outline-variant text-on-surface rounded-md font-medium text-xs select-none">
          {contact.company}
        </span>
      ) : (
        <span className="text-outline/60 text-sm font-medium select-none">
          -
        </span>
      );
    },
  },
  {
    header: "Omnichannel Channels",
    cellAlignment: "center",
    render: (contact) => {
      const channels = contact.channels || [];
      return channels.length > 0 ? (
        <div className="inline-flex justify-center">
          <ContactChannels channels={channels} />
        </div>
      ) : (
        <span className="text-outline/60 text-sm font-medium select-none">
          -
        </span>
      );
    },
  },
  {
    header: "Status",
    cellAlignment: "center",
    render: (contact) => (
      <div className="inline-flex justify-center">
        <ContactStatusBadge status={contact.status || "Prospect"} />
      </div>
    ),
  },
  {
    header: "Actions",
    cellAlignment: "right",
    render: (contact) => (
      <ContactActionMenu
        contactId={contact.id}
        context="list"
        userRole={role }
        onAction={handleMenuDispatch}
      />
    ),
  },
];
