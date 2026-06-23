import { CompaniesGrid } from "../components/CompaniesGrid";
import { CreateCompanyModal } from "../components/CreateCompanyModal";
import { EditCompanyDialog } from "../components/EditCompanyDialog";
import { CompaniesLoading } from "../components/CompaniesLoading";
import { CompaniesListView } from "../components/CompaniesListView";

import { useCompanies } from "../hooks/useCompanies";

import { ResourceHeader } from "@/shared/ui/resource/resource-header";
import { ResourceToolbar } from "@/shared/ui/resource/resource-toolbar";

export function Companies() {
  // Pull all reactive synchronization logic directly out of our clean hook layer
  const {
    companies,
    totalRecords,
    totalPages,
    isLoading,
    role,
    isCreateModalOpen,
    setIsCreateModalOpen,
    editingCompanyId,
    setEditingCompanyId,
    selectedIds,
    search,
    setSearch,
    viewMode,
    setViewMode,
    page,
    setPage,
    visibleGridLimit,
    startRange,
    endRange,
    addCompany,
    handleMenuDispatch,
    handleToggleSelect,
    handleToggleSelectAll,
    handleLoadMore,
  } = useCompanies();
  if (isLoading && companies.length === 0) {
    return <CompaniesLoading />;
  }

  return (
    <main className="mt-header-height p-6 md:ml-sidebar-width overflow-y-auto bg-background p-container-padding">
      <ResourceHeader
        title="Companies"
        description="Manage and engage with your company records."
        totalRecords={totalRecords}
        currentRangeText={`Showing ${startRange}-${endRange}`}
        onCreateClick={() => setIsCreateModalOpen(true)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        createButtonText="Add Company"
      />

      <div className="flex flex-col gap-6">
        <div className="bg-surface border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col">
          <ResourceToolbar
            searchPlaceholder="Search companies..."
            searchValue={search}
            onSearchChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            filtersCount={selectedIds.size > 0 ? 1 : 0}
          />

          {!isLoading && companies.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground bg-surface">
              No companies found. Create a new record to get started.
            </div>
          ) : viewMode === "list" ? (
            <CompaniesListView
              companies={companies}
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

        {viewMode === "grid" && companies.length > 0 && (
          <CompaniesGrid
            companies={companies}
            visibleLimit={visibleGridLimit}
            totalRecords={totalRecords}
            onLoadMore={handleLoadMore}
            role={role}
            handleMenuDispatch={handleMenuDispatch}
          />
        )}
      </div>

      <CreateCompanyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={addCompany}
      />

      <EditCompanyDialog
        companyId={editingCompanyId}
        onClose={() => setEditingCompanyId(null)}
      />
    </main>
  );
}
