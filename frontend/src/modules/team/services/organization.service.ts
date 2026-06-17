import { api } from "@/lib/axios";
import type { ApiResponse } from "@/modules/auth/types/auth.types";
import type { Organization } from "../types/organization.types";

const BASE = "/organization";

export const OrganizationService = {
  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await api.post(
      `/files${BASE}/avatars`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return response.data;
  },

  getUserOrganizations: async (): Promise<
    ApiResponse<{ organizations: Organization[] }>
  > => {
    const response = await api.get(BASE);
    return response.data;
  },

  updateOrganizationName: async (
    organizationId: string,
    name: string
  ): Promise<ApiResponse<Organization>> => {
    const response = await api.patch(
      `${BASE}/${organizationId}/name`,
      { name }
    );
    return response.data;
  },
};