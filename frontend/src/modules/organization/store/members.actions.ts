/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { MembersViewService } from "../services/membersView.service";

const isAxiosErrorLike = (error: unknown): error is { response?: { data?: { message?: string; reason?: string } }; message?: string } => {
  return typeof error === "object" && error !== null && ("response" in error || "message" in error);
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (isAxiosErrorLike(error)) {
    return error.response?.data?.message || error.message || fallback;
  }
  return fallback;
};

export const fetchOrganizationMembers = createAsyncThunk(
  "members/fetchMembers",
  async (orgId: string, { rejectWithValue }) => {
    try {
      const response = await MembersViewService.fetchOrganizationMembers(orgId);
      
      if (response.success) {
        const data = response.data;
        return Array.isArray(data) ? data : (data as any)?.members || [];
      }
      
      return rejectWithValue(response.reason || "Failed to load workspace members");
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to load workspace members"));
    }
  }
);