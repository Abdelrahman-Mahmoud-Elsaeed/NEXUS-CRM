import { api } from "@/lib/axios";
import type {
  RoleDefinitionDto,
  RoleUpdatePayload,
} from "@/modules/organization/types/rolesView.types";
import type {
  ApiResponse,
  ApiSingleResponse,
} from "@/modules/organization/types/organization.types";

export const RolesViewService = {
  fetchWorkspaceRoles: async (
    organizationId: string,
  ): Promise<ApiResponse<RoleDefinitionDto[]>> => {
    // TODO: Missing Backend Implementation - Developer to build matching endpoint
    const response = await api.get(`/organization/${organizationId}/roles`);
    return response.data;
  },

  updateWorkspaceRole: async (
    organizationId: string,
    roleId: string,
    payload: RoleUpdatePayload,
  ): Promise<ApiSingleResponse<RoleDefinitionDto>> => {
    // TODO: Missing Backend Implementation - Developer to build matching endpoint
    const response = await api.patch(
      `/organization/${organizationId}/roles/${roleId}`,
      payload,
    );
    return response.data;
  },
};
