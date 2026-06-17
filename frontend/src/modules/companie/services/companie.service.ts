import { api } from "@/lib/axios";
import type { CompanyResponseDto, CreateCompanyPayload, GetCompaniesApiResponse } from "../types/company.types";

export const companyService = {
  getCompanies: async (params: {
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<GetCompaniesApiResponse["data"]> => {
    const response = await api.get<GetCompaniesApiResponse>(`/companies`, {
      params: {
        search: params.search || undefined,
        page: params.page?.toString(),
        limit: params.limit?.toString(),
      },
    });
    return response.data.data;
  },

  createCompany: async (
    body: CreateCompanyPayload,
  ): Promise<CompanyResponseDto> => {
    const response = await api.post(`/companies`, body);
    return response.data;
  },

  uploadCompanyLogo: async (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);
    const response = await api.post(`/files/companies/avatars`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data || response;
  },
};