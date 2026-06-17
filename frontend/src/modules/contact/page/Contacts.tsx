/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Loader2, MessageSquare, MoreHorizontal } from "lucide-react";

import { ContactStatusBadge } from "../components/ContactStatusBadge";
import { ContactChannels } from "../components/ContactChannels";
import { ContactsGrid } from "../components/ContactsGrid";
import { CreateContactModal } from "../components/CreateContactModal"; // Uses your form hook inside!

import { useContacts } from "../hooks/useContacts";
import {
  ResourceTable,
  type ColumnConfig,
} from "@/shared/ui/resource/resource-table";
import { ResourceHeader } from "@/shared/ui/resource/resource-header";
import { ResourceToolbar } from "@/shared/ui/resource/resource-toolbar";
import { ResourcePagination } from "@/shared/ui/resource/resource-pagination";
import type { FinalSubmissionPayload } from "../types/contact.types";
import { createNewContact, uploadContactAvatarThunk } from "../store/contacts.actions";
import { useDispatch } from "react-redux";

export function Contacts() {
  // 1. Core data management via your React Redux Custom Hook
  const { contacts, totalRecords, totalPages, isLoading, loadContacts } =
    useContacts();
  const dispatch = useDispatch<any>();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const [page, setPage] = useState(1);
  const limit = 10;
  const [visibleGridLimit, setVisibleGridLimit] = useState(4);

  // Load backend contact rows whenever search string changes or page changes
  useEffect(() => {
    loadContacts({ search, page, limit });
  }, [search, page, loadContacts]);

  // Handle Full Page Loading State
  if (isLoading && contacts.length === 0) {
    return (
      <main className="mt-header-height md:ml-sidebar-width flex flex-col items-center justify-center min-h-[70vh] bg-background gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground animate-pulse">
          Loading contacts from database...
        </p>
      </main>
    );
  }

  const handleCreateContactSubmit = async (
    submissionPayload: FinalSubmissionPayload & { avatarFile?: File | null },
  ) => {
    try {
      let uploadedAvatarUrl: string | undefined = undefined;

      // 1. Intercept file token before launching payload updates
      if (submissionPayload.avatarFile) {
        const uploadResult = await dispatch(
          uploadContactAvatarThunk(submissionPayload.avatarFile),
        ).unwrap();

     
        uploadedAvatarUrl = uploadResult?.file?.url || uploadResult?.url || uploadResult;
      }
      // 2. Build backend structure payload parameters mapping
      const formattedBackendPayload = {
        name: submissionPayload.name,
        email: submissionPayload.email,
        phone: submissionPayload.phone,
        jobTitle: submissionPayload.jobTitle,
        companyName: submissionPayload.companyName,
        website: submissionPayload.website,
        pipelineStageId: submissionPayload.pipelineStageId,
        source: submissionPayload.source,
        notes: submissionPayload.notes,

        avatarUrl: uploadedAvatarUrl,

        whatsappHandle: submissionPayload.socialHandles.whatsapp,
        linkedinHandle: submissionPayload.socialHandles.linkedin,
        instagramHandle: submissionPayload.socialHandles.instagram,
        twitterHandle: submissionPayload.socialHandles.twitter,
      };
      await dispatch(
        createNewContact({ data: formattedBackendPayload as any }),
      ).unwrap();

      // 4. Reload layout grids
      loadContacts({ search, page, limit });
      return { success: true };
    } catch (error: any) {
      console.error("Submission failed:", error);
      return {
        success: false,
        msg:
          typeof error === "string"
            ? error
            : error?.msg ||
              error?.message ||
              "Failed to finalize contact configuration profile.",
      };
    }
  };
  const handleToggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.size === contacts.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(contacts.map((c: any) => c.id)));
  };

  const handleLoadMore = () => {
    setVisibleGridLimit((prev) => Math.min(prev + 4, contacts.length));
  };

  // Define structured UI column configs matching your core design system definitions
  const contactColumns: ColumnConfig<any>[] = [
    {
      header: "Name",
      render: (contact) => {
        const displayName = contact.name || "Unknown Contact";
        const fallbackUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}`;
        return (
          <div className="flex items-center gap-3">
            <img
              src={contact.avatarUrl || fallbackUrl}
              className="w-10 h-10 rounded-full object-cover bg-surface-container-high shrink-0 select-none"
              alt=""
            />
            <div className="flex flex-col min-w-0">
              <span className="font-medium text-on-background tracking-tight truncate max-w-[180px]">
                {displayName}
              </span>
              {contact.jobTitle && (
                <span className="text-on-surface-variant text-[12px] truncate max-w-[160px]">
                  {contact.jobTitle}
                </span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      header: "Company",
      cellAlignment: "center",
      render: (contact) => {
        const hasCompany =
          contact.company &&
          typeof contact.company === "string" &&
          contact.company.trim() !== "";
        return hasCompany ? (
          <span className="inline-flex items-center px-2.5 py-1 bg-surface-container-high border border-outline-variant text-on-surface rounded-md font-medium text-xs select-none">
            {contact.company}
          </span>
        ) : (
          <span className="text-outline/60 text-sm font-medium select-none">
            -
          </span>
        );
      },
    },
    {
      header: "Omnichannel Channels",
      cellAlignment: "center",
      render: (contact) => {
        // Collect existing channels from backend source model maps
        const channels: string[] = [];
        if (contact.whatsappHandle) channels.push("whatsapp");
        if (contact.linkedinHandle) channels.push("linkedin");
        if (contact.instagramHandle) channels.push("instagram");
        if (contact.twitterHandle) channels.push("twitter");
        if (contact.email) channels.push("mail");

        return channels.length > 0 ? (
          <div className="inline-flex justify-center">
            <ContactChannels channels={channels as any} />
          </div>
        ) : (
          <span className="text-outline/60 text-sm font-medium select-none">
            -
          </span>
        );
      },
    },
    {
      header: "Status",
      cellAlignment: "center",
      render: (contact) => (
        <div className="inline-flex justify-center">
          <ContactStatusBadge status={contact.status || "Prospect"} />
        </div>
      ),
    },
  ];

  const startRange = (page - 1) * limit + 1;
  const endRange = Math.min(page * limit, totalRecords);

  return (
    <main className="mt-header-height md:ml-sidebar-width overflow-y-auto bg-background p-container-padding">
      {/* Dynamic Master Context Resource Bar */}
      <ResourceHeader
        title="Contacts"
        description="Manage and engage with your omnichannel network."
        totalRecords={totalRecords}
        currentRangeText={`Showing ${startRange}-${endRange}`}
        onCreateClick={() => setIsCreateModalOpen(true)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        createButtonText="Add Contact"
      />

      <div className="flex flex-col gap-6">
        <div className="bg-surface border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col">
          {/* Internal Filtering Elements */}
          <ResourceToolbar
            searchPlaceholder="Search contacts..."
            searchValue={search}
            onSearchChange={(val) => {
              setSearch(val);
              setPage(1); // Reset pagination index state on keypress changes
            }}
            filtersCount={selectedIds.size > 0 ? 1 : 0}
          />

          {!isLoading && contacts.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground bg-surface">
              No contacts found. Create a new record to get started.
            </div>
          ) : viewMode === "list" ? (
            <>
              {/* Structured Resource Data Grid Wrapper */}
              <ResourceTable
                data={contacts}
                columns={contactColumns}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
                onToggleSelectAll={handleToggleSelectAll}
                rowActionsRender={(_contact, isSelected) => (
                  <>
                    {isSelected && (
                      <button
                        type="button"
                        className="p-1.5 text-primary bg-primary-container/20 rounded hover:bg-primary-container/40 transition-colors cursor-pointer"
                        title="Message"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded transition-all cursor-pointer"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </>
                )}
              />
              <ResourcePagination
                page={page}
                totalPages={totalPages}
                selectedCount={selectedIds.size}
                onPageChange={(newPage) => setPage(newPage)}
              />
            </>
          ) : null}
        </div>

        {/* Support Card Grid Layout Panels */}
        {viewMode === "grid" && contacts.length > 0 && (
          <ContactsGrid
            contacts={contacts}
            visibleLimit={visibleGridLimit}
            totalRecords={totalRecords}
            onLoadMore={handleLoadMore}
          />
        )}
      </div>

      <CreateContactModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateContactSubmit}
      />
    </main>
  );
}
