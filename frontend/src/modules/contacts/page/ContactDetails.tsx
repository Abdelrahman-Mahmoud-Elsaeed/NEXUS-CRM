/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Loader2,
  Mail,
  Phone,
  Plus,
  MessageCircle,
  TrendingUp,
  CheckCircle,
  Copy,
  ExternalLink,
  Filter,
  MoreHorizontal,
  AlertCircle,
} from "lucide-react";
import type { RootState } from "@/app/store";
import { fetchContact } from "../store/contacts.actions";

import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Card } from "@/shared/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

export function ContactDetails() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<any>();

  const { contactDetail, isLoadingDetail, error } = useSelector(
    (state: RootState) => state.contacts,
  );
  useEffect(() => {
    if (id) {
      dispatch(fetchContact(id));
    }
  }, [id, dispatch]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-5 text-center bg-background text-on-surface">
        <div className="p-4 bg-error-container/20 text-error rounded-full mb-4">
          <AlertCircle className="w-12 h-12" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">
          Contact Not Found
        </h1>
        <p className="text-on-surface-variant max-w-md mb-6">
          The requested contact profile could not be found, or you do not have
          permission to access it.
        </p>
        <Button asChild variant="default">
          <Link to="/contacts">Return to Contacts List</Link>
        </Button>
      </div>
    );
  }

  if (isLoadingDetail || !contactDetail) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const contact = contactDetail;
  const fallbackAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(contact.name)}`;
  const deals = contact.deals ?? [];
  const tasks = contact.tasks ?? [];

  // Build channel map from new ContactChannelDto[] format
  const channelMap: Record<string, string> = {};
  (contact.channels || []).forEach((ch: any) => {
    if (ch?.type && ch?.value) {
      channelMap[ch.type] = ch.value;
    }
  });

  const statusBadgeClass =
    contact.status === "Active"
      ? "bg-primary/10 text-primary rounded-[0.125rem]"
      : contact.status === "Prospect"
        ? "bg-secondary-container/30 text-on-secondary-container rounded-[0.125rem]"
        : "bg-surface-container-high text-on-surface-variant rounded-[0.125rem]";

  const priorityBadgeClass =
    contact.priority === "High"
      ? "bg-error-container text-error rounded-[0.125rem]"
      : contact.priority === "Medium"
        ? "bg-secondary-container/30 text-on-secondary-container rounded-[0.125rem]"
        : "bg-surface-container-high text-on-surface-variant rounded-[0.125rem]";

  return (
    <div className="min-h-screen bg-background text-on-surface">
      {/* Profile Header */}
      <section className="bg-surface-container-lowest px-container-padding py-8 border-b border-outline-variant">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start justify-between gap-6 p-5">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 w-full lg:w-auto">
            <div className="relative">
              <div className="w-24 h-24 rounded-xl overflow-hidden border border-outline-variant bg-surface-container shadow-sm">
                <img
                  src={contact.avatarUrl || fallbackAvatar}
                  alt={contact.name}
                  className="w-full h-full rounded-[0.125rem] object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-surface-container-lowest rounded-full shadow-sm" />
            </div>

            <div className="text-center sm:text-left flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-wrap justify-center sm:justify-start">
                <h1 className="font-h1 text-h1 text-on-surface tracking-tight">
                  {contact.name}
                </h1>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <Badge
                    variant="default"
                    className={`px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${statusBadgeClass}`}
                  >
                    {contact.status || "Prospect"}
                  </Badge>
                  {contact.priority && (
                    <Badge
                      variant="default"
                      className={`px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${priorityBadgeClass}`}
                    >
                      {contact.priority} Priority
                    </Badge>
                  )}
                </div>
              </div>

              <p className="text-on-surface-variant font-body-base mt-1.5 text-body-base">
                {contact.jobTitle || "Contact Position"}
                {contact.company && (
                  <>
                    {" "}
                    at{" "}
                    <span className="font-semibold text-primary hover:underline cursor-pointer">
                      {contact.company}
                    </span>
                  </>
                )}
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-5 justify-center sm:justify-start">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 px-4 py-2 border border-outline-variant bg-surface-container-lowest text-label-md font-medium text-on-surface hover:bg-surface-container transition-colors shadow-sm"
                >
                  <Mail size={16} className="text-on-surface-variant" /> Email
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 px-4 py-2 border border-outline-variant bg-surface-container-lowest text-label-md font-medium text-on-surface hover:bg-surface-container transition-colors shadow-sm"
                >
                  <Phone size={16} className="text-on-surface-variant" /> Call
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="flex items-center gap-2 px-4 py-2 font-label-md text-label-md hover:bg-primary-container transition-all shadow-sm"
                >
                  <Plus className="text-white" size={16} />
                  <span className="text-white">Log Action</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid Container */}
          <Card className="grid grid-cols-2 gap-x-8 gap-y-2 bg-surface-container-low border border-outline-variant/60 rounded-xl p-5 w-full lg:w-auto min-w-[280px] ring-0 shadow-none">
            <div>
              <p className="text-label-sm text-on-surface-variant uppercase font-medium tracking-wider text-[11px] mb-1">
                Lead Status
              </p>
              <p className="font-h2 text-h2 text-on-surface">
                {contact.status || "—"}
              </p>
            </div>
            <div>
              <p className="text-label-sm text-on-surface-variant uppercase font-medium tracking-wider text-[11px] mb-1">
                Deal Value
              </p>
              <p className="font-h2 text-h2 text-primary">
                {deals.length > 0
                  ? `$${deals.reduce((acc: number, d: any) => acc + Number(d.value || 0), 0).toLocaleString()}`
                  : "$0"}
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Main Structural Layout Layout Grid */}
      <div className="max-w-7xl mx-auto p-5 gap-6 px-container-padding py-8 grid grid-cols-12 gap-gutter">
        {/* Left Informative Sidebar Column */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          {/* Section: Contact Information */}
          <Card className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm ring-0">
            <h3 className="text-[11px] text-outline font-bold uppercase tracking-widest mb-4 pb-2 border-b border-outline-variant/30">
              Contact Information
            </h3>
            <div className="space-y-4">
              <div className="group">
                <p className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider mb-1">
                  Email Address
                </p>
                <div className="flex items-center justify-between bg-surface-container-low border border-outline-variant/40 rounded px-3 py-2">
                  <span className="font-body-base text-body-sm text-on-surface overflow-hidden text-ellipsis whitespace-nowrap mr-2">
                    {contact.email}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => navigator.clipboard.writeText(contact.email)}
                    className="text-outline hover:text-primary transition-colors shrink-0 p-1 rounded hover:bg-surface-container-high"
                    title="Copy Email"
                  >
                    <Copy size={14} />
                  </Button>
                </div>
              </div>

              {contact.phone && (
                <div className="group">
                  <p className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider mb-1">
                    Phone Line
                  </p>
                  <div className="flex items-center justify-between bg-surface-container-low border border-outline-variant/40 rounded px-3 py-2">
                    <span className="font-body-base text-body-sm text-on-surface">
                      {contact.phone}
                    </span>
                    <a
                      href={`tel:${contact.phone}`}
                      className="text-outline hover:text-primary transition-colors p-1 rounded hover:bg-surface-container-high"
                      title="Call Phone"
                    >
                      <Phone size={14} />
                    </a>
                  </div>
                </div>
              )}

              {contact.website && (
                <div className="group">
                  <p className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider mb-1">
                    Corporate Website
                  </p>
                  <div className="flex items-center justify-between bg-surface-container-low border border-outline-variant/40 rounded px-3 py-2">
                    <a
                      href={contact.website}
                      target="_blank"
                      rel="noreferrer"
                      className="font-body-base text-body-sm text-primary hover:underline overflow-hidden text-ellipsis whitespace-nowrap mr-2"
                    >
                      {contact.website}
                    </a>
                    <ExternalLink size={14} className="text-outline shrink-0" />
                  </div>
                </div>
              )}

              {/* Dynamic Social Links from channels array */}
              {(contact.channels || []).length > 0 && (
                <div className="pt-2 flex flex-wrap gap-2">
                  {channelMap["LinkedIn"] && (
                    <a
                      href={channelMap["LinkedIn"]}
                      target="_blank"
                      rel="noreferrer"
                      className="w-9 h-9 rounded bg-surface-container border border-outline-variant/40 flex items-center justify-center text-on-surface-variant hover:text-[#0077b5] hover:bg-surface-container-high transition-colors"
                      title="LinkedIn Profile"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                  )}
                  {channelMap["WhatsApp"] && (
                    <a
                      href={`https://wa.me/${channelMap["WhatsApp"]}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-9 h-9 rounded bg-surface-container border border-outline-variant/40 flex items-center justify-center text-on-surface-variant hover:text-[#25D366] hover:bg-surface-container-high transition-colors"
                      title="WhatsApp Message"
                    >
                      <MessageCircle size={16} />
                    </a>
                  )}
                  {channelMap["Twitter"] && (
                    <a
                      href={channelMap["Twitter"]}
                      target="_blank"
                      rel="noreferrer"
                      className="w-9 h-9 rounded bg-surface-container border border-outline-variant/40 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
                      title="Twitter Profile"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                  )}
                  {channelMap["Instagram"] && (
                    <a
                      href={channelMap["Instagram"]}
                      target="_blank"
                      rel="noreferrer"
                      className="w-9 h-9 rounded bg-surface-container border border-outline-variant/40 flex items-center justify-center text-on-surface-variant hover:text-[#E1306C] hover:bg-surface-container-high transition-colors"
                      title="Instagram Profile"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                      </svg>
                    </a>
                  )}
                  {channelMap["AlternativeEmail"] && (
                    <a
                      href={`mailto:${channelMap["AlternativeEmail"]}`}
                      className="w-9 h-9 rounded bg-surface-container border border-outline-variant/40 flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors"
                      title="Alternative Email"
                    >
                      <Mail size={16} />
                    </a>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Section: Core Metadata */}
          <Card className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm ring-0">
            <h3 className="text-[11px] text-outline font-bold uppercase tracking-widest mb-4 pb-2 border-b border-outline-variant/30">
              System Metadata
            </h3>
            <div className="space-y-3.5">
              <div className="flex justify-between items-center py-1.5 border-b border-outline-variant/30">
                <span className="text-body-sm text-on-surface-variant">
                  Lead Source
                </span>
                <span className="text-label-md font-semibold text-on-surface">
                  {contact.source || "Manual Entry"}
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-outline-variant/30">
                <span className="text-body-sm text-on-surface-variant">
                  Account / Company
                </span>
                <span className="text-label-md font-semibold text-on-surface">
                  {contact.company || "—"}
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-outline-variant/30">
                <span className="text-body-sm text-on-surface-variant">
                  Designation
                </span>
                <span className="text-label-md font-semibold text-on-surface">
                  {contact.jobTitle || "—"}
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-body-sm text-on-surface-variant">
                  Profile Created
                </span>
                <span className="text-label-md font-semibold text-on-surface">
                  {contact.createdAt
                    ? new Date(contact.createdAt).toLocaleDateString(
                        undefined,
                        { dateStyle: "medium" },
                      )
                    : "—"}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Main Functional Panel Column */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Component block: Related Pipelines and Deals */}
          <Card className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm ring-0">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-h3 text-h3 text-on-surface tracking-tight">
                Active Pipelines &amp; Deals
              </h3>
              <Button
                variant="link"
                size="sm"
                className="text-primary text-label-md font-bold hover:underline"
              >
                View Pipeline
              </Button>
            </div>

            {deals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {deals.map((deal, idx) => {
                  const isPrimary = idx === 0;
                  const borderColor = isPrimary
                    ? "border-primary"
                    : "border-secondary";
                  const bgColor = isPrimary ? "bg-primary/5" : "bg-secondary/5";
                  const progressColor = isPrimary
                    ? "bg-primary"
                    : "bg-secondary";
                  const progress =
                    deal.status === "Open"
                      ? 35
                      : deal.status === "Negotiation"
                        ? 85
                        : 60;

                  return (
                    <div
                      key={deal.id}
                      className={`p-4 border-l-4 ${borderColor} ${bgColor} rounded-r-lg hover:brightness-95 transition-all cursor-pointer group flex flex-col justify-between`}
                    >
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <p className="font-label-md font-bold text-on-surface group-hover:text-primary transition-colors">
                            {deal.name}
                          </p>
                          <TrendingUp
                            size={16}
                            className="text-outline shrink-0 group-hover:text-primary transition-colors"
                          />
                        </div>
                        <p className="text-body-sm text-on-surface-variant mt-1">
                          <span className="font-semibold text-on-surface">
                            {deal.value
                              ? `$${Number(deal.value).toLocaleString()}`
                              : "—"}
                          </span>{" "}
                          • {deal.stage || deal.status}
                        </p>
                      </div>

                      <div className="mt-5">
                        <div className="w-full bg-outline-variant/40 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`${progressColor} h-full transition-all duration-500`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-on-surface-variant font-body-base py-10 border border-dashed border-outline-variant rounded-lg bg-surface-container-low">
                No active related pipelines found for this account link.
              </div>
            )}
          </Card>

          {/* Component block: Activity Logs and Timeline Tasks */}
          <Card className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm ring-0">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-h3 text-h3 text-on-surface tracking-tight">
                Communication Logs &amp; Activity
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon-sm"
                  className="p-2 border border-outline-variant/60 bg-surface-container-low rounded-md hover:bg-surface-container-high transition-colors"
                  title="Filter Log"
                >
                  <Filter size={16} className="text-on-surface-variant" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon-sm"
                      className="p-2 border border-outline-variant/60 bg-surface-container-low rounded-md hover:bg-surface-container-high transition-colors"
                      title="More Actions"
                    >
                      <MoreHorizontal
                        size={16}
                        className="text-on-surface-variant"
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Export Activity</DropdownMenuItem>
                    <DropdownMenuItem>Refresh Data</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="relative pl-2 space-y-6 before:content-[''] before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-outline-variant/40">
              {tasks.length === 0 && deals.length === 0 ? (
                <p className="text-on-surface-variant font-body-base py-4 italic text-center">
                  No active history logging recorded on timeline profiles.
                </p>
              ) : (
                <>
                  {tasks.map((task) => (
                    <div key={task.id} className="relative pl-10 group">
                      <div className="absolute left-1 top-0.5 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-on-primary ring-4 ring-surface-container-lowest shadow-sm z-10">
                        <CheckCircle size={13} />
                      </div>
                      <div className="bg-surface-container-low border border-outline-variant/40 rounded-lg p-4 hover:border-outline-variant transition-colors">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <p className="font-label-md text-on-surface text-body-sm">
                            Action Log:{" "}
                            <span className="font-bold text-primary">
                              {task.title}
                            </span>
                          </p>
                          <span className="text-[12px] font-medium text-outline">
                            {task.createdAt
                              ? new Date(task.createdAt).toLocaleDateString(
                                  undefined,
                                  { dateStyle: "short" },
                                )
                              : "—"}
                          </span>
                        </div>
                        <p className="text-body-sm text-on-surface-variant mt-2 flex gap-3 flex-wrap">
                          <span className="bg-surface-container-high px-2 py-0.5 rounded text-[11px]">
                            Status: {task.status}
                          </span>
                          <span className="bg-surface-container-high px-2 py-0.5 rounded text-[11px]">
                            Priority: {task.priority}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}

                  {deals.map((deal) => (
                    <div key={deal.id} className="relative pl-10 group">
                      <div className="absolute left-1 top-0.5 w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-white ring-4 ring-surface-container-lowest shadow-sm z-10">
                        <TrendingUp size={13} />
                      </div>
                      <div className="bg-surface-container-low border border-outline-variant/40 rounded-lg p-4 hover:border-outline-variant transition-colors">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <p className="font-label-md text-on-surface text-body-sm">
                            Pipeline Linked:{" "}
                            <span className="font-bold text-on-surface">
                              {deal.name}
                            </span>
                          </p>
                          <span className="text-[12px] font-medium text-outline">
                            {deal.expectedCloseDate
                              ? new Date(
                                  deal.expectedCloseDate,
                                ).toLocaleDateString(undefined, {
                                  dateStyle: "short",
                                })
                              : "—"}
                          </span>
                        </div>
                        <p className="text-body-sm text-on-surface-variant mt-2">
                          Estimated Value:{" "}
                          <span className="font-semibold text-on-surface">
                            {deal.value
                              ? `$${Number(deal.value).toLocaleString()}`
                              : "—"}
                          </span>{" "}
                          • Stage Pipeline: {deal.stage || deal.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </Card>

          {/* Component block: Strategic Context Notes */}
          <Card className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm ring-0">
            <h3 className="font-h3 text-h3 text-on-surface tracking-tight mb-3">
              Strategic Profile Notebook
            </h3>

            <div className="min-h-[140px] border border-outline-variant rounded-lg p-4 bg-surface border-outline-variant/60 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
              {contact.notes ? (
                <p className="font-body-base text-body-sm text-on-surface whitespace-pre-wrap leading-relaxed">
                  {contact.notes}
                </p>
              ) : (
                <p className="font-body-base text-body-sm text-on-surface-variant italic">
                  No internal strategic notes or context blocks have been
                  written for this key user profile yet.
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
