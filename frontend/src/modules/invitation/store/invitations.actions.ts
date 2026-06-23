/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AcceptInviteRequestDto } from "../types/invitation.types";
import axios from "axios";
import { fetchUserOrganizations } from "@/modules/team/store/org.actions";
import { fetchOrganizationMembers } from "@/modules/team/store/members.actions";
import { InvitationService } from "../services/invitation.service";

/**
 * Extract ONLY backend msg safely
 */
const getErrorMsg = (error: unknown, fallback: string) => {
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

// ================= CREATE INVITATION =================
export const createWorkspaceInvitation = createAsyncThunk(
  "invitations/create",
  async (
    payload: { orgId: string; email: string; role: "Member" | "Admin" },
    { rejectWithValue },
  ) => {
    try {
      const response = await InvitationService.inviteUser(payload.orgId, {
        email: payload.email,
        role: payload.role,
      });

      if (response.success) return response.data;

      return rejectWithValue(response.msg || "Failed to send invitation.");
    } catch (error) {
      return rejectWithValue(getErrorMsg(error, "Failed to send invitation."));
    }
  },
);

// ================= FETCH INVITATIONS =================
export const fetchWorkspaceInvitations = createAsyncThunk(
  "invitations/fetchAll",
  async (orgId: string, { rejectWithValue }) => {
    try {
      const response = await InvitationService.getWorkspaceInvitations(orgId);
      
      if (response.success) return response.data || [];

      return rejectWithValue(response.msg || "Failed to load invitations.");
    } catch (error) {
      return rejectWithValue(getErrorMsg(error, "Failed to load invitations."));
    }
  },
);

// ================= ACCEPT INVITATION =================
export const acceptWorkspaceInvitation = createAsyncThunk(
  "invitations/accept",
  async (
    {
      currentOrgId,
      data,
    }: {
      currentOrgId: string | null;
      data: AcceptInviteRequestDto;
    },
    { dispatch, rejectWithValue },
  ) => {
    try {
      const response = await InvitationService.acceptInvite(data);

      if (response.success) {
        dispatch(fetchUserOrganizations());

        if (currentOrgId && response.data?.organizationId === currentOrgId) {
          dispatch(fetchWorkspaceInvitations(currentOrgId));
          dispatch(fetchOrganizationMembers(currentOrgId));
        }

        return response.data;
      }

      return rejectWithValue(response.msg || "Failed to accept invitation.");
    } catch (error) {
      return rejectWithValue(
        getErrorMsg(error, "Failed to accept invitation."),
      );
    }
  },
);

// ================= TOKEN INVITATION FLOW =================
export const respondToWorkspaceInvitation = createAsyncThunk(
  "invitations/respondToToken",
  async (
    payload: { token: string; decision: "accept" | "decline" },
    { rejectWithValue },
  ) => {
    try {
      if (payload.decision === "decline") {
        return {
          decision: "declined" as const,
          message: "Invitation declined successfully.",
        };
      }

      const response = await InvitationService.acceptInvite({
        token: payload.token,
      });

      if (response.success) {
        return {
          decision: "accepted" as const,
          message: "Invitation accepted successfully.",
        };
      }

      return rejectWithValue(response.msg || "Failed to accept invitation.");
    } catch (error) {
      return rejectWithValue(getErrorMsg(error, "Network error occurred."));
    }
  },
);

// ================= FETCH BY TOKEN =================
export const fetchInvitationDetailsByToken = createAsyncThunk(
  "invitations/fetchDetailsByToken",
  async (token: string, { rejectWithValue }) => {
    try {
      const response =
        await InvitationService.getInvitationDetailsByToken(token);

      if (response.success) return response.data;

      return rejectWithValue(
        response.msg || "Failed to fetch invitation details",
      );
    } catch (error: any) {
      return rejectWithValue(
        getErrorMsg(error, "Failed to fetch invitation details"),
      );
    }
  },
);
