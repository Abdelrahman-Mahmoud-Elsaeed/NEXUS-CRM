import { OrganizationService } from "./organization.service";
import type { OrganizationMember, InviteUserRequestDto, ApiResponse, ApiSingleResponse } from "@/modules/organization/types/organization.types";

export const MembersViewService = {
  fetchOrganizationMembers: async (
    organizationId: string,
  ): Promise<ApiResponse<OrganizationMember[]>> => {
    return OrganizationService.getOrganizationMembers(organizationId);
  },

  inviteOrganizationMember: async (
    organizationId: string,
    data: InviteUserRequestDto,
  ): Promise<ApiSingleResponse<{ inviteId: string }>> => {
    return OrganizationService.inviteUser(organizationId, data);
  },
};
