/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Building2,
  Search,
  PlusCircle,
  CheckCircle2,
  Info,
  Loader2,
} from "lucide-react";
import { FormDialog } from "@/shared/ui/resource/FormDialog";
import { cn } from "@/shared/utils/utils";
import type { AppDispatch, RootState } from "@/app/store";
import {
  fetchContacts,
  updateExistingContact,
} from "../store/contacts.actions";
import { createNewCompany, fetchCompanies } from "@/modules/companies/store/companies.actions";

interface AttachCompanyDialogProps {
  contactId: string | null;
  onClose: () => void;
}

export function AttachCompanyDialog({
  contactId,
  onClose,
}: AttachCompanyDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const isOpen = !!contactId;

  // 1. Redux Selectors for live Companies Store
  // Note: Adjust 'state.companies' depending on your exact RootState reducer layout name
  const { items: companiesList, isLoading: isCompaniesLoading } = useSelector(
    (state: RootState) => state.companies || { items: [], isLoading: false }
  );

  const [activeTab, setActiveTab] = React.useState<"existing" | "new">("existing");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCompanyId, setSelectedCompanyId] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [newCompany, setNewCompany] = React.useState({
    name: "",
    domain: "",
    industry: "",
  });

  // 2. Fetch companies from the backend when the dialog opens or search changes
  React.useEffect(() => {
    if (!isOpen) return;

    // Trigger basic debounced search behavior natively
    const delayDebounceFn = setTimeout(() => {
      dispatch(fetchCompanies({ search: searchQuery, page: 1, limit: 20 }));
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [isOpen, searchQuery, dispatch]);

  const handleNewCompanyInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setNewCompany((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactId) return;

    setIsSubmitting(true);
    try {
      if (activeTab === "existing") {
        if (!selectedCompanyId) return;

        // Mode 1: Link Existing -> Just update the contact's companyId directly
        await dispatch(
          updateExistingContact({
            id: contactId,
            data: { companyId: selectedCompanyId } as any,
          }),
        ).unwrap();
      } else {
        if (!newCompany.name.trim()) return;

        // Mode 2: Create New -> Step 1: Dispatch creation action
        const companyResponse = await dispatch(
          createNewCompany({ data: newCompany as any }),
        ).unwrap();

        const newlyCreatedCompanyId = companyResponse?.data?.id;

        if (!newlyCreatedCompanyId) {
          throw new Error(
            "Company created successfully, but no valid ID was returned.",
          );
        }

        // Mode 2 -> Step 2: Use the new ID to update the contact's company reference immediately
        await dispatch(
          updateExistingContact({
            id: contactId,
            data: { companyId: newlyCreatedCompanyId } as any,
          }),
        ).unwrap();
      }

      // Refresh the contact datagrid list cache entirely at the source view
      dispatch(fetchContacts({ page: 1, limit: 10 }));
      onClose();
    } catch (err) {
      console.error("Failed to execute sequential attachment chain:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormDialog
      open={isOpen}
      onOpenChange={onClose}
      onSubmit={handleSubmit}
      className="w-full max-w-[560px] p-0 overflow-hidden"
      headerContent={
        <div className="flex items-center gap-3 w-full text-left">
          <div className="w-10 h-10 rounded-lg bg-primary-container/10 text-primary flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-h3 text-h3 text-on-surface text-lg font-semibold">
              Attach to Company
            </h3>
          </div>
        </div>
      }
      footerContent={
        <div className="flex justify-end gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 font-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-all"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={
              isSubmitting || (activeTab === "existing" && !selectedCompanyId)
            }
            className="px-6 py-2 bg-primary text-on-primary font-label-md rounded-lg hover:shadow-lg hover:shadow-primary/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? "Linking..."
              : activeTab === "existing"
                ? "Link Company"
                : "Create & Link"}
          </button>
        </div>
      }
    >
      <div>
        <div className="px-6 pt-4">
          <div className="flex p-1 bg-surface-container-low rounded-lg border border-outline-variant">
            <button
              type="button"
              onClick={() => setActiveTab("existing")}
              className={cn(
                "flex-1 py-2 font-label-md rounded-md transition-all text-sm font-medium",
                activeTab === "existing"
                  ? "bg-white text-primary shadow-sm border border-outline-variant/50"
                  : "text-on-surface-variant hover:text-on-surface",
              )}
            >
              Link Existing
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("new")}
              className={cn(
                "flex-1 py-2 font-label-md rounded-md transition-all text-sm font-medium",
                activeTab === "new"
                  ? "bg-white text-primary shadow-sm border border-outline-variant/50"
                  : "text-on-surface-variant hover:text-on-surface",
              )}
            >
              Create New
            </button>
          </div>
        </div>

        <div className="p-6 text-left">
          {activeTab === "existing" ? (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="font-label-sm text-sm text-on-surface-variant">
                  Search Companies
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-outline-variant rounded-lg text-body-base focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all"
                    placeholder="Type company name or domain..."
                  />
                  {isCompaniesLoading && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-primary" />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-label-sm text-xs font-semibold text-on-surface-variant">
                  Results
                </p>
                <div className="space-y-1 max-h-[220px] overflow-y-auto pr-1">
                  {companiesList.length === 0 && !isCompaniesLoading ? (
                    <p className="text-sm text-on-surface-variant/70 italic p-4 text-center">
                      No companies found matching "{searchQuery}"
                    </p>
                  ) : (
                    companiesList.map((company: any) => {
                      const isSelected = selectedCompanyId === company.id;
                      return (
                        <div
                          key={company.id}
                          onClick={() => setSelectedCompanyId(company.id)}
                          className={cn(
                            "flex items-center gap-4 p-3 rounded-xl border cursor-pointer group transition-all",
                            isSelected
                              ? "border-primary/20 bg-primary/5"
                              : "border-transparent hover:border-outline-variant hover:bg-surface-container-low",
                          )}
                        >
                          <div className="w-10 h-10 rounded-lg border border-outline-variant bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
                            {company.logoUrl ? (
                              <img
                                className="w-8 h-8 object-contain"
                                src={company.logoUrl}
                                alt={company.name}
                              />
                            ) : (
                              <Building2 className="w-5 h-5 text-on-surface-variant" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-label-md text-sm font-medium text-on-surface truncate">
                              {company.name}
                            </p>
                            <p className="font-body-sm text-xs text-on-surface-variant truncate">
                              {company.domain || "No domain recorded"}
                            </p>
                          </div>
                          {isSelected ? (
                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                          ) : (
                            <PlusCircle className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5">
                <div className="space-y-2">
                  <label className="font-label-sm text-sm text-on-surface-variant">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newCompany.name}
                    onChange={handleNewCompanyInputChange}
                    className="w-full px-4 py-2.5 bg-white border border-outline-variant rounded-lg text-body-base focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all"
                    placeholder="e.g. Acme Corp"
                    required={activeTab === "new"}
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label-sm text-sm text-on-surface-variant">
                    Domain
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/70 text-body-base">
                      https://
                    </span>
                    <input
                      type="text"
                      name="domain"
                      value={newCompany.domain}
                      onChange={handleNewCompanyInputChange}
                      className="w-full pl-16 pr-4 py-2.5 bg-white border border-outline-variant rounded-lg text-body-base focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all"
                      placeholder="example.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="font-label-sm text-sm text-on-surface-variant">
                    Industry
                  </label>
                  <select
                    name="industry"
                    value={newCompany.industry}
                    onChange={handleNewCompanyInputChange}
                    className="w-full px-4 py-2.5 bg-white border border-outline-variant rounded-lg text-body-base focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled>
                      Select industry...
                    </option>
                    <option value="Software & SaaS">Software & SaaS</option>
                    <option value="Financial Services">Financial Services</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Education">Education</option>
                  </select>
                </div>
              </div>
              <div className="p-4 bg-surface-container-low rounded-lg border border-outline-variant flex items-start gap-3">
                <Info className="text-primary w-5 h-5 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-on-surface-variant leading-normal">
                  Creating a new company will automatically link it to the
                  selected contact and add it to your global organization list.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </FormDialog>
  );
}