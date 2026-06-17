import { api } from "@/lib/axios";
import type { ApiResponse } from "@/modules/auth/types/auth.types";
import type { OrganizationMember } from "../types/organization.types";

const BASE = "/member";

export const MemberService = {
  getOrganizationMembers: async (
    organizationId: string
  ): Promise<ApiResponse<OrganizationMember[]>> => {
    const response = await api.get(`${BASE}/${organizationId}/members`);
    return response.data;
  },
};