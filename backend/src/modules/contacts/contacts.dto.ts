import { ServiceResult } from "@/shared/types/api.types";
import { ContactStatus, LeadPriority } from "@prisma/client";

export interface ContactChannelDto {
  id?: string;
  type: "Email" | "AlternativeEmail" | "Phone" | "WhatsApp" | "LinkedIn" | "Instagram" | "Twitter";
  value: string;
}

export interface CreateContactRequestDto {
  name: string;
  email: string;
  phone?: string | null;
  jobTitle?: string | null;
  companyName?: string | null;
  companyId?: string | null;
  website?: string | null;
  avatarUrl?: string | null;

  pipelineStageId?: string | null;
  source?: string | null;
  notes?: string | null;
  tagIds?: string[];
  channels?: ContactChannelDto[];
}

export interface UpdateContactRequestDto {
  name?: string;
  email?: string;
  phone?: string | null;
  jobTitle?: string | null;
  website?: string | null;
  avatarUrl?: string | null;
  companyId?: string | null;
  status?: ContactStatus;
  priority?: LeadPriority;
  source?: string;
  notes?: string | null;
  pipelineStageId?: string | null;
  assignedToId?: string | null;
  channels?: ContactChannelDto[];
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
  avatarUrl: string | null;
  phone: string | null;
  jobTitle: string | null;
  website: string | null;
  company: string | null;
  companyId: string | null;
  status: ContactStatus;
  priority: LeadPriority;
  source: string;
  notes: string | null;
  pipelineStageId: string | null;
  assignedToId: string | null;
  channels: ContactChannelDto[];
  createdAt: Date;
  deals?: any;
  tasks?: any;
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

export type GetSignelContactsServiceResult = ServiceResult<
  ContactResponseDto,
  "INSUFFICIENT_PERMISSIONS" | "DATABASE_ERROR" | "CONTACT_NOT_FOUND"
>;

export type GetAssignedContactsServiceResult = ServiceResult<
  PaginatedContactsResponse,
  "INSUFFICIENT_PERMISSIONS" | "DATABASE_ERROR"
>;


export type CreateContactServiceResult = ServiceResult<
  ContactResponseDto,
  "EMAIL_IS_USED" | "COMPANY_NOT_FOUND" | "DATABASE_ERROR"
>;

export type UpdateContactServiceResult = ServiceResult<
  ContactResponseDto,
  | "CONTACT_NOT_FOUND"
  | "EMAIL_IS_USED"
  | "COMPANY_NOT_FOUND"
  | "PIPELINE_STAGE_NOT_FOUND"
  | "ASSIGNED_USER_NOT_FOUND"
  | "INSUFFICIENT_PERMISSIONS"
  | "DATABASE_ERROR"
>;
