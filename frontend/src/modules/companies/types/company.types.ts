/* eslint-disable @typescript-eslint/no-explicit-any */
// src/modules/companies/types/company.types.ts

// ==========================================
// Base API Response Wrapper (Matching Auth)
// ==========================================
export type ApiResponse<T, E extends string = string> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      reason: E;
      msg: string;
    };

// ==========================================
// Enums & Constants
// ==========================================
export const CompanyStatus = {
  Active: "Active",
  Inactive: "Inactive",
  Lead: "Lead",
  Customer: "Customer",
} as const;

export type CompanyStatus = (typeof CompanyStatus)[keyof typeof CompanyStatus];

export type ChannelType = "mail" | "linkedin" | "whatsapp" | "instagram" | "twitter";

// ==========================================
// Shared DTOs
// ==========================================
export interface CompanyTagDto {
  id: string;
  name: string;
  color?: string;
}

export interface CompanyData {
  notes: any;
  id: string;
  name: string;
  domain: string | null;
  industry: string | null;
  phone: string | null;
  logoUrl: string | null;
  status: CompanyStatus;
  employeeCount: number | null;
  annualRevenue: number | null;
  address: string | null;
  source: string;
  createdAt: string;
  updatedAt: string;
  tags: CompanyTagDto[];
  contactsCount?: number;
  linkedin?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  totalDealValue?: string;
  activeDealsCount?: number;
  totalRevenue?: string;
  contacts?: { id: string; name: string; avatarUrl: string | null; initials: string | null }[];
  deals?: { id: string; name: string; value: string | null; status: string; expectedCloseDate: string | null; stage: string | null }[];
}

// ==========================================
// API Endpoint Response DTOs
// ==========================================
export type GetCompaniesApiResponse = ApiResponse<{
  companies: CompanyData[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}>;

export type CompanyResponseDto = ApiResponse<CompanyData>;

export type UploadLogoResponse = ApiResponse<{
  logoUrl: string;
}>;

// ==========================================
// Payload DTOs
// ==========================================
export interface CreateCompanyPayload {
  name: string;
  domain?: string;
  industry?: string;
  phone?: string;
  logoUrl?: string;
  status?: CompanyStatus;
  employeeCount?: number;
  annualRevenue?: number;
  address?: string;
  source?: string;
  notes?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  whatsapp?: string;
  email?: string;
}

export interface CompanyFormValues {
  name: string;
  domain: string;
  industry: string;
  phone: string;
  status: CompanyStatus;
  employeeCount: string; 
  annualRevenue: string; 
  address: string;
  source: string;
  linkedinHandle: string;
  twitterHandle: string;
  notes: string;
  tagIds: string[];
  channels: ChannelType[];
  emailHandle: string;
  whatsappHandle: string;
  instagramHandle: string;
}

export interface FinalCompanySubmissionPayload extends CreateCompanyPayload {
  tagIds: string[];
}

// Backward-compatible aliases
export type CompaniesStatus = CompanyStatus;
export type CompaniesResponseDto = CompanyData;