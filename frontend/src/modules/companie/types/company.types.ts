export type CompanyStatus = "Active" | "Inactive" | "Lead" | "Customer";

export interface CompanyTagDto {
  id: string;
  name: string;
  color?: string;
}

export interface CompanyResponseDto {
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
}

export interface GetCompaniesApiResponse {
  success: boolean;
  data: {
    companies: CompanyResponseDto[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

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
  linkedinHandle?: string;
  twitterHandle?: string;
}

export interface CompanyFormValues {
  name: string;
  domain: string;
  industry: string;
  phone: string;
  status: CompanyStatus;
  employeeCount: string; // Keep as string for HTML input compatibility, cast on submit
  annualRevenue: string; // Keep as string for HTML input compatibility, cast on submit
  address: string;
  source: string;
  linkedinHandle: string;
  twitterHandle: string;
  notes: string;
  tagIds: string[];
}

export interface FinalCompanySubmissionPayload extends CreateCompanyPayload {
  tagIds: string[];
}