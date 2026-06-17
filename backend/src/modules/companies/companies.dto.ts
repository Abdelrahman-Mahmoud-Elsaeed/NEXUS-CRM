import { ServiceResult } from "@/shared/types/api.types";

export interface CreateCompanyRequestDto {
  name: string;
  domain?: string | null;
  logoUrl?: string | null;
}

export interface CompanyResponseDto {
  id: string;
  name: string;
  domain: string | null;
  logoUrl: string | null;
  organizationId: string;
  contactsCount: number;
  createdAt: Date;
}

export interface PaginatedCompaniesResponse {
  companies: CompanyResponseDto[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type GetCompaniesServiceResult = ServiceResult<
  PaginatedCompaniesResponse,
  "ORGANIZATION_NOT_FOUND" | "DATABASE_ERROR"
>;

export type CreateCompanyServiceResult = ServiceResult<
  CompanyResponseDto,
  "DOMAIN_IS_USED" | "DATABASE_ERROR"
>;