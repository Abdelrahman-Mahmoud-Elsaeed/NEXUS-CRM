/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { OrganizationService } from "../services/organization.service";
import type { AcceptInviteRequestDto } from "../types/organization.types";
import { fetchOrganizationMembers } from "./members.actions";

const isAxiosErrorLike = (error: unknown): error is { response?: { data?: { message?: string, reason?: string } }; message?: string } => {
  return typeof error === "object" && error !== null && ("response" in error || "message" in error);
};

const getInviteReasonMessage = (reason?: string) => {
  switch (reason) {
    case "UNAUTHORIZED": return "You are not authorized to send invitations.";
    case "ORGANIZATION_MISMATCH": return "The selected organization does not match your current session.";
    case "USER_ALREADY_MEMBER": return "This user is already a member of the workspace.";
    case "INVITE_ALREADY_PENDING": return "An invitation for this user is already pending.";
    case "DATABASE_ERROR": return "Unable to send invitation due to a server error. Please try again.";
    default: return "Failed to process invitation sequence.";
  }
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (isAxiosErrorLike(error)) {
    const reason = error.response?.data?.reason;
    if (reason) return getInviteReasonMessage(reason);
    return error.response?.data?.message || error.message || fallback;
  }
  return fallback;
};

// 1. Core Outbound Workspace Invitation Create Endpoint
export const createWorkspaceInvitation = createAsyncThunk(
  "invitations/create",
  async (
    payload: { orgId: string; email: string; role: "MEMBER" | "ADMIN" },
    { rejectWithValue }
  ) => {
    try {
      const response = await OrganizationService.inviteUser(payload.orgId, {
        email: payload.email,
        role: payload.role,
      });

      if (response.success) return response.data;
      return rejectWithValue(getInviteReasonMessage(response.reason));
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error, "Failed to send invitation."));
    }
  }
);

// 2. Fetch Active Workspace Outbound Invitations Array
export const fetchWorkspaceInvitations = createAsyncThunk(
  "invitations/fetchAll",
  async (orgId: string, { rejectWithValue }) => {
    try {
      const response = await OrganizationService.getWorkspaceInvitations(orgId);
      if (response.success) return response.data || [];
      return rejectWithValue(response.reason || "Failed to load invitations.");
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to load invitations."));
    }
  }
);

// 3. Accept Outbound App Workspace Invitation Link
export const acceptWorkspaceInvitation = createAsyncThunk(
  "invitations/accept",
  async ({ currentOrgId, data }: { currentOrgId: string | null; data: AcceptInviteRequestDto }, { dispatch, rejectWithValue }) => {
    try {
      const response = await OrganizationService.acceptInvite(data);
      if (response.success) {
        if (currentOrgId && response.data?.organizationId === currentOrgId) {
          dispatch(fetchWorkspaceInvitations(currentOrgId));
          dispatch(fetchOrganizationMembers(currentOrgId));
        }
        return response.data;
      }
      return rejectWithValue(response.reason || "Failed to accept invitation.");
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to accept invitation."));
    }
  }
);

// 4. Respond to landing-page email token invitation actions
export const respondToWorkspaceInvitation = createAsyncThunk(
  "invitations/respondToToken",
  async (
    payload: { token: string; decision: "accept" | "decline" },
    { rejectWithValue }
  ) => {
    try {
      if (payload.decision === "decline") {
        return { decision: "declined" as const, message: "Invitation safely declined. You can close this tab." };
      }

      const response = await OrganizationService.acceptInvite({ token: payload.token });
      if (response.success) {
        return { decision: "accepted" as const, message: "Successfully accepted! Redirecting..." };
      }
      return rejectWithValue(response.reason || "Failed to accept invitation. Please try again.");
    } catch (error: any) {
      return rejectWithValue("Network error occurred. Please try again.");
    }
  }
);

export const fetchInvitationDetailsByToken = createAsyncThunk(
  "invitations/fetchDetailsByToken",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await OrganizationService.getInvitationDetailsByToken(token);
      if (response.success && response.data) return response.data;
      return rejectWithValue(response.reason || "Failed to fetch invitation details");
    } catch (error: any) {
      return rejectWithValue(error.message || "An error occurred while fetching invitation details");
    }
  }
);