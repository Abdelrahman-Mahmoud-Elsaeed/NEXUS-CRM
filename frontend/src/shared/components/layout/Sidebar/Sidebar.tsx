import { SidebarItem } from "@/shared/ui/sidebar-item";
import { Button } from "@/shared/ui/button"; // Standard shadcn element primitive path
import {
  LayoutDashboard,
  Users,
  Handshake,
  BarChart3,
  Settings,
  Plus,
  LayoutGrid,
  LogOut,
} from "lucide-react";

export function Sidebar() {
  return (
    <aside className="w-65 h-screen bg-surface-container-low dark:bg-surface-container-lowest border-r border-outline-variant dark:border-outline flex flex-col py-8 z-50 select-none font-sans">
      <div className="flex items-center  gap-2 pl-5 mb-6">
        <LayoutGrid className="h-5 w-5 text-primary fill-primary" />
        <span className=" text-1xl font-black text-primary tracking-tight">
          Nexus CRM
        </span>
      </div>

      <nav className="flex-1 space-y-1">
        <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/" />
        <SidebarItem icon={Users} label="Contacts" to="/contacts" />
        <SidebarItem icon={Handshake} label="Deals" to="/deals" />
        <SidebarItem icon={BarChart3} label="Analytics" to="/analytics" />
        <SidebarItem icon={Settings} label="Settings" to="/settings" />
      </nav>

      <div className="px-6 mt-auto">
        <Button className="w-full py-2.5 px-4 bg-primary  rounded-lg flex items-center justify-center gap-2 hover:bg-primary-container transition-all border-none shadow-none">
          <Plus className="h-5 w-5 shrink-0" />
          New Record
        </Button>

        <div className="mt-6 flex items-center justify-between border-t border-outline-variant pt-6">
          <div className="flex items-center gap-3 min-w-0">
            <img
              alt="CRM Admin"
              className="w-8 h-8 rounded-full bg-surface-container-highest object-cover shrink-0"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDb2Lx7-DJwqLmfmvoBd1t1JWPz74Qb5XWRf8i8JpCbiVUw2h4_2sTyX5acIzDxukKBML5_8e21ePa7BRDeYScNmigvZN4H5IIkbRwv-mg4XFMM6ZqtZgu2j4JG9rhpOeXYYASE6m8IrVBPleVjl1AL8uLBwd6lFX8MqnPYRbG36jfh3Gjr8lTryoAII3l_OpxLKlp_9umVNYPEi1xCLIVpUXJtSxc4oFFVP1LIK2GaKrgG2b0noqkAZO69AJNjAoTEhoWMM-m1OUvO"
            />
            <div className="overflow-hidden">
              <p className="font-label-md text-label-md text-on-surface truncate font-semibold leading-tight">
                CRM Admin
              </p>
              <p className="text-[11px] text-on-surface-variant truncate leading-none mt-0.5">
                admin@nexus.com
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              console.log("User logging out...");
            }}
            className="text-on-surface-variant hover:text-error h-8 w-8 rounded-md hover:bg-surface-container-high/50 shrink-0 transition-colors duration-150"
          >
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Log out</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}
