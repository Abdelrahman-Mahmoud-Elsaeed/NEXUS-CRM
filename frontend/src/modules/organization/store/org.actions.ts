/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { OrganizationService } from "../services/organization.service";

export interface CachedOrganization {
  id: string;
  name: string;
  role: string;
  avatar?: string | null;
}

// 1. Fetch entire accessible spaces matrix belonging to user identity
export const fetchUserOrganizations = createAsyncThunk(
  "org/fetchOrganizations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await OrganizationService.getUserOrganizations();
      if (response.success) return response.data;
      return rejectWithValue(response.reason || "Failed to fetch organizations");
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.reason || "UNKNOWN_ERROR");
    }
  }
);

// 2. Configure structural workspace text updates and avatar uploads
export const configureWorkspace = createAsyncThunk(
  "org/configureWorkspace",
  async (payload: { orgId: string; name: string; avatarFile: File | null }, { rejectWithValue }) => {
    try {
      await OrganizationService.updateOrganizationName(payload.orgId, payload.name);
      let detectedAvatarUrl: string | null = null;

      if (payload.avatarFile) {
        const uploadResponse = await OrganizationService.uploadAvatar(payload.avatarFile);
        if (uploadResponse.success && uploadResponse.data?.file?.url) {
          detectedAvatarUrl = uploadResponse.data.file.url;
        }
      }
      return { id: payload.orgId, name: payload.name, avatar: detectedAvatarUrl };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.reason || "Workspace configuration failed.");
    }
  }
);