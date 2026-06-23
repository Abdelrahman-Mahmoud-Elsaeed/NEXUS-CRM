// src/modules/deals/store/deals.actions.ts
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { dealService } from "../services/deal.service";
import type { CreateDealPayload, UpdateDealPayload, MoveDealStagePayload } from "../types/deal.types";

const getErrorMsg = (error: any) => {
  return (
    error?.response?.data?.msg ||
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong."
  );
};

export const fetchDeals = createAsyncThunk(
  "deals/fetchDeals",
  async (
    payload: { search?: string; page?: number; limit?: number; pipelineId?: string; stageId?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await dealService.getDeals(payload);
      if (response.success) {
        return response;
      }
      return rejectWithValue((response as any).msg || "Failed to fetch deals");
    } catch (error: any) {
      return rejectWithValue(getErrorMsg(error));
    }
  }
);

export const fetchDeal = createAsyncThunk(
  "deals/fetchDeal",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await dealService.getDeal(id);
      if (response.success) {
        return response;
      }
      return rejectWithValue((response as any).msg || "Failed to fetch deal");
    } catch (error: any) {
      return rejectWithValue(getErrorMsg(error));
    }
  }
);

export const createNewDeal = createAsyncThunk(
  "deals/createDeal",
  async (
    payload: { data: CreateDealPayload },
    { rejectWithValue }
  ) => {
    try {
      const response = await dealService.createDeal(payload.data);
      if (response.success) {
        return response;
      }
      return rejectWithValue((response as any).msg || "Failed to create deal");
    } catch (error: any) {
      return rejectWithValue(getErrorMsg(error));
    }
  }
);

export const updateExistingDeal = createAsyncThunk(
  "deals/updateDeal",
  async (
    payload: { id: string; data: UpdateDealPayload },
    { rejectWithValue }
  ) => {
    try {
      const response = await dealService.updateDeal(payload.id, payload.data);
      if (response.success) {
        return response;
      }
      return rejectWithValue((response as any).msg || "Failed to update deal");
    } catch (error: any) {
      return rejectWithValue(getErrorMsg(error));
    }
  }
);

export const moveDealStage = createAsyncThunk(
  "deals/moveDealStage",
  async (
    payload: { id: string; data: MoveDealStagePayload },
    { rejectWithValue }
  ) => {
    try {
      const response = await dealService.moveDealStage(payload.id, payload.data);
      if (response.success) {
        return response;
      }
      return rejectWithValue((response as any).msg || "Failed to move deal stage");
    } catch (error: any) {
      return rejectWithValue(getErrorMsg(error));
    }
  }
);

export const deleteExistingDeal = createAsyncThunk(
  "deals/deleteDeal",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await dealService.deleteDeal(id);
      if (response.success) {
        return { id, ...response };
      }
      return rejectWithValue((response as any).msg || "Failed to delete deal");
    } catch (error: any) {
      return rejectWithValue(getErrorMsg(error));
    }
  }
);

export const fetchPipeline = createAsyncThunk(
  "deals/fetchPipeline",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await dealService.getPipeline(id);
      if (response.success) {
        return response;
      }
      return rejectWithValue((response as any).msg || "Failed to fetch pipeline");
    } catch (error: any) {
      return rejectWithValue(getErrorMsg(error));
    }
  }
);
