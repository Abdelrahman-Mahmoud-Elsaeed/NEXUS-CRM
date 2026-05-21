import { Link, useLocation } from "react-router-dom";
import { cn } from "@shared/utils/utils";
import { type LucideIcon } from "lucide-react";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  to: string;
}

export function SidebarItem({ icon: Icon, label, to }: SidebarItemProps) {
  const location = useLocation();
  const isActive = location.pathname === to;
  console.log(to)
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center px-6 py-3 transition-colors duration-200 ease-in-out",
        isActive
          ? "text-primary dark:text-primary-fixed-dim font-bold border-l-2 border-primary dark:border-primary-fixed-dim bg-primary-container/10"
          : "text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-container hover:text-on-surface"
      )}
    >
      <Icon 
        className={cn(
          "mr-3 h-5 w-5 shrink-0 transition-colors duration-200",
          isActive 
            ? "text-primary dark:text-primary-fixed-dim" 
            : "text-on-surface-variant dark:text-surface-variant"
        )} 
      />
      <span className="font-body-base text-body-base">
        {label}
      </span>
    </Link>
  );
}