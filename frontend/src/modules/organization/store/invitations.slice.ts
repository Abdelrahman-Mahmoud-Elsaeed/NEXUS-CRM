/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
import {
  respondToWorkspaceInvitation,
  fetchInvitationDetailsByToken,
  createWorkspaceInvitation,
  fetchWorkspaceInvitations,
  acceptWorkspaceInvitation,
} from "./invitations.actions";
import { logout } from "@/modules/auth/store/auth.slice";
import type { InvitationDto } from "../types/organization.types";

export interface InvitationDetails {
  email: string;
  workspaceName: string;
  inviterName: string;
  inviterRole: string;
  token: string;
  expiresAt: string;
  isExistingUser?: boolean;
}

export interface InvitationsState {
  invitations: InvitationDto[];
  isLoadingInvitations: boolean;
  invitationsError: string | null;
  isInviting: boolean;
  inviteSubmissionError: string | null;
  isAccepting: boolean;
  isProcessingInviteAction: boolean;
  inviteActionStatus: "pending" | "accepted" | "declined";
  inviteActionFeedback: string | null;
  activeInvitation: InvitationDetails | null;
  isFetchingInvitation: boolean;
  invitationFetchError: string | null;
}

const initialState: InvitationsState = {
  invitations: [],
  isLoadingInvitations: false,
  invitationsError: null,
  isInviting: false,
  inviteSubmissionError: null,
  isAccepting: false,
  isProcessingInviteAction: false,
  inviteActionStatus: "pending",
  inviteActionFeedback: null,
  activeInvitation: null,
  isFetchingInvitation: true,
  invitationFetchError: null,
};

export const invitationsSlice = createSlice({
  name: "invitations",
  initialState,
  reducers: {
    clearInvitationsState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Outbound Form Creation Invites (Instant Cache Injection)
      .addCase(createWorkspaceInvitation.pending, (state) => {
        state.isInviting = true;
        state.inviteSubmissionError = null;
      })
      .addCase(createWorkspaceInvitation.fulfilled, (state, action) => {
        state.isInviting = false;
        console.log(action.payload)
        const newInvitation = action.payload?.data || action.payload;
        if (newInvitation) {
          state.invitations.unshift(newInvitation);
        }
      })
      .addCase(createWorkspaceInvitation.rejected, (state, action) => {
        state.isInviting = false;
        state.inviteSubmissionError = action.payload as string;
      })

      // Fetch Active Workspace In-Flight Outbound Arrays
      .addCase(fetchWorkspaceInvitations.pending, (state) => {
        state.isLoadingInvitations = true;
        state.invitationsError = null;
      })
      .addCase(fetchWorkspaceInvitations.fulfilled, (state, action) => {
        state.isLoadingInvitations = false;
        console.log(action.payload)
        state.invitations = action.payload || [];
      })
      .addCase(fetchWorkspaceInvitations.rejected, (state, action) => {
        state.isLoadingInvitations = false;
        state.invitationsError = action.payload as string;
      })

      // Inbound Dashboard/Link Acceptance Vectors
      .addCase(acceptWorkspaceInvitation.pending, (state) => {
        state.isAccepting = true;
      })
      .addCase(acceptWorkspaceInvitation.fulfilled, (state) => {
        state.isAccepting = false;
      })
      .addCase(acceptWorkspaceInvitation.rejected, (state) => {
        state.isAccepting = false;
      })

      // Landing-Page Anonymous Token Form Interactions
      .addCase(respondToWorkspaceInvitation.pending, (state) => {
        state.isProcessingInviteAction = true;
        state.inviteActionFeedback = null;
      })
      .addCase(respondToWorkspaceInvitation.fulfilled, (state, action) => {
        state.isProcessingInviteAction = false;
        state.inviteActionStatus = action.payload.decision;
        state.inviteActionFeedback = action.payload.message;
      })
      .addCase(respondToWorkspaceInvitation.rejected, (state, action) => {
        state.isProcessingInviteAction = false;
        state.inviteActionFeedback = action.payload as string;
      })

      // Token Content Verification Parameter Parsing
      .addCase(fetchInvitationDetailsByToken.pending, (state) => {
        state.isFetchingInvitation = true;
        state.invitationFetchError = null;
        state.activeInvitation = null;
      })
      .addCase(fetchInvitationDetailsByToken.fulfilled, (state, action) => {
        state.isFetchingInvitation = false;
        state.activeInvitation = action.payload;
      })
      .addCase(fetchInvitationDetailsByToken.rejected, (state, action) => {
        state.isFetchingInvitation = false;
        state.invitationFetchError = action.payload as string;
      })

      .addCase(logout, () => initialState);
  },
});

export const { clearInvitationsState } = invitationsSlice.actions;
export const selectInvitations = (state: { invitations: InvitationsState }) => state.invitations;
export default invitationsSlice.reducer;