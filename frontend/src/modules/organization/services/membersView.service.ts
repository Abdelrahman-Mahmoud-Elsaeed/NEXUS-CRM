import { api } from "@/lib/axios";
import type {
  OrganizationMember,
  InviteUserRequestDto,
  ApiResponse,
  ApiSingleResponse,
} from "@/modules/organization/types/organization.types";

export const MembersViewService = {
  fetchOrganizationMembers: async (
    organizationId: string,
  ): Promise<ApiResponse<OrganizationMember[]>> => {
    const response = await api.get(
      `/organization/organizations/${organizationId}/members`,
    );
    return response.data;
  },

  inviteOrganizationMember: async (
    organizationId: string,
    data: InviteUserRequestDto,
  ): Promise<ApiSingleResponse<{ inviteId: string }>> => {
    const response = await api.post(
      `/organization/${organizationId}/invites`,
      data,
    );
    return response.data;
  },
};
