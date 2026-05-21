import { Input } from "@/shared/ui/input";   // Standard shadcn structural input path
import { Button } from "@/shared/ui/button"; // Standard shadcn button primitive path
import { Search, Bell, HelpCircle, Grid } from "lucide-react";
import { OrganizationSwitcher } from "@/modules/organization/components/organizationSwitcher";

export function Navbar() {
  return (
    <header className="h-[64px]  bg-surface dark:bg-background border-b border-outline-variant dark:border-outline flex justify-between items-center px-8 z-40 font-sans select-none shrink-0">
      
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4" />
          <Input 
            className="w-full h-10 pl-10 bg-surface-container-lowest border border-outline-variant rounded-lg  font-body-base text-body-base text-on-surface placeholder:text-outline focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 transition-all duration-200 shadow-none" 
            placeholder="Search deals, contacts, or reports..." 
            type="search" 
          />
        </div>
      </div>
      
      {/* Action Utilities Tray & Profiling Node */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-on-surface-variant hover:text-primary transition-all duration-150 h-9 w-9 rounded-md hover:bg-surface-container-high/40"
          >
            <Bell className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-on-surface-variant hover:text-primary transition-all duration-150 h-9 w-9 rounded-md hover:bg-surface-container-high/40"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-on-surface-variant hover:text-primary transition-all duration-150 h-9 w-9 rounded-md hover:bg-surface-container-high/40"
          >
            <Grid className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="h-8 w-px bg-outline-variant"></div>
        
        <OrganizationSwitcher></OrganizationSwitcher>
      </div>
      
    </header>
  );
}