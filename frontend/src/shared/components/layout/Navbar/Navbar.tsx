import { Input } from "@/shared/ui/input"; // Standard shadcn structural input path
import { Button } from "@/shared/ui/button"; // Standard shadcn button primitive path
import {
  Search,
  Bell,
  HelpCircle,
  Grid,
  CheckSquare,
  PlusCircle,
  History,
  Menu,
  X,
} from "lucide-react";
import { OrganizationSwitcher } from "@/modules/organization/components/organizationSwitcher";
import { useState } from "react";

export function Navbar() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <header className="h-16 bg-surface dark:bg-background border-b border-outline-variant dark:border-outline flex justify-between items-center px-6 lg:px-8 z-40 font-sans  shrink-0">
      
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="md:hidden text-on-surface-variant hover:text-primary transition-all duration-150 h-9 w-9 rounded-md hover:bg-surface-container-high/40 shrink-0"
          aria-label="Toggle Sidebar Menu"
        >
          
          {isSidebarOpen ? (
            <X className="h-5 w-5 transition-transform duration-200 rotate-0" />
          ) : (
            <Menu className="h-5 w-5 transition-transform duration-200 rotate-0" />
          )}
        </Button>

        <div className="hidden md:flex flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline h-5 w-5" />
          <Input
            type="text"
            id="global-search"
            placeholder="Search contacts, deals, companies..."
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            className="w-full pl-10 pr-4 py-2 bg-surface-container-highest border border-outline-variant rounded-full font-body-base text-body-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all shadow-none h-auto"
          />

          {/* Search Result Overlay Filter List Dropdown */}
          {isSearchFocused && (
            <div className="absolute top-[110%] left-0 w-full bg-surface border border-outline-variant rounded-xl shadow-lg z-50 py-2 animate-in fade-in duration-200">
              <div className="px-4 py-2">
                <p className="font-label-sm text-label-sm text-outline uppercase mb-2 tracking-wider">
                  Recent Searches
                </p>
                <ul className="space-y-1">
                  <li className="flex items-center gap-2 hover:bg-surface-container-high px-2 py-1.5 rounded-lg cursor-pointer text-on-surface font-body-base text-body-base transition-colors">
                    <History className="h-4 w-4 text-outline" />
                    Enterprise Deals Q3
                  </li>
                  <li className="flex items-center gap-2 hover:bg-surface-container-high px-2 py-1.5 rounded-lg cursor-pointer text-on-surface font-body-base text-body-base transition-colors">
                    <History className="h-4 w-4 text-outline" />
                    John Smith
                  </li>
                </ul>
              </div>

              <div className="border-t border-outline-variant px-4 py-2 mt-2">
                <p className="font-label-sm text-label-sm text-outline uppercase mb-2 tracking-wider">
                  Quick Actions
                </p>
                <ul className="space-y-1">
                  <li className="flex items-center gap-2 hover:bg-surface-container-high px-2 py-1.5 rounded-lg cursor-pointer text-primary font-body-base text-body-base transition-colors">
                    <PlusCircle className="h-4 w-4" />
                    Add new contact
                  </li>
                  <li className="flex items-center gap-2 hover:bg-surface-container-high px-2 py-1.5 rounded-lg cursor-pointer text-primary font-body-base text-body-base transition-colors">
                    <CheckSquare className="h-4 w-4" />
                    Create task
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right side contextual navigation links configuration utility nodes */}
      <div className="flex items-center gap-4 lg:gap-6">
        <div className="flex items-center gap-1 sm:gap-4">
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

        <OrganizationSwitcher />
      </div>
    </header>
  );
}