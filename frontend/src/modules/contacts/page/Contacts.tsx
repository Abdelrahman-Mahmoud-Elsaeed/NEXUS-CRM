/* eslint-disable @typescript-eslint/no-explicit-any */
import { ContactsGrid } from "../components/ContactsGrid";
import { CreateContactModal } from "../components/CreateContactModal";
import { ContactsLoading } from "../components/ContactsLoading";
import { ContactsListView } from "../components/ContactsListView";
import { useContacts } from "../hooks/useContacts";

import { ResourceHeader } from "@/shared/ui/resource/resource-header";
import { ResourceToolbar } from "@/shared/ui/resource/resource-toolbar";
import { EditContactDialog } from "../components/EditContactDialog";
import { AttachCompanyDialog } from "../components/AttachCompanyDialog";
import { AttachMemberDialog } from "../components/AttachMemberDialog";
import { MoveToDealModal } from "../components/MoveToDealModal";
import { useDeals } from "@/modules/deals/hooks/useDeals";

export function Contacts() {
  const {
    contacts,
    totalRecords,
    totalPages,
    isLoading,
    role,
    isCreateModalOpen,
    setIsCreateModalOpen,
    editingContactId,
    setEditingContactId,
    attachingMemberContactId,
    selectedIds,
    search,
    setSearch,
    viewMode,
    setViewMode,
    page,
    setPage,
    visibleGridLimit,
    startRange,
    setAttachingCompanyContactId,
    attachingCompanyContactId,
    currentOrganizationId,
    moveToDealContactId,
    setMoveToDealContactId,
    endRange,
    addContact,
    handleMenuDispatch,
    handleToggleSelect,
    setAttachingMemberContactId,
    handleToggleSelectAll,
    handleLoadMore,
  } = useContacts();
  const { addDeal } = useDeals();
  const selectedContact = contacts.find(c => c.id === moveToDealContactId);

  if (isLoading && contacts.length === 0) {
    return <ContactsLoading />;
  }

  return (
    <main className="mt-header-height  p-6 md:ml-sidebar-width overflow-y-auto bg-background p-container-padding">
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
          <ResourceToolbar
            searchPlaceholder="Search contacts..."
            searchValue={search}
            onSearchChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            filtersCount={selectedIds.size > 0 ? 1 : 0}
          />

          {!isLoading && contacts.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground bg-surface">
              No contacts found. Create a new record to get started.
            </div>
          ) : viewMode === "list" ? (
            <ContactsListView
              contacts={contacts}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onToggleSelectAll={handleToggleSelectAll}
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              role={role}
              handleMenuDispatch={handleMenuDispatch}
            />
          ) : null}
        </div>

        {viewMode === "grid" && contacts.length > 0 && (
          <ContactsGrid
            contacts={contacts}
            visibleLimit={visibleGridLimit}
            totalRecords={totalRecords}
            onLoadMore={handleLoadMore}
            role={role}
            handleMenuDispatch={handleMenuDispatch}
          />
        )}
      </div>

      <CreateContactModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={addContact}
      />

      <EditContactDialog
        key={editingContactId ? `edit-${editingContactId}` : "edit-closed"}
        contactId={editingContactId}
        onClose={() => setEditingContactId(null)}
      />

      <AttachCompanyDialog
        key={
          attachingCompanyContactId
            ? `attach-company-${attachingCompanyContactId}`
            : "attach-closed"
        }
        contactId={attachingCompanyContactId}
        onClose={() => setAttachingCompanyContactId(null)}
      />

      <AttachMemberDialog
        key={
          attachingMemberContactId
            ? `attach-member-${attachingMemberContactId}`
            : "member-closed"
        }
        contactId={attachingMemberContactId}
        orgId={currentOrganizationId}
        onClose={() => setAttachingMemberContactId(null)}
      />

      <MoveToDealModal
        isOpen={!!moveToDealContactId}
        onClose={() => setMoveToDealContactId(null)}
        contactName={selectedContact?.name || ""}
        companyName={selectedContact?.company || ""}
        onSubmit={addDeal}
      />
    </main>
  );
}
