import { ChevronDown, Check, Plus, Loader2 } from "lucide-react";
import { cn } from "@shared/utils/utils";
import { useOrganizationSwitcher } from "@/modules/organization/hooks/useOrganizationSwitcher";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

export function OrganizationSwitcher() {
  const {
    isOpen,
    setIsOpen,
    currentOrg,
    organizations,
    isLoading,
    handleSelectOrganization,
  } = useOrganizationSwitcher();

  if (!currentOrg) {
    return (
      <Button variant="outline" disabled className="flex items-center gap-2 rounded-full px-3 py-1.5 h-auto bg-surface-container">
        <Loader2 className="h-4 w-4 animate-spin text-outline" />
        <span className="font-label-md text-label-md">Loading Workspace...</span>
      </Button>
    );
  }

  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      {/* Dropdown Action Trigger */}
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 px-3 py-1.5 h-auto rounded-full bg-surface-container hover:bg-surface-container-high border border-outline-variant text-on-surface data-[state=open]:bg-surface-container-high shadow-none font-normal focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <img
            alt={`${currentOrg.name} Logo`}
            className="w-6 h-6 rounded-full object-cover border border-outline-variant"
            src={
              currentOrg.avatar || 
              `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentOrg.name)}`
            }
          />
          <span className="font-label-md text-label-md">{currentOrg.name}</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-on-surface-variant transition-transform duration-200",
              isOpen && "rotate-180",
            )}
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-64 bg-surface rounded-xl border border-outline-variant p-2 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] text-left z-50 overflow-hidden"
      >
        <DropdownMenuLabel className="px-3 py-2 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider select-none font-medium">
          Organizations {isLoading && "..."}
        </DropdownMenuLabel>

        {/* Multi-Tenant Row Iterator */}
        <div className="space-y-1">
          {organizations.map((org) => {
            const isActive = org.id === currentOrg.id;
            const firstLetter = org.name.charAt(0).toUpperCase();

            return (
              <DropdownMenuItem
                key={org.id}
                onSelect={() => handleSelectOrganization(org.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors duration-150 cursor-pointer focus:outline-none",
                  isActive
                    ? "bg-primary-container/10 border-l-2 border-primary text-primary font-bold focus:bg-primary-container/10 focus:text-primary"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface focus:bg-surface-container focus:text-on-surface",
                )}
              >
                {/* 💡 Upgraded to render the Avatar Image inside the rows if it exists */}
                {org.avatar ? (
                  <img
                    alt={`${org.name} Logo`}
                    className="w-8 h-8 rounded-full object-cover border border-outline-variant shrink-0"
                    src={org.avatar}
                  />
                ) : (
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center font-label-md text-label-md font-bold shrink-0 select-none",
                      isActive
                        ? "bg-primary text-on-primary"
                        : "bg-surface-container-high text-on-surface",
                    )}
                  >
                    {firstLetter}
                  </div>
                )}

                {/* Text Metadata */}
                <span
                  className={cn(
                    "grow truncate",
                    isActive
                      ? "font-label-md text-label-md font-bold"
                      : "font-body-base text-body-base",
                  )}
                >
                  {org.name}
                </span>

                {isActive && (
                  <Check className="h-4 w-4 text-primary shrink-0" />
                )}
              </DropdownMenuItem>
            );
          })}
        </div>

        {/* Separator Line */}
        <DropdownMenuSeparator className="bg-outline-variant my-2 -mx-2" />

        {/* Creation Utility Bottom Bar */}
        <DropdownMenuItem
          onSelect={() => console.log("Route layout navigation redirection to workspace initialization screens")}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface focus:bg-surface-container focus:text-on-surface transition-colors duration-150 text-left font-body-base text-body-base font-medium cursor-pointer focus:outline-none"
        >
          <Plus className="h-4 w-4 text-on-surface-variant" />
          <span>New Organization</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}