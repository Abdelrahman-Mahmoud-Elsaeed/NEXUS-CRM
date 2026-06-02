import { Users, Layers, Info, ExternalLink } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/utils/utils";
import { useRolesView } from "../hooks/useRolesView";

export default function RolesView() {
  const { rolesList, selectedRole, onSelectRole } = useRolesView();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-6">
        
        {/* Left Parameter: Roles Sidebar Selector Navigation Deck */}
        <div className="col-span-12 lg:col-span-4 space-y-3">
          <h4 className="font-label-md text-on-surface font-bold px-1 mb-2">Available Roles</h4>
          
          {rolesList.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            return (
              <div
                key={role.id}
                onClick={() => onSelectRole(role.id)}
                className={cn(
                  "p-4 border rounded-xl cursor-pointer transition-all duration-150  text-left",
                  isSelected
                    ? "bg-primary-container/10 border-primary shadow-sm"
                    : "bg-surface-container-lowest border-outline-variant hover:border-primary/40 hover:bg-surface-container-low/60"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <Icon className={cn("h-5 w-5", isSelected ? "text-primary" : "text-on-surface-variant")} />
                  {role.isSystemDefault && (
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded uppercase tracking-wide">
                      System Default
                    </span>
                  )}
                </div>
                <h5 className="font-label-md text-on-surface font-bold">{role.name}</h5>
                <p className="font-body-sm text-on-surface-variant mt-1 leading-relaxed text-[13px]">
                  {role.description}
                </p>
                <div className={cn("mt-4 flex items-center gap-2 font-label-sm text-[12px]", isSelected ? "text-primary font-semibold" : "text-on-surface-variant")}>
                  <Users className="h-3.5 w-3.5" />
                  <span>{role.userCount} Users assigned</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Parameter: Permissions Settings Dashboard Deck Configuration Matrix */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-outline-variant flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-low/30">
              <div>
                <h4 className="text-lg font-bold text-on-surface">
                  Permissions for Workspace Admin
                </h4>
                <p className="font-body-sm text-on-surface-variant text-[13px] mt-0.5">
                  Modifying system default roles is restricted to core security settings.
                </p>
              </div>
              <Button variant="outline" className="h-auto py-2 px-4 border border-outline-variant text-on-surface font-label-md rounded-xl hover:bg-surface-container shadow-none">
                Discard Changes
              </Button>
            </div>

            <div className="p-6 space-y-8">
              {/* Module: CRM Core Setup View Layer */}
              <div>
                <div className="flex items-center gap-2 mb-3 border-b border-outline-variant/10 pb-2">
                  <Layers className="h-4 w-4 text-primary" />
                  <h6 className="font-label-sm text-[11px] text-on-surface font-black uppercase tracking-wider">
                    CRM Core Operations
                  </h6>
                </div>
                <div className="space-y-1">
                  <PermissionRow title="View Analytics" description="Allow user to see global and individual performance metrics." checked disabled />
                  <PermissionRow title="Manage Deals" description="Create, edit, and move deals across the pipeline." checked />
                  <PermissionRow title="Delete Records" description="Permanently remove contacts, deals, or companies." checked />
                </div>
              </div>

              {/* Module: Workspace Management View Layer */}
              <div>
                <div className="flex items-center gap-2 mb-3 border-b border-outline-variant/10 pb-2">
                  <Users className="h-4 w-4 text-secondary" />
                  <h6 className="font-label-sm text-[11px] text-on-surface font-black uppercase tracking-wider">
                    Team Management
                  </h6>
                </div>
                <div className="space-y-1">
                  <PermissionRow title="Invite Members" description="Send email invitations to new workspace collaborators." checked />
                  <PermissionRow title="Modify Roles" description="Change permission levels for existing team members." checked />
                  <PermissionRow title="Billing Access" description="View invoices and manage subscription payment methods." checked />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-surface-container/40 border-t border-outline-variant flex justify-end">
            <Button className="px-6 py-2 bg-primary text-on-primary font-label-md rounded-xl hover:bg-primary/95 transition-all shadow-none h-auto">
              Save Configuration
            </Button>
          </div>
        </div>

      </div>

      {/* Dynamic Informative Footing Guide Card Module */}
      <div className="p-5 bg-surface-container-low border border-outline-variant rounded-xl flex items-start gap-4 shadow-sm">
        <div className="p-2.5 bg-secondary-container/20 text-secondary rounded-full shrink-0">
          <Info className="h-5 w-5" />
        </div>
        <div>
          <h5 className="font-label-md text-on-surface font-bold">Understanding Permission Scopes</h5>
          <p className="font-body-base text-on-surface-variant text-[13px] mt-1 max-w-3xl leading-relaxed">
            Permissions are additive. If a user is assigned multiple roles, they will receive the union of all permissions granted across those roles. System Default roles like Workspace Admin cannot be deleted to ensure workspace stability.
          </p>
          <a className="mt-3 inline-flex items-center gap-1 text-primary font-label-sm text-[13px] font-semibold hover:underline" href="#scopes">
            <span>Learn more about role hierarchy</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
}

/* Internal Reusable Switch Checkbox Custom Component */
function PermissionRow({ title, description, checked, disabled = false }: { title: string; description: string; checked?: boolean; disabled?: boolean }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-container-low/40 transition-all">
      <div className="pr-4">
        <p className="font-label-md text-on-surface font-semibold text-sm">{title}</p>
        <p className="font-body-sm text-on-surface-variant text-[12px] mt-0.5 leading-normal">{description}</p>
      </div>
      <label className={cn("relative inline-flex items-center cursor-pointer  shrink-0", disabled && "opacity-50 pointer-events-none")}>
        <input type="checkbox" defaultChecked={checked} disabled={disabled} className="sr-only peer" />
        <div className="w-9 h-5 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-surface after:border-outline-variant after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary peer-checked:after:border-primary"></div>
      </label>
    </div>
  );
}

