// src/modules/companies/components/CompanyDetails.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  Loader2,
  MapPin,
  Phone,
  Globe,
  MessageCircle,
  Mail,
  Plus,
  TrendingUp,
  MoreVertical,
  AlertCircle,
} from "lucide-react";
import type { RootState } from "@/app/store";
import { fetchCompany } from "../store/companies.actions";

import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardAction,
} from "@/shared/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/shared/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

export function CompanyDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();

  const { companyDetail, isLoadingDetail, error } = useSelector(
    (state: RootState) => state.companies,
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchCompany(id));
    }
  }, [id, dispatch]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-5 text-center bg-background text-on-surface">
        <div className="p-4 bg-error-container/20 text-error rounded-full mb-4">
          <AlertCircle className="w-12 h-12" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">Company Not Found</h1>
        <p className="text-on-surface-variant max-w-md mb-6">
          The requested company profile could not be found, or you do not have permission to access it.
        </p>
        <Button asChild variant="default">
          <Link to="/companies">Return to Companies List</Link>
        </Button>
      </div>
    );
  }

  if (isLoadingDetail || !companyDetail) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const company = companyDetail;
  const initials = company.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const formatRevenue = (val?: string | number | null) => {
    const num = Number(val || 0);
    if (!num || num <= 0) return "—";
    if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `$${(num / 1_000).toFixed(0)}K`;
    return `$${num}`;
  };

  const deals = company.deals ?? [];
  const contacts = company.contacts ?? [];

  return (
    <div className="p-[24px] max-w-[1400px] mx-auto">
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/companies")}
        className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface mb-6 transition-colors"
      >
        <ArrowLeft size={18} />
        <span className="font-label-md">Back to Companies</span>
      </Button>

      {/* Header */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-[16px] mb-8">
        <Card className="lg:col-span-12 bg-surface border border-outline-variant rounded-xl p-6 flex flex-col md:flex-row gap-6 items-start ring-0 shadow-none">
          <div className="w-24 h-24 rounded-xl bg-surface-container flex items-center justify-center shrink-0 border border-outline-variant overflow-hidden">
            {company.logoUrl ? (
              <img
                src={company.logoUrl}
                alt={company.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-h2 font-h2 text-primary">{initials}</span>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="font-h1 text-h1 text-on-surface">
                {company.name}
              </h2>
              <Badge
                variant="default"
                className="px-2 py-0.5 bg-secondary-container text-on-secondary-container font-label-sm text-label-sm rounded"
              >
                {company.status || "Lead"}
              </Badge>
            </div>
            {company.domain && (
              <p className="font-body-base text-primary mb-4">
                {company.domain}
              </p>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <p className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
                  Industry
                </p>
                <p className="font-label-md text-on-surface">
                  {company.industry || "—"}
                </p>
              </div>
              <div>
                <p className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
                  Annual Revenue
                </p>
                <p className="font-label-md text-on-surface">
                  {formatRevenue(company.annualRevenue)}
                </p>
              </div>
              <div>
                <p className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
                  Employees
                </p>
                <p className="font-label-md text-on-surface">
                  {company.employeeCount ? `${company.employeeCount}+` : "—"}
                </p>
              </div>
              <div>
                <p className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
                  Region
                </p>
                <p className="font-label-md text-on-surface">
                  {company.address || "—"}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-[16px]">
        {/* Main Content Side */}
        <div className="xl:col-span-8 flex flex-col gap-4">
          {/* Active Deals */}
          <Card className="bg-surface border border-outline-variant rounded-xl overflow-hidden ring-0 shadow-none">
            <CardHeader className="px-6 py-4 border-b border-outline-variant bg-surface-container-lowest flex justify-between items-center flex-row gap-0">
              <CardTitle className="font-h3 text-h3">Active Deals</CardTitle>
              <CardAction>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary font-label-md flex items-center gap-1 hover:underline"
                >
                  <Plus size={18} /> Add Deal
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="p-0">
              {deals.length > 0 ? (
                <Table className="[&_tr]:border-outline-variant">
                  <TableHeader className="bg-surface-container-low text-on-surface-variant">
                    <TableRow className="border-outline-variant">
                      <TableHead className="font-label-sm uppercase tracking-wider">
                        Deal Name
                      </TableHead>
                      <TableHead className="font-label-sm uppercase tracking-wider">
                        Value
                      </TableHead>
                      <TableHead className="font-label-sm uppercase tracking-wider">
                        Stage
                      </TableHead>
                      <TableHead className="font-label-sm uppercase tracking-wider">
                        Expected Close
                      </TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deals.map((deal, idx) => (
                      <TableRow
                        key={deal.id}
                        className={`group hover:bg-surface-container-low transition-colors ${idx === 0 ? "border-l-2 border-primary" : ""}`}
                      >
                        <TableCell className="font-label-md text-primary font-semibold">
                          {deal.name}
                        </TableCell>
                        <TableCell className="font-table-data">
                          {deal.value
                            ? `$${Number(deal.value).toLocaleString()}`
                            : "—"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="default"
                            className={`px-2 py-0.5 font-label-sm rounded ${
                              deal.status === "Proposal Sent"
                                ? "bg-tertiary-fixed text-on-tertiary-fixed-variant"
                                : deal.status === "Negotiation"
                                  ? "bg-secondary-container text-on-secondary-container"
                                  : "bg-surface-container-high text-on-surface-variant"
                            }`}
                          >
                            {deal.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-table-data">
                          {deal.expectedCloseDate
                            ? new Date(
                                deal.expectedCloseDate,
                              ).toLocaleDateString()
                            : "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-outline-variant transition-opacity"
                              >
                                <MoreVertical
                                  size={20}
                                  className="text-on-surface-variant"
                                />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Deal</DropdownMenuItem>
                              <DropdownMenuItem>Edit Deal</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                Delete Deal
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-8 text-center text-on-surface-variant font-body-base">
                  No active deals for this company.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card className="bg-surface border border-outline-variant rounded-xl p-6 ring-0 shadow-none">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-h3 text-h3">Internal Context</h3>
              <span className="font-label-sm text-on-surface-variant italic">
                {company.notes ? "Last updated recently" : "No notes yet"}
              </span>
            </div>
            {company.notes ? (
              <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 font-body-base leading-relaxed text-on-surface whitespace-pre-wrap">
                {company.notes}
              </div>
            ) : (
              <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 font-body-base leading-relaxed text-on-surface-variant italic">
                No internal notes have been added for this company yet.
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar Side */}
        <div className="xl:col-span-4 flex flex-col gap-4">
          {/* Company Info */}
          <Card className="bg-surface border border-outline-variant rounded-xl p-6 ring-0 shadow-none">
            <h4 className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-4 border-b border-outline-variant pb-2">
              Company Info
            </h4>
            <ul className="space-y-4">
              {company.address && (
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-outline mt-0.5 shrink-0" />
                  <div>
                    <p className="font-label-sm text-on-surface-variant">
                      Address
                    </p>
                    <p className="font-body-base text-on-surface">
                      {company.address}
                    </p>
                  </div>
                </li>
              )}
              {company.phone && (
                <li className="flex items-start gap-3">
                  <Phone size={18} className="text-outline mt-0.5 shrink-0" />
                  <div>
                    <p className="font-label-sm text-on-surface-variant">
                      Main Phone
                    </p>
                    <p className="font-body-base text-on-surface">
                      {company.phone}
                    </p>
                  </div>
                </li>
              )}
              {company.domain && (
                <li className="flex items-center gap-3">
                  <Globe size={18} className="text-outline mt-0.5 shrink-0" />
                  <div className="flex gap-3">
                    <p className="font-label-sm text-on-surface-variant">
                      Domain:
                    </p>
                    <a
                      href={`https://${company.domain}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-body-base text-primary hover:underline"
                    >
                      {company.domain}
                    </a>
                  </div>
                </li>
              )}
            </ul>

            <h4 className="font-label-sm text-on-surface-variant uppercase tracking-wider mt-8 mb-4 border-b border-outline-variant pb-2">
              Social Links
            </h4>
            <div className="flex gap-2">
              {company.linkedin && (
                <a
                  href={company.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 border border-outline-variant rounded-lg hover:bg-surface-container-high transition-colors"
                  title="LinkedIn"
                >
                  <svg
                    className="w-4 h-4 fill-current text-on-surface-variant hover:text-[#0077b5]"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              )}
              {company.twitter && (
                <a
                  href={company.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 border border-outline-variant rounded-lg hover:bg-surface-container-high transition-colors"
                  title="Twitter/X"
                >
                  <svg
                    className="w-4 h-4 fill-current text-on-surface-variant hover:text-on-surface"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              )}
              {company.instagram && (
                <a
                  href={company.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 border border-outline-variant rounded-lg hover:bg-surface-container-high transition-colors"
                  title="Instagram"
                >
                  <svg
                    className="w-4 h-4 fill-current text-on-surface-variant hover:text-[#E1306C]"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                  </svg>
                </a>
              )}
              {company.whatsapp && (
                <a
                  href={`https://wa.me/${company.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 border border-outline-variant rounded-lg hover:bg-surface-container-high transition-colors"
                  title="WhatsApp"
                >
                  <MessageCircle
                    size={18}
                    className="text-on-surface-variant hover:text-[#25D366]"
                  />
                </a>
              )}
              {company.email && (
                <a
                  href={`mailto:${company.email}`}
                  className="p-2 border border-outline-variant rounded-lg hover:bg-surface-container-high transition-colors"
                  title="Email"
                >
                  <Mail size={18} className="text-on-surface-variant hover:text-primary" />
                </a>
              )}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-surface border border-outline-variant rounded-xl p-6 ring-0 shadow-none">
            <h3 className="font-h3 text-h3 mb-4">Recent Activity</h3>
            <div className="relative space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-outline-variant">
              {contacts.length > 0 ? (
                contacts.slice(0, 3).map((contact) => (
                  <div
                    key={contact.id}
                    className="relative flex items-center gap-3 text-left w-full"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0 z-10 ml-[-1px]">
                      <span className="text-on-primary text-[10px] font-bold">
                        {contact.name.charAt(0)}
                      </span>
                    </div>
                    <p className="font-label-md text-on-surface flex-1 min-w-0 truncate">
                      Contact added:{" "}
                      <span className="font-bold">{contact.name}</span>
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-on-surface-variant font-body-base text-left pl-8">
                  No recent activity.
                </p>
              )}

              {deals.length > 0 &&
                deals.slice(0, 2).map((deal) => (
                  <div
                    key={deal.id}
                    className="relative flex items-start gap-3 text-left w-full"
                  >
                    <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center shrink-0 z-10 ml-[-1px] mt-0.5">
                      <TrendingUp size={14} className="text-on-secondary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-label-md text-on-surface">
                        Deal created:{" "}
                        <span className="font-bold">{deal.name}</span>
                      </p>
                      <p className="font-body-sm text-on-surface-variant">
                        {deal.value
                          ? `$${Number(deal.value).toLocaleString()}`
                          : "—"}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}