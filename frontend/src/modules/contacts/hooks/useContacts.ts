/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContacts, createNewContact } from "../store/contacts.actions";
import type { RootState, AppDispatch } from "@/app/store";
import type { CreateContactPayload } from "../types/contact.types";
import { Role } from "@/modules/auth/types/auth.types";
import { useNavigate } from "react-router-dom";

export const useContacts = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  // 1. Redux Selectors
  const { items, totalRecords, totalPages, isLoading, isCreating, error } =
    useSelector((state: RootState) => state.contacts);
  const { organizations, currentOrganizationId } = useSelector(
    (state: RootState) => state.org,
  );
  
  // 2. Component/UI State
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const [attachingCompanyContactId, setAttachingCompanyContactId] = useState<string | null>(null);
  // Added local state tracker instance for member modal context assignments
  const [attachingMemberContactId, setAttachingMemberContactId] = useState<string | null>(null);
  const [moveToDealContactId, setMoveToDealContactId] = useState<string | null>(null);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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
  const loadContacts = useCallback(
    (params: { search?: string; page?: number; limit?: number }) => {
      dispatch(fetchContacts({ ...params }));
    },
    [dispatch],
  );

  useEffect(() => {
    loadContacts({ search, page, limit });
  }, [search, page, loadContacts]);

  const addContact = useCallback(
    async (data: CreateContactPayload) => {
      try {
        await dispatch(createNewContact({ data })).unwrap();
        loadContacts({ search, page, limit });
        return { success: true };
      } catch (err: any) {
        return {
          success: false,
          msg: err?.message || "Failed to create contact resource.",
        };
      }
    },
    [dispatch, search, page, loadContacts],
  );

  // New Action handlers for attaching companies
  const handleLinkExistingCompany = useCallback(
    async (contactId: string, companyId: string) => {
      try {
        console.log(`Linking existing company ${companyId} to contact ${contactId}`);
        loadContacts({ search, page, limit });
      } catch (err) {
        console.error("Failed to link company", err);
      }
    },
    [loadContacts, search, page]
  );

  const handleCreateAndLinkCompany = useCallback(
    async (contactId: string, data: { name: string; domain: string; industry: string }) => {
      try {
        console.log(`Creating and linking new company for contact ${contactId}`, data);
        loadContacts({ search, page, limit });
      } catch (err) {
        console.error("Failed to create and link company", err);
      }
    },
    [loadContacts, search, page]
  );

  // 6. Centralized Menu Action Dispatcher
  const handleMenuDispatch = useCallback(
    (actionType: string, contactId: string) => {
      switch (actionType) {
        case "edit":
          setEditingContactId(contactId);
          break;
        case "send_message":
          console.log(`Initialize message thread window for contact: ${contactId}`);
          break;
        case "view_details":
          navigate(`/contacts/${contactId}`);
          break;
        case "move_deal":
          setMoveToDealContactId(contactId);
          break;
        case "attach_company":
          setAttachingCompanyContactId(contactId);
          break;
        case "attach_employee":
          // Mapped directly to update state and trigger your AttachMemberDialog component
          setAttachingMemberContactId(contactId);
          break;
        case "delete":
          console.log(`Trigger critical delete warning dialog alert for contact: ${contactId}`);
          break;
        default:
          console.warn(`Unmapped structural operation type triggered: "${actionType}" for contact: ${contactId}`);
      }
    },
    [navigate],
  );

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

  const startRange = (page - 1) * limit + 1;
  const endRange = Math.min(page * limit, totalRecords);

  return {
    contacts: items,
    totalRecords,
    totalPages,
    isLoading,
    isCreating,
    error,
    role,
    currentOrganizationId, // Exposed to fetch workspace member scopes
    isCreateModalOpen,
    setIsCreateModalOpen,
    editingContactId,
    setEditingContactId,
    attachingCompanyContactId,
    setAttachingCompanyContactId,
    attachingMemberContactId,      // Exposed state variable
    setAttachingMemberContactId,   // Exposed state setter function
    moveToDealContactId,
    setMoveToDealContactId,
    handleMenuDispatch,
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
    addContact,
    handleToggleSelect,
    handleToggleSelectAll,
    handleLoadMore,
    handleLinkExistingCompany,
    handleCreateAndLinkCompany,
  };
};