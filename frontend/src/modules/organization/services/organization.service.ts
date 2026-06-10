/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/lib/axios";
import type {
  AcceptInviteRequestDto,
  ApiResponse,
  ApiSingleResponse,
  InvitationDto,
  InviteUserRequestDto,
  Organization,
  OrganizationMember,
} from "../types/organization.types";

const ORGANIZATION_BASE = "/organization";

export const OrganizationService = {
  uploadAvatar: async (
    file: File,
  ): Promise<
    ApiSingleResponse<{ file: { url: string; [key: string]: any } }>
  > => {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await api.post(
      `/files${ORGANIZATION_BASE}/avatars`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  },

  getUserOrganizations: async (): Promise<
    ApiResponse<{ organizations: Organization[] }>
  > => {
    const response = await api.get(`${ORGANIZATION_BASE}`);
    return response.data;
  },

  getOrganizationMembers: async (
    organizationId: string,
  ): Promise<ApiResponse<OrganizationMember[]>> => {
    const response = await api.get(
      `${ORGANIZATION_BASE}/organizations/${organizationId}/members`,
    );
    return response.data;
  },

  updateOrganizationName: async (
    organizationId: string,
    name: string,
  ): Promise<ApiSingleResponse<Organization>> => {
    const response = await api.patch(
      `${ORGANIZATION_BASE}/${organizationId}/name`,
      {
        name,
      },
    );
    return response.data;
  },

  inviteUser: async (
    organizationId: string,
    data: InviteUserRequestDto,
  ): Promise<ApiSingleResponse<{ inviteId: string }>> => {
    const response = await api.post(
      `${ORGANIZATION_BASE}/${organizationId}/invites`,
      data,
    );
    return response.data;
  },

  getWorkspaceInvitations: async (
    organizationId: string,
  ): Promise<ApiSingleResponse<InvitationDto[]>> => {
    const response = await api.get(
      `${ORGANIZATION_BASE}/${organizationId}/invites`,
    );
    return response.data;
  },

  getWorkspaceInviteByToken: async (
    organizationId: string,
    token: string,
  ): Promise<ApiSingleResponse<InvitationDto>> => {
    const response = await api.get(
      `${ORGANIZATION_BASE}/${organizationId}/invites/${token}`,
    );
    return response.data;
  },

  getInvitationDetailsByToken: async (
    token: string,
  ): Promise<ApiSingleResponse<any>> => {
    const response = await api.get(
      `${ORGANIZATION_BASE}/invites/details/${token}`,
    );
    return response.data;
  },

  acceptInvite: async (
    data: AcceptInviteRequestDto,
  ): Promise<ApiSingleResponse<{ organizationId: string }>> => {
    const response = await api.post(
      `${ORGANIZATION_BASE}/invites/accept`,
      data,
    );
    return response.data;
  },
};
