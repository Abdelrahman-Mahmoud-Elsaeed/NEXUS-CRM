import { Link, useLocation } from "react-router-dom";
import { cn } from "@shared/utils/utils";
import { Button } from "@/shared/ui/button";
import {
  LayoutGrid,
  Inbox,
  Share2,
  LayoutDashboard,
  Users,
  Building2,
  Handshake,
  CheckSquare,
  Calendar,
  BarChart3,
  FileText,
  Folder,
  Settings,
  MoreVertical,
  LogOut,
  Sparkles,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

export function Sidebar() {
  const location = useLocation();

  // Helper utility to calculate sub-route matches safely
  const checkIsActive = (to: string) => {
    if (to === "/") {
      return location.pathname === "/";
    }
    return location.pathname === to || location.pathname.startsWith(`${to}/`);
  };

  const getLinkClass = (to: string) => {
    const isActive = checkIsActive(to);
    return cn(
      "flex items-center gap-3 px-3 py-1.5 rounded-lg transition-all duration-200 group w-full text-left",
      isActive
        ? "text-primary dark:text-inverse-primary font-bold bg-primary/10 dark:bg-on-secondary-fixed-variant"
        : "text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-inverse-primary hover:bg-surface-container-high dark:hover:bg-on-surface-variant",
    );
  };

  const getIconClass = (to: string) => {
    const isActive = checkIsActive(to);
    return cn(
      "h-4 w-4 transition-colors shrink-0",
      isActive
        ? "text-primary"
        : "text-on-surface-variant dark:text-surface-variant group-hover:text-primary",
    );
  };
  return (
    <nav className="hidden md:flex h-full bg-surface-container-low dark:bg-inverse-surface flex-col py-2 px-2 w-64  border-outline-variant dark:border-outline z-20 font-sans ">
      {/* Logo Branding — Condensed vertical spacing */}
      <div className="flex items-center gap-2 py-4 px-2 shrink-0">
        <LayoutGrid className="h-7 w-7 text-primary fill-primary" />
        <span className="text-2xl font-black text-primary tracking-tight">
          Nexus CRM
        </span>
      </div>

      {/* Navigation Groups Container — Tighter spacing between groups */}
      <div className="flex-1 overflow-y-auto space-y-3.5 scrollbar-hide pb-2">
        {/* Category: Communications */}
        <div className="space-y-0.5">
          <p className="font-label-sm text-[11px] text-outline px-3 mb-1 uppercase tracking-wider opacity-85">
            Communications
          </p>
          <Link to="/inbox" className={getLinkClass("/inbox")}>
            <Inbox className={getIconClass("/inbox")} />
            <span className="font-label-md text-label-md">Inbox</span>
          </Link>
          <Link to="/integrations" className={getLinkClass("/integrations")}>
            <Share2 className={getIconClass("/integrations")} />
            <span className="font-label-md text-label-md">
              Social Integrations
            </span>
          </Link>
        </div>

        {/* Category: Sales & Relationships */}
        <div className="space-y-0.5">
          <p className="font-label-sm text-[11px] text-outline px-3 mb-1 uppercase tracking-wider opacity-85">
            Sales & Relationships
          </p>
          <Link to="/" className={getLinkClass("/")}>
            <LayoutDashboard className={getIconClass("/")} />
            <span className="font-label-md text-label-md">Dashboard</span>
          </Link>
          <Link to="/contacts" className={getLinkClass("/contacts")}>
            <Users className={getIconClass("/contacts")} />
            <span className="font-label-md text-label-md">Contacts</span>
          </Link>
          <Link to="/companies" className={getLinkClass("/companies")}>
            <Building2 className={getIconClass("/companies")} />
            <span className="font-label-md text-label-md">Companies</span>
          </Link>
          <Link to="/deals" className={getLinkClass("/deals")}>
            <Handshake className={getIconClass("/deals")} />
            <span className="font-label-md text-label-md">Deals</span>
          </Link>
        </div>

        {/* Category: Productivity */}
        <div className="space-y-0.5">
          <p className="font-label-sm text-[11px] text-outline px-3 mb-1 uppercase tracking-wider opacity-85">
            Productivity
          </p>
          <Link to="/tasks" className={getLinkClass("/tasks")}>
            <CheckSquare className={getIconClass("/tasks")} />
            <span className="font-label-md text-label-md">Tasks</span>
          </Link>
          <Link to="/calendar" className={getLinkClass("/calendar")}>
            <Calendar className={getIconClass("/calendar")} />
            <span className="font-label-md text-label-md">Calendar</span>
          </Link>
        </div>

        {/* Category: Insights & Assets */}
        <div className="space-y-0.5">
          <p className="font-label-sm text-[11px] text-outline px-3 mb-1 uppercase tracking-wider opacity-85">
            Insights & Assets
          </p>
          <Link to="/analytics" className={getLinkClass("/analytics")}>
            <BarChart3 className={getIconClass("/analytics")} />
            <span className="font-label-md text-label-md">Analytics</span>
          </Link>
          <Link to="/reports" className={getLinkClass("/reports")}>
            <FileText className={getIconClass("/reports")} />
            <span className="font-label-md text-label-md">Reports</span>
          </Link>
          <Link to="/files" className={getLinkClass("/files")}>
            <Folder className={getIconClass("/files")} />
            <span className="font-label-md text-label-md">File Manager</span>
          </Link>
        </div>

        {/* Category: Team & Management */}
        <div className="space-y-0.5">
          <p className="font-label-sm text-[11px] text-outline px-3 mb-1 uppercase tracking-wider opacity-85">
            Team & Management
          </p>
          <Link
            to="/organization/team"
            className={getLinkClass("/organization/team")}
          >
            <Users className={getIconClass("/organization/team")} />
            <span className="font-label-md text-label-md">Team & Access</span>
          </Link>
          <Link to="/settings" className={getLinkClass("/settings")}>
            <Settings className={getIconClass("/settings")} />
            <span className="font-label-md text-label-md">Settings</span>
          </Link>
        </div>
      </div>

      {/* Sidebar Footer context action frame — Tightened parameters */}
      <div className="mt-auto space-y-1.5 pt-2 border-t border-outline-variant dark:border-outline bg-surface-container-low dark:bg-inverse-surface shrink-0">
        {/* Plan Booster Button Utility */}
        <div className="px-1">
          <Button className="w-full bg-primary hover:bg-primary/95 text-on-primary py-2 px-4 rounded-xl transition-all border-none shadow-none flex items-center justify-center gap-2 h-auto font-medium">
            <Sparkles className="h-4 w-4 text-on-primary fill-current" />
            <span className="font-label-md text-label-md">Upgrade Plan</span>
          </Button>
        </div>

        {/* User Workspace Account Matrix Dropdown Node */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center gap-3 p-1.5 rounded-xl hover:bg-surface-container-high dark:hover:bg-on-surface-variant transition-colors group outline-none text-left">
              <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center overflow-hidden shrink-0 border border-outline-variant">
                <img
                  alt="User Profile"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjBWlmlKOOy_lG1QYCWjLYfa9sLAsFgr9WMURAjwaKC80XJgWC6p9oJR0W0U1zuXGJMyIWTNQHzAyTaqzolihHdUYq20X45yDa3njr6i3VkiCeR7AYbppYVz-tXA5DhjWFfd2bE8Bx0YwGEOsRgoBDggFLuijf5Ql3NF3OY0zitRZaWRknwOXwVamqhK_L0UZ9unN5GvKhCbind5vNtkYFqnWFtDtO9iuuSAvJiLkqmrlN4xY84Cqm5gvbZTVBMXhhMvAkMOUTOMnr"
                />
              </div>
              <div className="text-left overflow-hidden grow">
                <p className="font-label-md text-label-md font-semibold truncate text-on-surface dark:text-surface-bright leading-tight">
                  User Admin
                </p>
                <p className="font-body-sm text-[11px] text-outline truncate leading-normal mt-0.5">
                  admin@acmecorp.com
                </p>
              </div>
              <MoreVertical className="h-4 w-4 text-outline ml-auto group-hover:text-primary transition-colors shrink-0" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side="top"
            align="start"
            sideOffset={8}
            className="w-56 bg-surface border border-outline-variant rounded-xl shadow-lg z-50 p-1"
          >
            <DropdownMenuLabel className="px-3 py-2">
              <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider  font-medium">
                Account
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 flex items-center gap-2">
                Workspace Admin
                <span className="bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded font-bold tracking-wide">
                  ADMIN
                </span>
              </p>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="bg-outline-variant my-1" />

            <DropdownMenuItem
              onClick={() => console.log("User logging out...")}
              className="flex items-center gap-2 text-error focus:text-error hover:bg-error/10 focus:bg-error/10 px-3 py-2 rounded-lg cursor-pointer transition-colors"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span className="font-label-md text-label-md">Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
