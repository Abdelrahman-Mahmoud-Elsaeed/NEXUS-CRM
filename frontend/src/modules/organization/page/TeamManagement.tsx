import { useState } from "react";
import { cn } from "@/shared/utils/utils";

import MembersView from "../components/MembersView";
import InvitationsView from "../components/InvitationsView";
import { useOrganizationData } from "../hooks/useOrganization";

export type TabID = "members" | "invitations" ;

interface TabConfig {
  id: TabID;
  label: string;
  count?: number;
}



const TAB_COMPONENTS: Record<TabID, React.ComponentType> = {
  members: MembersView,
  invitations: InvitationsView,
};

export default function TeamManagement() {
  const { invitations } = useOrganizationData();
  const invitationCount = invitations.length;
  const tabs: TabConfig[] = [
    { id: "members", label: "Members" },
    { id: "invitations", label: "Invitations", count: invitationCount },
  ];
  const [activeTab, setActiveTab] = useState<TabID>("members");
  
  const ActiveView = TAB_COMPONENTS[activeTab];

  return (
    <main className="bg-surface-bright font-sans  antialiased">
      <div className="p-6 md:p-8 space-y-6">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
          <div>
            <h2 className="text-3xl font-black text-on-surface tracking-tight">
              Team & Access
            </h2>
            <p className="font-body-base text-on-surface-variant mt-1.5">
              Manage your team members and define fine-grained access control.
            </p>
          </div>

        </div>

        <div className="flex gap-8 mt-5 border-b border-outline-variant relative">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "pb-4 font-label-md text-label-md relative transition-all duration-150 outline-none",
                  isActive ? "text-primary font-bold" : "text-on-surface-variant hover:text-primary"
                )}
              >
                <span className="flex items-center gap-2">
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className="px-2 py-0.5 bg-tertiary-container text-on-tertiary-fixed text-[10px] font-bold rounded-full">
                      {tab.count}
                    </span>
                  )}
                </span>
                
                {isActive && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary animate-in fade-in layout" />
                )}
              </button>
            );
          })}
        </div>

        <div className="pt-2">
          <ActiveView />
        </div>

      </div>
    </main>
  );
}