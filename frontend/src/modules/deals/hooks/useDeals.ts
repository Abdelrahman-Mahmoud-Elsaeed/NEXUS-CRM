/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDeals, createNewDeal, updateExistingDeal, moveDealStage, deleteExistingDeal, fetchPipeline } from "../store/deals.actions";
import type { RootState, AppDispatch } from "@/app/store";
import type { CreateDealPayload, UpdateDealPayload, MoveDealStagePayload } from "../types/deal.types";
import { useNavigate } from "react-router-dom";

export const useDeals = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  // 1. Redux Selectors
  const { items, totalRecords, totalPages, isLoading, isCreating, isUpdating, isMoving, isDeleting, error, pipeline, isLoadingPipeline } =
    useSelector((state: RootState) => state.deals);
  
  // 2. Component/UI State
  const [editingDealId, setEditingDealId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const limit = 50; // Higher limit for Kanban board

  // 3. Data Loading Actions
  const loadDeals = useCallback(
    (params: { search?: string; page?: number; limit?: number; pipelineId?: string; stageId?: string }) => {
      dispatch(fetchDeals({ ...params }));
    },
    [dispatch],
  );

  const loadPipeline = useCallback(
    (pipelineId: string) => {
      dispatch(fetchPipeline(pipelineId));
    },
    [dispatch],
  );

  useEffect(() => {
    loadDeals({ search, page, limit });
  }, [search, page, loadDeals]);

  const addDeal = useCallback(
    async (data: CreateDealPayload) => {
      try {
        await dispatch(createNewDeal({ data })).unwrap();
        loadDeals({ search, page, limit });
        return { success: true };
      } catch (err: any) {
        return {
          success: false,
          msg: err?.message || "Failed to create deal.",
        };
      }
    },
    [dispatch, search, page, loadDeals],
  );

  const updateDeal = useCallback(
    async (id: string, data: UpdateDealPayload) => {
      try {
        await dispatch(updateExistingDeal({ id, data })).unwrap();
        loadDeals({ search, page, limit });
        return { success: true };
      } catch (err: any) {
        return {
          success: false,
          msg: err?.message || "Failed to update deal.",
        };
      }
    },
    [dispatch, search, page, loadDeals],
  );

  const moveDeal = useCallback(
    async (id: string, data: MoveDealStagePayload) => {
      try {
        await dispatch(moveDealStage({ id, data })).unwrap();
        loadDeals({ search, page, limit });
        return { success: true };
      } catch (err: any) {
        return {
          success: false,
          msg: err?.message || "Failed to move deal.",
        };
      }
    },
    [dispatch, search, page, loadDeals],
  );

  const deleteDeal = useCallback(
    async (id: string) => {
      try {
        await dispatch(deleteExistingDeal(id)).unwrap();
        loadDeals({ search, page, limit });
        return { success: true };
      } catch (err: any) {
        return {
          success: false,
          msg: err?.message || "Failed to delete deal.",
        };
      }
    },
    [dispatch, search, page, loadDeals],
  );

  // 4. Centralized Menu Action Dispatcher
  const handleMenuDispatch = useCallback(
    (actionType: string, dealId: string) => {
      switch (actionType) {
        case "edit":
          setEditingDealId(dealId);
          break;
        case "view_details":
          navigate(`/deals/${dealId}`);
          break;
        case "delete":
          console.log(`Trigger delete confirmation for deal: ${dealId}`);
          break;
        default:
          console.warn(`Unmapped action type: "${actionType}" for deal: ${dealId}`);
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
        : new Set(items.map((d: any) => d.id)),
    );
  }, [items]);

  const startRange = (page - 1) * limit + 1;
  const endRange = Math.min(page * limit, totalRecords);

  // Calculate total pipeline value
  const totalPipelineValue = items.reduce((sum, deal) => {
    if (deal.value) {
      return sum + parseFloat(deal.value);
    }
    return sum;
  }, 0);

  return {
    deals: items,
    totalRecords,
    totalPages,
    isLoading,
    isCreating,
    isUpdating,
    isMoving,
    isDeleting,
    error,
    pipeline,
    isLoadingPipeline,
    isCreateModalOpen,
    setIsCreateModalOpen,
    editingDealId,
    setEditingDealId,
    handleMenuDispatch,
    selectedIds,
    search,
    setSearch,
    viewMode,
    setViewMode,
    page,
    setPage,
    startRange,
    endRange,
    addDeal,
    updateDeal,
    moveDeal,
    deleteDeal,
    handleToggleSelect,
    handleToggleSelectAll,
    loadPipeline,
    totalPipelineValue,
  };
};
