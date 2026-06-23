// src/modules/companies/services/company.service.ts
import { api } from "@/lib/axios";
import type { 
  CompanyResponseDto, 
  CreateCompanyPayload, 
  GetCompaniesApiResponse,
  UploadLogoResponse 
} from "../types/company.types";

const COMPANIES_BASE = "/companies";

export const companyService = {
  getCompanies: async (params: {
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<GetCompaniesApiResponse> => {
    const response = await api.get<GetCompaniesApiResponse>(`${COMPANIES_BASE}`, {
      params: {
        search: params.search || undefined,
        page: params.page?.toString(),
        limit: params.limit?.toString(),
      },
    });
    return response.data;
  },

  getCompany: async (id: string): Promise<CompanyResponseDto> => {
    const response = await api.get<CompanyResponseDto>(`${COMPANIES_BASE}/${id}`);
    return response.data;
  },

  createCompany: async (body: CreateCompanyPayload): Promise<CompanyResponseDto> => {
    const response = await api.post<CompanyResponseDto>(`${COMPANIES_BASE}`, body);
    return response.data;
  },

  uploadCompanyLogo: async (file: File): Promise<UploadLogoResponse> => {
    const formData = new FormData();
    formData.append("avatar", file);
    const response = await api.post<UploadLogoResponse>(`/files/companies/avatars`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  updateCompany: async (
    id: string,
    body: Partial<CreateCompanyPayload>,
  ): Promise<CompanyResponseDto> => {
    const response = await api.patch<CompanyResponseDto>(`${COMPANIES_BASE}/${id}`, body);
    return response.data;
  },
};