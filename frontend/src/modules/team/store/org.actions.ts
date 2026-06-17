import { createAsyncThunk } from "@reduxjs/toolkit";
import { OrganizationService } from "../services/organization.service";
import axios from "axios";

export interface CachedOrganization {
  id: string;
  name: string;
  role: string;
  avatar?: string | null;
}

/**
 * Unified error extractor (ONLY msg)
 */
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

// ================= FETCH ORGS =================
export const fetchUserOrganizations = createAsyncThunk(
  "org/fetchOrganizations",
  async (_, { rejectWithValue }) => {
    try {
      const response =
        await OrganizationService.getUserOrganizations();

      if (response.success) return response.data;

      return rejectWithValue(
        response.msg || "Failed to fetch organizations"
      );
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch organizations")
      );
    }
  }
);

// ================= CONFIGURE WORKSPACE =================
export const configureWorkspace = createAsyncThunk(
  "org/configureWorkspace",
  async (
    payload: {
      orgId: string;
      name: string;
      avatarFile: File | null;
    },
    { rejectWithValue }
  ) => {
    try {
      await OrganizationService.updateOrganizationName(
        payload.orgId,
        payload.name
      );

      let detectedAvatarUrl: string | null = null;

      if (payload.avatarFile) {
        const uploadResponse =
          await OrganizationService.uploadAvatar(payload.avatarFile);

        if (uploadResponse.success) {
          detectedAvatarUrl =
            uploadResponse.data?.file?.url || null;
        }
      }

      return {
        id: payload.orgId,
        name: payload.name,
        avatar: detectedAvatarUrl,
      };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(
          error,
          "Workspace configuration failed."
        )
      );
    }
  }
);