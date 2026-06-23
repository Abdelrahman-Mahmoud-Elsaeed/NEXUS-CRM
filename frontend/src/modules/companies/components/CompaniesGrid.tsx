/* eslint-disable @typescript-eslint/no-explicit-any */
import { TrendingUp, ChevronsDown, MapPin, Pencil, Send } from "lucide-react";
import type { CompanyData } from "../types/company.types";
import { CompanyActionMenu } from "./CompanyActionMenu";
import { Role } from "@/modules/auth/types/auth.types";

interface CompaniesGridProps {
  companies: CompanyData[];
  visibleLimit: number;
  totalRecords: number;
  onLoadMore: () => void;
  role: Role;
  handleMenuDispatch: (actionType: string, companyId: string) => void;
}

export function CompaniesGrid({
  companies,
  visibleLimit,
  totalRecords,
  onLoadMore,
  role,
  handleMenuDispatch,
}: CompaniesGridProps) {
  const visibleCompanies = companies.slice(0, visibleLimit);

  const formatRevenue = (value?: string) => {
    const num = Number(value || 0);
    if (!Number.isFinite(num) || num <= 0) return "$0";
    if (num >= 1_000_000) {
      return `$${(num / 1_000_000).toFixed(1)}M`;
    }
    if (num >= 1_000) {
      return `$${(num / 1_000).toFixed(0)}K`;
    }
    return `$${num}`;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const getIndustryBadge = (industry?: string | null) => {
    if (!industry) return "Enterprise";
    return industry;
  };

  // Setup inline action configurations with clear safety arrays mimicking standard lists
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

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {visibleCompanies.map((company) => {
          const displayName = company.name || "Unknown Company";
          const relatedContacts = company.contacts ?? [];
          const visibleContacts = relatedContacts.slice(0, 3);
          const remainingContacts =
            (company.contactsCount ?? relatedContacts.length) - visibleContacts.length;

          const canEdit = ALL_MANAGERS.includes(role);
          const canSendMessage = ALL_ACTIVE_ROLES.includes(role);

          return (
            <div
              key={company.id}
              className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 flex flex-col hover:border-primary/50 transition-colors group relative overflow-hidden"
            >
              {/* Subtle top highlight for premium feel */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Header: logo + info + actions */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-surface-container border border-outline-variant/50 flex items-center justify-center text-primary font-h3 overflow-hidden">
                    {company.logoUrl ? (
                      <img
                        src={company.logoUrl}
                        alt={displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[14px] font-bold">{getInitials(displayName)}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors">
                      {displayName}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 bg-secondary-container/30 text-on-secondary-container rounded-[2px] font-label-sm text-[11px] uppercase tracking-wide">
                        {getIndustryBadge(company.industry)}
                      </span>
                      {company.address && (
                        <span className="font-body-sm text-body-sm text-outline flex items-center gap-1">
                          <MapPin size={14} />
                          {company.address.length > 20
                            ? company.address.slice(0, 20) + "..."
                            : company.address}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Centralized Action Component Contextual to Grid Placement */}
                <CompanyActionMenu
                  companyId={company.id}
                  context="grid"
                  userRole={role}
                  onAction={handleMenuDispatch}
                />
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-outline-variant/30 mb-4">
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">
                    Total Revenue
                  </p>
                  <p className="font-h3 text-h3 text-on-surface">
                    {formatRevenue(company.totalRevenue ?? company.totalDealValue)}
                  </p>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">
                    Active Deals
                  </p>
                  <p className="font-h3 text-h3 text-on-surface flex items-center gap-2">
                    {company.activeDealsCount ?? 0}
                    <TrendingUp className="text-surface-tint text-[16px]" size={16} />
                  </p>
                </div>
              </div>

              {/* Contact facepile + actions */}
              <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center -space-x-2">
                  {visibleContacts.map((contact, idx) => {
                    const fallback = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(contact.name)}`;
                    return (
                      <img
                        key={contact.id}
                        alt={contact.name}
                        className={`w-7 h-7 rounded-xl border-2 border-surface-container-lowest object-cover ${
                          idx === 0 ? "z-30" : idx === 1 ? "z-20" : "z-10"
                        }`}
                        src={contact.avatarUrl || fallback}
                      />
                    );
                  })}
                  {remainingContacts > 0 && (
                    <div className="w-7 h-7 rounded-xl border-2 border-surface-container-lowest bg-surface-container-high text-on-surface-variant font-label-sm text-[10px] flex items-center justify-center z-0">
                      +{remainingContacts}
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  {canEdit && (
                    <button
                      onClick={() => handleMenuDispatch("edit", company.id)}
                      className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors flex items-center justify-center"
                      type="button"
                    >
                      <Pencil size={20} />
                    </button>
                  )}
                  {canSendMessage && (
                    <button
                      onClick={() => handleMenuDispatch("send_message", company.id)}
                      className="p-2 bg-primary/5 text-primary hover:bg-primary hover:text-on-primary rounded-lg transition-all flex items-center justify-center"
                      type="button"
                    >
                      <Send size={20} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {visibleLimit < companies.length && (
        <div className="mt-12 flex flex-col items-center justify-center">
          <button
            onClick={onLoadMore}
            className="px-8 py-3 bg-surface-container-low border border-outline-variant text-on-surface font-label-md rounded-xl hover:bg-surface-container transition-all flex items-center group shadow-sm gap-2"
            type="button"
          >
            Load More Companies
            <ChevronsDown
              size={18}
              className="group-hover:translate-y-0.5 transition-transform"
            />
          </button>
          <p className="text-[12px] text-outline mt-4">
            Showing {visibleCompanies.length} of {totalRecords} companies
          </p>
        </div>
      )}
    </div>
  );
}