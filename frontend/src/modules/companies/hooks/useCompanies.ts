/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanies, createNewCompany } from "../store/companies.actions";
import type { RootState, AppDispatch } from "@/app/store";
import type { CreateCompanyPayload } from "../types/company.types";
import { Role } from "@/modules/auth/types/auth.types";
import { useNavigate } from "react-router-dom";

export const useCompanies = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // 1. Redux Selectors
  const { items, totalRecords, totalPages, isLoading, isCreating, error } =
    useSelector((state: RootState) => state.companies);
  const { organizations, currentOrganizationId } = useSelector(
    (state: RootState) => state.org,
  );

  // 2. Component/UI State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null);
  const [addDealCompanyId, setAddDealCompanyId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [page, setPage] = useState(1);
  const [visibleGridLimit, setVisibleGridLimit] = useState(4);
  const limit = 10;

  // 3. Dynamic Case-Insensitive Role Normalization
  const currentOrganization = organizations.find(
    (org) => org.id === currentOrganizationId,
  );
  const currentRoleString = currentOrganization?.role || "";
  const role: Role =
    Object.values(Role).find(
      (val) => val.toLowerCase() === currentRoleString.toLowerCase(),
    ) ?? Role.Member;

  // 4. Data Loading Actions
  const loadCompanies = useCallback(
    (params: { search?: string; page?: number; limit?: number }) => {
      dispatch(fetchCompanies({ ...params }));
    },
    [dispatch],
  );

  useEffect(() => {
    loadCompanies({ search, page, limit });
  }, [search, page, loadCompanies]);

  // 5. Data Mutating Actions matching CreateContactModal onSubmit signature
  const addCompany = useCallback(
    async (data: CreateCompanyPayload) => {
      try {
        await dispatch(createNewCompany({ data })).unwrap();
        loadCompanies({ search, page, limit });
        return { success: true };
      } catch (err: any) {
        return {
          success: false,
          msg: err?.message || "Failed to create company record.",
        };
      }
    },
    [dispatch, search, page, loadCompanies],
  );

  // 6. Centralized Menu Action Dispatcher
  const handleMenuDispatch = useCallback(
    (actionType: string, companyId: string) => {
      switch (actionType) {
        case "edit":
          setEditingCompanyId(companyId);
          break;
        case "send_message":
          console.log(
            `Initialize message thread window for company key profile: ${companyId}`,
          );
          break;
        case "view_details":
          navigate(`/companies/${companyId}`);
          break;
        case "view_deals":
          navigate(`/companies/${companyId}/deals`);
          break;
        case "add_deal":
          setAddDealCompanyId(companyId);
          break;
        case "delete":
          console.log(
            `Trigger critical delete warning dialog alert for company: ${companyId}`,
          );
          break;
        default:
          console.warn(
            `Unmapped structural operation type triggered: "${actionType}" for company: ${companyId}`,
          );
      }
    },
    [],
  );

  // 7. Selection & Pagination Utility Handlers
  const handleToggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleToggleSelectAll = useCallback(() => {
    setSelectedIds((prev) =>
      prev.size === items.length
        ? new Set()
        : new Set(items.map((c: any) => c.id)),
    );
  }, [items]);

  const handleLoadMore = useCallback(() => {
    setVisibleGridLimit((prev) => Math.min(prev + 4, items.length));
  }, [items.length]);

  const startRange = totalRecords === 0 ? 0 : (page - 1) * limit + 1;
  const endRange = Math.min(page * limit, totalRecords);

  return {
    companies: items,
    totalRecords,
    totalPages,
    isLoading,
    isCreating,
    error,
    role,
    isCreateModalOpen,
    setIsCreateModalOpen,
    editingCompanyId,
    setEditingCompanyId,
    addDealCompanyId,
    setAddDealCompanyId,
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
  };
};
