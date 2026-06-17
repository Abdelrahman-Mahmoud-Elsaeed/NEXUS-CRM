import { api } from "@/lib/axios";
import type { ApiResponse } from "@/modules/auth/types/auth.types";
import type { RoleDefinitionDto, RoleUpdatePayload } from "../types/organization.types";


export const RolesViewService = {
  fetchWorkspaceRoles: async (
    organizationId: string,
  ): Promise<ApiResponse<RoleDefinitionDto[]>> => {
    const response = await api.get(`/organization/${organizationId}/roles`);
    return response.data;
  },

  updateWorkspaceRole: async (
    organizationId: string,
    roleId: string,
    payload: RoleUpdatePayload,
  ): Promise<ApiResponse<RoleDefinitionDto>> => {
    const response = await api.patch(
      `/organization/${organizationId}/roles/${roleId}`,
      payload,
    );
    return response.data;
  },
};
