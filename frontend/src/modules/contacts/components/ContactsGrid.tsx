/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pencil, Send, ChevronsDown } from "lucide-react";
import { ContactChannels } from "./ContactChannels";
import { ContactActionMenu } from "./ContactActionMenu";
import { Role } from "@/modules/auth/types/auth.types";

interface ContactsGridProps {
  contacts: any[];
  visibleLimit: number;
  totalRecords: number;
  onLoadMore: () => void;
  role: Role;
  handleMenuDispatch: (actionType: string, contactId: string) => void;
}

export function ContactsGrid({
  contacts,
  visibleLimit,
  totalRecords,
  onLoadMore,
  role,
  handleMenuDispatch,
}: ContactsGridProps) {
  const visibleContacts = contacts.slice(0, visibleLimit);

  const getStatusClasses = (status: string = "") => {
    switch ((status || "").toLowerCase()) {
      case "active":
        return "bg-primary/10 text-primary border-primary";
      case "prospect":
        return "bg-secondary-container/30 text-secondary border-secondary";
      default:
        return "bg-surface-container-highest text-on-surface-variant border-outline";
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {visibleContacts.map((contact) => {
          const displayName = contact.name || "Unknown Contact";
          const dicebearFallbackUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}`;
          const hasChannels = contact.channels && contact.channels.length > 0;

          return (
            <div
              key={contact.id}
              className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 flex flex-col hover:border-primary/50 transition-colors group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-surface-container border border-outline-variant/50 flex items-center justify-center text-primary font-h3 overflow-hidden">
                    <img
                      src={contact.avatarUrl || dicebearFallbackUrl}
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors">
                      {displayName}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`px-2 py-0.5 rounded-[2px] font-label-sm text-[11px] uppercase tracking-wide border ${getStatusClasses(contact.status)}`}
                      >
                        {contact.status || "Prospect"}
                      </span>
                      {contact.role && (
                        <span className="font-body-sm text-body-sm text-outline">
                          {contact.role}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="absolute top-2 right-2">
                  <ContactActionMenu
                    contactId={contact.id}
                    context="grid"
                    userRole={role || Role.Member}
                    onAction={handleMenuDispatch}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-outline-variant/30 mb-4">
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">
                    Company
                  </p>
                  <p className="font-h3 text-h3 text-on-surface truncate max-w-[120px]">
                    {contact.company || "—"}
                  </p>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">
                    Last Active
                  </p>
                  <p className="font-h3 text-h3 text-on-surface">
                    {contact.lastActive || "Just now"}
                  </p>
                </div>
              </div>

              <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center">
                  {hasChannels && (
                    <div className="px-2.5 py-1.5 bg-surface-container-low rounded-lg border border-outline-variant/40 inline-block">
                      <ContactChannels channels={contact.channels} />
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleMenuDispatch("edit", contact.id)}
                    className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors flex items-center justify-center"
                    type="button"
                  >
                    <Pencil size={20} />
                  </button>
                  <button 
                    onClick={() => handleMenuDispatch("send_message", contact.id)}
                    className="p-2 bg-primary/5 text-primary hover:bg-primary hover:text-on-primary rounded-lg transition-all flex items-center justify-center"
                    type="button"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {visibleLimit < contacts.length && (
        <div className="mt-12 flex flex-col items-center justify-center">
          <button
            onClick={onLoadMore}
            className="px-8 py-3 bg-surface-container-low border border-outline-variant text-on-surface font-label-md rounded-xl hover:bg-surface-container transition-all flex items-center group shadow-sm gap-2"
          >
            Load More Contacts
            <ChevronsDown
              size={18}
              className="group-hover:translate-y-0.5 transition-transform"
            />
          </button>
          <p className="text-[12px] text-outline mt-4">
            Showing {visibleContacts.length} of {totalRecords} premium contacts
          </p>
        </div>
      )}
    </div>
  );
}
