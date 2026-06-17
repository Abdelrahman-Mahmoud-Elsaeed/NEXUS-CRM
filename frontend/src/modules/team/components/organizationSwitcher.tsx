import { ChevronDown, Check, Loader2 } from "lucide-react";
import { cn } from "@shared/utils/utils";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { useOrganizationSwitcher } from "../hooks/useOrganizationSwitcher";

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
      <Button 
        variant="outline" 
        disabled 
        className="flex items-center gap-2 rounded-full px-3 py-1.5 h-auto bg-surface-container border border-outline-variant"
      >
        <Loader2 className="h-4 w-4 animate-spin text-outline" />
        <span className="font-label-md text-label-md">Loading Workspace...</span>
      </Button>
    );
  }

  return (
    <DropdownMenu onOpenChange={setIsOpen}>

      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-high border border-outline-variant rounded-full hover:bg-surface-container-highest transition-colors group outline-none focus-visible:ring-2 focus-visible:ring-primary/20">
          
          <img
            alt={`${currentOrg.name} Logo`}
            className="w-6 h-6 rounded-full object-cover border border-outline-variant"
            src={
              currentOrg.avatar || 
              `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentOrg.name)}`
            }
          />

          <span className="font-label-md text-label-md text-on-surface truncate max-w-25">
            {currentOrg.name}
          </span>
          
          <ChevronDown
            className={cn(
              "h-4.5 w-4.5 text-outline group-hover:text-primary transition-colors duration-200 shrink-0",
              isOpen && "rotate-180"
            )}
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-64 bg-surface border border-outline-variant rounded-xl shadow-lg z-50 py-2 animate-in fade-in duration-200"
      >

        <div className="px-4 py-2">
          <DropdownMenuLabel className="font-label-sm text-label-sm text-outline uppercase tracking-wider mb-2 p-0 font-normal ">
            Current Workspace
          </DropdownMenuLabel>
          <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-primary/10 text-left outline-none cursor-default">
            <span className="font-label-md text-label-md text-primary font-semibold truncate max-w-45">
              {currentOrg.name}
            </span>
            <Check className="h-4.5 w-4.5 text-primary shrink-0" />
          </button>
        </div>

        <div className="px-4 py-2">
          <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider mb-2 ">
            Switch Workspace {isLoading && "..."}
          </p>
          <div className="space-y-1max-h-[160px] overflow-y-auto project-scrollbar">
            {organizations
              .filter((org) => org.id !== currentOrg.id)
              .map((org) => (
                <DropdownMenuItem
                  key={org.id}
                  onSelect={() => handleSelectOrganization(org.id)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-surface-container-high focus:bg-surface-container-high transition-colors font-body-base text-body-base text-on-surface cursor-pointer focus:outline-none"
                >
                  <span className="truncate">{org.name}</span>
                </DropdownMenuItem>
              ))}
          </div>
        </div>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}