import { ServiceResult } from "@/shared/types/api.types";

export interface CreateContactRequestDto {
  name: string;
  email: string;
  phone?: string | null;
  jobTitle?: string | null;
  companyName?: string | null;
  companyId?: string | null;
  website?: string | null;
  avatarUrl:string | null;

  pipelineStageId?: string | null;
  source?: string | null;
  notes?: string | null;
  tagIds?: string[];
}

export interface TagDto {
  id: string;
  name: string;
  color: string;
}

export interface ContactResponseDto {
  id: string;
  name: string;
  email: string;
  avatarUrl:string | null;
  phone: string | null;
  jobTitle: string | null;
  company: string | null;
  companyId: string | null;
  status: string;
  source: string;
  createdAt: Date;
  tags: TagDto[];
}

export interface PaginatedContactsResponse {
  contacts: ContactResponseDto[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type GetContactsServiceResult = ServiceResult<
  PaginatedContactsResponse,
  "ORGANIZATION_NOT_FOUND" | "DATABASE_ERROR"
>;

export type CreateContactServiceResult = ServiceResult<
  ContactResponseDto,
  "EMAIL_IS_USED" | "COMPANY_NOT_FOUND" | "DATABASE_ERROR"
>;