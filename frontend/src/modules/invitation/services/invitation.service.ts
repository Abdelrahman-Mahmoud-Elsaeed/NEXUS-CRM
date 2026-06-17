/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/lib/axios";
import type { ApiResponse } from "@/modules/auth/types/auth.types";
import type {
  AcceptInviteRequestDto,
  InvitationDto,
  InviteUserRequestDto,
} from "../types/invitation.types";

const BASE = "/invitation";

export const InvitationService = {
  getWorkspaceInvitations: async (
    organizationId: string
  ): Promise<ApiResponse<InvitationDto[]>> => {
    const response = await api.get(`${BASE}/${organizationId}/invites`);
    return response.data;
  },

  getWorkspaceInviteByToken: async (
    organizationId: string,
    token: string
  ): Promise<ApiResponse<InvitationDto>> => {
    const response = await api.get(
      `${BASE}/${organizationId}/invites/${token}`
    );
    return response.data;
  },

  getInvitationDetailsByToken: async (
    token: string
  ): Promise<ApiResponse<any>> => {
    const response = await api.get(
      `${BASE}/invites/details/${token}`
    );
    return response.data;
  },

  inviteUser: async (
    organizationId: string,
    data: InviteUserRequestDto
  ): Promise<ApiResponse<{ inviteId: string }>> => {
    const response = await api.post(
      `${BASE}/${organizationId}/invites`,
      data
    );
    return response.data;
  },

  acceptInvite: async (
    data: AcceptInviteRequestDto
  ): Promise<ApiResponse<{ organizationId: string }>> => {
    const response = await api.post(
      `${BASE}/invites/accept`,
      data
    );
    return response.data;
  },
};