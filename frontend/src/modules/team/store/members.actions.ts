/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { MemberService } from "../services/membersView.service";
import axios from "axios";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.msg ||
      error.response?.data?.message ||
      error.message ||
      fallback
    );
  }
  return fallback;
};

export const fetchOrganizationMembers = createAsyncThunk(
  "members/fetchMembers",
  async (orgId: string, { rejectWithValue }) => {
    try {
      const response =
        await MemberService.getOrganizationMembers(orgId);

      if (response.success) {
        const data = response.data;
        return Array.isArray(data)
          ? data
          : (data as any)?.members || [];
      }


      return rejectWithValue(
        response.msg || "Failed to load workspace members"
      );
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to load workspace members")
      );
    }
  }
);