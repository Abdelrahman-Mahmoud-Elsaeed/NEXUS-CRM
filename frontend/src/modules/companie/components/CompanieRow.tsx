/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { MessageSquare, MoreHorizontal } from "lucide-react";
import { CompaniesStatusBadge } from "./CompaniesStatusBadge";
import { CompaniesChannels } from "./CompaniesChannels";
import { cn } from "@/shared/utils/utils";

interface CompaniesRowProps {
  Companies: any;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}

export function CompaniesRow({ Companies, isSelected, onToggleSelect }: CompaniesRowProps) {
  const displayName = Companies.name || "Unknown Companies";
  const dicebearFallbackUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}`;

  const hasCompany = Companies.company && Companies.company.trim() !== "";
  const hasChannels = Companies.channels && Companies.channels.length > 0;

  return (
    <tr 
      className={cn(
        "hover:bg-surface-container-low/50 transition-colors group border-b border-outline-variant/50",
        isSelected && "border-l-2 border-primary bg-primary-container/5 relative"
      )}
    >
      {/* Selection Checkbox */}
      <td className="px-6 py-3 text-center">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(Companies.id)}
          className={cn(
            "rounded border-outline-variant text-primary focus:ring-primary/20 bg-surface transition-opacity cursor-pointer",
            isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
        />
      </td>

      {/* Profile & Name Card (Left-aligned for textual readability) */}
      <td className="px-6 py-3 text-left">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant flex-shrink-0 bg-surface-container-high flex items-center justify-center">
            <img 
              alt={`${displayName} profile`} 
              className="w-full h-full object-cover" 
              src={Companies.avatarUrl || dicebearFallbackUrl} 
            />
          </div>
          <div>
            <div className="font-medium text-on-background group-hover:text-primary transition-colors cursor-pointer">
              {displayName}
            </div>
            <div className="text-on-surface-variant text-xs mt-0.5">{Companies.role || "Companies"}</div>
          </div>
        </div>
      </td>

      {/* ✅ Company Link / Empty State Centered */}
      <td className="px-6 py-3 text-center">
        {hasCompany ? (
          <a className="text-primary hover:underline font-medium" href="#">
            {Companies.company}
          </a>
        ) : (
          <span className="text-outline/60 font-medium select-none">-</span>
        )}
      </td>

      {/* ✅ Omni-channel Badges / Empty State Centered */}
      <td className="px-6 py-3 text-center">
        {hasChannels ? (
          <div className="inline-flex justify-center">
            <CompaniesChannels channels={Companies.channels} />
          </div>
        ) : (
          <span className="text-outline/60 text-sm font-medium select-none">-</span>
        )}
      </td>

      {/* ✅ Status Badging Centered */}
      <td className="px-6 py-3 text-center">
        <div className="inline-flex justify-center">
          <CompaniesStatusBadge status={Companies.status || "prospect"} />
        </div>
      </td>

      {/* Dynamic Action Menus */}
      <td className="px-6 py-3 text-right">
        <div 
          className={cn(
            "flex items-center justify-end gap-1.5 transition-opacity",
            isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
        >
          {isSelected && (
            <button 
              className="p-1.5 text-primary bg-primary-container/20 rounded hover:bg-primary-container/40 transition-colors" 
              title="Message"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          )}
          <button 
            className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded transition-colors"
            title="More Options"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </td>
    </tr>
  );
}


