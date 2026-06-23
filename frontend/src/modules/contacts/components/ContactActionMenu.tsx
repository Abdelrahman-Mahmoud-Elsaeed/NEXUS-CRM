/* eslint-disable react-refresh/only-export-components */
import {
  Pencil,
  Send,
  Eye,
  Handshake,
  Trash2,
  Building2,
  Users,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/shared/ui/dropdown-menu";
import { Role } from "@/modules/auth/types/auth.types";




const ALL_MANAGERS: Role[] = [
  Role.Owner,
  Role.Admin,
  Role.SalesManager,
  Role.SupportManager,
  Role.MarketingManager,
  Role.HR,
  Role.Accountant,
];

const ALL_AGENTS_AND_MEMBERS: Role[] = [
  Role.SalesAgent,
  Role.SupportAgent,
  Role.MarketingAgent,
  Role.Member,
];

const ALL_ACTIVE_ROLES: Role[] = [...ALL_MANAGERS, ...ALL_AGENTS_AND_MEMBERS];
const EVERYONE: Role[] = [...ALL_ACTIVE_ROLES, Role.Viewer];

interface ContactActionMenuProps {
  contactId: string;
  context: "list" | "grid";
  userRole: Role;
  onAction?: (actionType: string, contactId: string) => void;
}

export function ContactActionMenu({
  contactId,
  context,
  userRole,
  onAction,
}: ContactActionMenuProps) {
  
  const menuConfig = [
    {
      id: "edit",
      label: "Edit Contact",
      icon: <Pencil size={18} className="text-on-surface-variant" />,
      allowedRoles: ALL_MANAGERS,
      allowedContexts: ["list"],
      isDanger: false,
    },
    {
      id: "send_message",
      label: "Send Message",
      icon: <Send size={18} className="text-on-surface-variant" />,
      allowedRoles: ALL_ACTIVE_ROLES,
      allowedContexts: ["list"],
      isDanger: false,
    },
    {
      id: "view_details",
      label: "View Details",
      icon: <Eye size={18} className="text-on-surface-variant" />,
      allowedRoles: EVERYONE,
      allowedContexts: ["list", "grid"],
      isDanger: false,
    },
    {
      id: "move_deal",
      label: "Move to Deal",
      icon: <Handshake size={18} className="text-on-surface-variant" />,
      allowedRoles: [Role.Owner, Role.Admin, Role.SalesManager, Role.SalesAgent],
      allowedContexts: ["list", "grid"],
      isDanger: false,
    },
    {
      id: "attach_company",
      label: "Attach to Company",
      icon: <Building2 size={18} className="text-on-surface-variant" />,
      allowedRoles: ALL_MANAGERS,
      allowedContexts: ["list", "grid"],
      isDanger: false,
    },
    {
      id: "attach_employee",
      label: "Attach to Employee",
      icon: <Users size={18} className="text-on-surface-variant" />,
      allowedRoles: [...ALL_MANAGERS, Role.SalesAgent],
      allowedContexts: ["list", "grid"],
      isDanger: false,
    },
    {
      id: "delete",
      label: "Delete",
      icon: <Trash2 size={18} />,
      allowedRoles: [Role.Owner, Role.Admin],
      allowedContexts: ["list", "grid"],
      isDanger: true,
    },
  ];

  const safeItems = menuConfig.filter(
    (item) =>
      item.allowedRoles.includes(userRole) &&
      item.allowedContexts.includes(context)
  );

  if (safeItems.length === 0) return null;

  const triggerClassName =
    context === "list"
      ? "p-2 hover:bg-surface-container-high rounded-lg transition-colors text-on-surface-variant"
      : "text-outline hover:text-on-surface transition-colors p-1 rounded-md hover:bg-surface-container";

  return (
    <DropdownMenu key={`${context}-${contactId}`}>
      <DropdownMenuTrigger asChild>
        <button className={triggerClassName} type="button">
          <MoreVertical size={20} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={4}
        className="bg-surface border border-outline-variant rounded-xl shadow-xl w-50 min-w-48 p-1 text-on-surface z-50"
      >
        {safeItems.map((item, index) => {
          const showSeparator = item.isDanger && index > 0;

          return (
            <div key={item.id}>
              {showSeparator && <div className="h-px bg-outline-variant/50 my-1" />}
              <DropdownMenuItem
                onClick={() => onAction?.(item.id, contactId)}
                className={`cursor-pointer flex items-center gap-3 px-4 py-2 text-body-sm rounded-lg transition-colors ${
                  item.isDanger
                    ? "text-error hover:bg-error-container/20"
                    : "hover:bg-surface-container-high"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </DropdownMenuItem>
            </div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}