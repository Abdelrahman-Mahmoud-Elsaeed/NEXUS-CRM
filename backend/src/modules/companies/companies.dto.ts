import { ServiceResult } from "@/shared/types/api.types";

export interface CreateCompanyRequestDto {
  name: string;
  domain?: string | null;
  logoUrl?: string | null;
  industry?: string | null;
  phone?: string | null;
  status?: string | null;
  employeeCount?: number | null;
  annualRevenue?: number | null;
  address?: string | null;
  source?: string | null;
  notes?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  whatsapp?: string | null;
  email?: string | null;
}

export interface UpdateCompanyRequestDto {
  name?: string;
  domain?: string | null;
  logoUrl?: string | null;
  industry?: string | null;
  phone?: string | null;
  status?: string | null;
  employeeCount?: number | null;
  annualRevenue?: number | null;
  address?: string | null;
  source?: string | null;
  notes?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  whatsapp?: string | null;
  email?: string | null;
}

export interface CompanyResponseDto {
  id: string;
  name: string;
  domain: string | null;
  logoUrl: string | null;
  industry: string | null;
  phone: string | null;
  status: string;
  employeeCount: number | null;
  annualRevenue: string | null;
  address: string | null;
  source: string;
  notes: string | null;
  linkedin: string | null;
  twitter: string | null;
  instagram: string | null;
  whatsapp: string | null;
  email: string | null;
  organizationId: string;
  contactsCount: number;
  totalDealValue: string;
  createdAt: Date;
  contacts?:any | null;
  deals?:any  | null;
}

export interface CompanyListItemDto {
  id: string;
  name: string;
  domain: string | null;
  logoUrl: string | null;
  industry: string | null;
  status: string;
  address: string | null;
  location: string | null;
  activeDealsCount: number;
  totalRevenue: string;
  contactsCount: number;
  contacts: { id: string; name: string; avatarUrl: string | null; initials: string | null }[];
}

export interface PaginatedCompaniesResponse {
  companies: CompanyListItemDto[];
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

export type UpdateCompanyServiceResult = ServiceResult<
  CompanyResponseDto,
  "COMPANY_NOT_FOUND" | "DOMAIN_IS_USED" | "DATABASE_ERROR"
>;
