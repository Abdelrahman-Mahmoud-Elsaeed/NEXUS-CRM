/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Loader2,MoreHorizontal, Building2 } from "lucide-react";

import { useCompanies } from "../hooks/useCompanies";
import { uploadCompanyLogoThunk, createNewCompany } from "../store/companies.actions";

import {
  ResourceTable,
  type ColumnConfig,
} from "@/shared/ui/resource/resource-table";
import { ResourceHeader } from "@/shared/ui/resource/resource-header";
import { ResourceToolbar } from "@/shared/ui/resource/resource-toolbar";
import { ResourcePagination } from "@/shared/ui/resource/resource-pagination";
import { useDispatch } from "react-redux";
import type { FinalCompanySubmissionPayload } from "../types/company.types";
import { useCreateCompanyModalForm } from "../hooks/useCreateCompanieModalForm";
import { ResourceCreateSheet } from "@/shared/ui/resource/resource-createSheet";

// Helper component for the form fields since you requested the exact layout buildout
function CreateCompanyFormFields({ register, errors, previewUrl, handleFileChange }: any) {
  return (
    <div className="space-y-5">
      {/* Logo Upload Section */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-100 rounded-xl">
        <div className="h-16 w-16 rounded-lg bg-white border border-outline-variant flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
          {previewUrl ? (
            <img src={previewUrl} alt="Logo preview" className="h-full w-full object-contain" />
          ) : (
            <Building2 className="h-7 w-7 text-gray-400" />
          )}
        </div>
        <div className="space-y-1">
          <label className="block text-[13px] font-medium text-on-surface">Company Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
          />
        </div>
      </div>

      {/* Core Operational Text Inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-600">Company Name *</label>
          <input
            {...register("name")}
            className="w-full h-10 px-3 text-sm bg-white border border-gray-300 rounded-lg focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="e.g. Acme Corporation"
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-600">Corporate Domain (URL)</label>
          <input
            {...register("domain")}
            className="w-full h-10 px-3 text-sm bg-white border border-gray-300 rounded-lg focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="e.g. https://acme.com"
          />
          {errors.domain && <p className="text-xs text-red-500">{errors.domain.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-600">Industry</label>
          <input
            {...register("industry")}
            className="w-full h-10 px-3 text-sm bg-white border border-gray-300 rounded-lg focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="e.g. SaaS / Technology"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-600">Phone Number</label>
          <input
            {...register("phone")}
            className="w-full h-10 px-3 text-sm bg-white border border-gray-300 rounded-lg focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="e.g. +1 (555) 019-2834"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-600">Lifecycle Status</label>
          <select
            {...register("status")}
            className="w-full h-10 px-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:outline-hidden focus:border-primary"
          >
            <option value="Lead">Lead</option>
            <option value="Prospect">Prospect</option>
            <option value="Active">Active</option>
            <option value="Customer">Customer</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-600">Employee Count</label>
          <input
            type="number"
            {...register("employeeCount")}
            className="w-full h-10 px-3 text-sm bg-white border border-gray-300 rounded-lg focus:outline-hidden"
            placeholder="e.g. 250"
          />
          {errors.employeeCount && <p className="text-xs text-red-500">{errors.employeeCount.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-600">Annual Revenue ($)</label>
          <input
            type="number"
            {...register("annualRevenue")}
            className="w-full h-10 px-3 text-sm bg-white border border-gray-300 rounded-lg focus:outline-hidden"
            placeholder="e.g. 5000000"
          />
          {errors.annualRevenue && <p className="text-xs text-red-500">{errors.annualRevenue.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-600">LinkedIn Profile Link</label>
          <input
            {...register("linkedinHandle")}
            className="w-full h-10 px-3 text-sm bg-white border border-gray-300 rounded-lg focus:outline-hidden"
            placeholder="https://linkedin.com/company/..."
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-600">Twitter Profile Link</label>
          <input
            {...register("twitterHandle")}
            className="w-full h-10 px-3 text-sm bg-white border border-gray-300 rounded-lg focus:outline-hidden"
            placeholder="https://twitter.com/..."
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-600">Corporate Address</label>
        <input
          {...register("address")}
          className="w-full h-10 px-3 text-sm bg-white border border-gray-300 rounded-lg focus:outline-hidden"
          placeholder="123 Market St, Suite 400, San Francisco, CA"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-600">Internal Background Notes</label>
        <textarea
          {...register("notes")}
          rows={3}
          className="w-full p-3 text-sm bg-white border border-gray-300 rounded-lg focus:outline-hidden focus:border-primary"
          placeholder="Enter historical intelligence context regarding this target corporate environment..."
        />
      </div>
    </div>
  );
}

export function Companies() {
  // 1. Hook state mapping
  const { companies, totalRecords, totalPages, isLoading, loadCompanies } = useCompanies();
  const dispatch = useDispatch<any>();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const [page, setPage] = useState(1);
  const limit = 10;
  const [visibleGridLimit, setVisibleGridLimit] = useState(4);

  // Sync background records based on search criteria and pagination shifts
  useEffect(() => {
    loadCompanies({ search, page, limit });
  }, [search, page, loadCompanies]);

  // Form Submissions interceptor pipeline matching exactly how Contacts processes assets
  const handleCreateCompanySubmit = async (
    submissionPayload: FinalCompanySubmissionPayload & { logoFile?: File | null },
  ) => {
    try {
      let uploadedLogoUrl: string | undefined = undefined;

      // File upload processing intercept hook
      if (submissionPayload.logoFile) {
        const uploadResult = await dispatch(
          uploadCompanyLogoThunk(submissionPayload.logoFile),
        ).unwrap();

        uploadedLogoUrl = uploadResult?.file?.url || uploadResult?.url || uploadResult;
      }

      // Payload building parameters mapping out back to service configurations
      const formattedBackendPayload = {
        name: submissionPayload.name,
        domain: submissionPayload.domain,
        industry: submissionPayload.industry,
        phone: submissionPayload.phone,
        status: submissionPayload.status,
        employeeCount: submissionPayload.employeeCount,
        annualRevenue: submissionPayload.annualRevenue,
        address: submissionPayload.address,
        source: submissionPayload.source,
        notes: submissionPayload.notes,
        linkedinHandle: submissionPayload.linkedinHandle,
        twitterHandle: submissionPayload.twitterHandle,
        logoUrl: uploadedLogoUrl,
      };

      await dispatch(
        createNewCompany({ data: formattedBackendPayload as any }),
      ).unwrap();

      // Refresh records list
      loadCompanies({ search, page, limit });
      return { success: true };
    } catch (error: any) {
      console.error("Company execution runtime failure:", error);
      return {
        success: false,
        msg:
          typeof error === "string"
            ? error
            : error?.msg || error?.message || "Failed to finalize company profile.",
      };
    }
  };

  // Instantiate form orchestration logic tracking hooks instance
  const formHook = useCreateCompanyModalForm({
    onClose: () => setIsCreateOpen(false),
    onSubmit: handleCreateCompanySubmit,
  });

  if (isLoading && companies.length === 0) {
    return (
      <main className="mt-header-height md:ml-sidebar-width flex flex-col items-center justify-center min-h-[70vh] bg-background gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground animate-pulse">
          Loading client companies registry database...
        </p>
      </main>
    );
  }

  const handleToggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.size === companies.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(companies.map((c: any) => c.id)));
  };

  const handleLoadMore = () => {
    setVisibleGridLimit((prev) => Math.min(prev + 4, companies.length));
  };

  // Explicit structural Data Table view specifications definitions maps
  const companyColumns: ColumnConfig<any>[] = [
    {
      header: "Company Details",
      render: (company) => {
        const displayTitle = company.name || "Unknown Identity";
        const fallbackSvg = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(displayTitle)}`;
        return (
          <div className="flex items-center gap-3">
            <img
              src={company.logoUrl || fallbackSvg}
              className="w-10 h-10 rounded-lg object-contain p-1 border border-outline-variant bg-white shrink-0 select-none"
              alt=""
            />
            <div className="flex flex-col min-w-0">
              <span className="font-medium text-on-background tracking-tight truncate max-w-[180px]">
                {displayTitle}
              </span>
              {company.domain && (
                <a
                  href={company.domain}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:underline text-[12px] truncate max-w-[160px]"
                >
                  {company.domain.replace(/^https?:\/\/(www\.)?/, "")}
                </a>
              )}
            </div>
          </div>
        );
      },
    },
    {
      header: "Industry",
      render: (company) => (
        <span className="text-on-surface font-medium text-sm">
          {company.industry || <span className="text-outline/40">-</span>}
        </span>
      ),
    },
    {
      header: "Metrics Profile",
      render: (company) => (
        <div className="flex flex-col text-[12px] text-on-surface-variant">
          {company.employeeCount && <span>{company.employeeCount.toLocaleString()} employees</span>}
          {company.annualRevenue && (
            <span className="font-medium text-green-700">
              ${(company.annualRevenue / 1000000).toFixed(1)}M ARR
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Status",
      cellAlignment: "center",
      render: (company) => {
        const statusColors: Record<string, string> = {
          Customer: "bg-green-50 text-green-700 border-green-200",
          Active: "bg-blue-50 text-blue-700 border-blue-200",
          Lead: "bg-purple-50 text-purple-700 border-purple-200",
          Prospect: "bg-orange-50 text-orange-700 border-orange-200",
          Inactive: "bg-gray-50 text-gray-600 border-gray-200",
        };
        const currentStatus = company.status || "Lead";
        return (
          <div className="inline-flex justify-center">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusColors[currentStatus] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
              {currentStatus}
            </span>
          </div>
        );
      },
    },
  ];

  const startRange = (page - 1) * limit + 1;
  const endRange = Math.min(page * limit, totalRecords);

  return (
    <main className="mt-header-height md:ml-sidebar-width overflow-y-auto bg-background p-container-padding">
      <ResourceHeader
        title="Companies"
        description="Manage and query your tracking targets and accounts portfolio."
        totalRecords={totalRecords}
        currentRangeText={`Showing ${startRange}-${endRange}`}
        onCreateClick={() => setIsCreateOpen(true)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        createButtonText="Add Company"
      />

      <div className="flex flex-col gap-6">
        <div className="bg-surface border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col">
          <ResourceToolbar
            searchPlaceholder="Search corporations index..."
            searchValue={search}
            onSearchChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            filtersCount={selectedIds.size > 0 ? 1 : 0}
          />

          {!isLoading && companies.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground bg-surface">
              No registered corporate workspaces found. Track a workspace to initialize metadata metrics.
            </div>
          ) : viewMode === "list" ? (
            <>
              <ResourceTable
                data={companies}
                columns={companyColumns}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
                onToggleSelectAll={handleToggleSelectAll}
                rowActionsRender={() => (
                  <button
                    type="button"
                    className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded transition-all cursor-pointer"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                )}
              />
              <ResourcePagination
                page={page}
                totalPages={totalPages}
                selectedCount={selectedIds.size}
                onPageChange={(newPage) => setPage(newPage)}
              />
            </>
          ) : (
            /* Companies Grid Fallback placeholder mirroring structure logic blocks */
            <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {companies.slice(0, visibleGridLimit).map((comp: any) => (
                <div key={comp.id} className="p-4 border border-outline-variant bg-surface rounded-xl flex flex-col items-center text-center gap-3 shadow-xs">
                  <img src={comp.logoUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${comp.name}`} className="h-12 w-12 object-contain" alt="" />
                  <h4 className="font-bold text-on-background truncate w-full">{comp.name}</h4>
                  <p className="text-xs text-muted-foreground truncate w-full">{comp.industry || "No industry tracked"}</p>
                  {companies.length > visibleGridLimit && (
                    <button onClick={handleLoadMore} className="text-xs text-primary font-medium mt-2 hover:underline">Load More</button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Accessible creation sheet component matching Option Two adjustments */}
      <ResourceCreateSheet
        isOpen={isCreateOpen}
        onClose={formHook.actions.handleClose}
        title="Create Company"
        formId="create-company-sheet-form"
        onSubmit={formHook.actions.handleSubmit}
        isSubmitting={formHook.state.isSubmitting}
        apiError={formHook.state.apiError}
      >
        <CreateCompanyFormFields
          register={formHook.actions.register}
          errors={formHook.state.errors}
          previewUrl={formHook.state.previewUrl}
          handleFileChange={formHook.actions.handleFileChange}
        />
      </ResourceCreateSheet>
    </main>
  );
}