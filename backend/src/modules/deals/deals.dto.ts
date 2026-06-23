import { DealStatus } from "@prisma/client";
import { ServiceResult } from "@/shared/types/api.types";

export interface DealRelationSummaryDto {
  id: string;
  name: string;
}

export interface DealStageSummaryDto {
  id: string;
  name: string;
  order: number;
}

export interface DealPipelineSummaryDto {
  id: string;
  name: string;
}

export interface DealUserSummaryDto {
  id: string;
  name: string | null;
  email: string;
}

export interface DealResponseDto {
  id: string;
  name: string;
  value: string | null;
  currency: string;
  status: DealStatus;
  expectedCloseDate: string | null;
  actualCloseDate: string | null;
  notes: string | null;
  organizationId: string;
  companyId: string | null;
  primaryContactId: string | null;
  pipelineId: string | null;
  stageId: string | null;
  assignedToId: string | null;
  createdById: string | null;
  company: DealRelationSummaryDto | null;
  primaryContact: DealRelationSummaryDto | null;
  pipeline: DealPipelineSummaryDto | null;
  stage: DealStageSummaryDto | null;
  assignee: DealUserSummaryDto | null;
  creator: DealUserSummaryDto | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DealListItemDto {
  id: string;
  name: string;
  value: string | null;
  currency: string;
  status: DealStatus;
  expectedCloseDate: string | null;
  company: DealRelationSummaryDto | null;
  pipeline: DealPipelineSummaryDto | null;
  stage: DealStageSummaryDto | null;
  assignee: DealUserSummaryDto | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDealRequestDto {
  name: string;
  value?: number | null;
  currency?: string;
  status?: DealStatus;
  expectedCloseDate?: string | null;
  notes?: string | null;
  companyId?: string | null;
  primaryContactId?: string | null;
  pipelineId?: string | null;
  stageId?: string | null;
  assignedToId?: string | null;
}

export interface UpdateDealRequestDto {
  name?: string;
  value?: number | null;
  currency?: string;
  status?: DealStatus;
  expectedCloseDate?: string | null;
  actualCloseDate?: string | null;
  notes?: string | null;
  companyId?: string | null;
  primaryContactId?: string | null;
  pipelineId?: string | null;
  stageId?: string | null;
  assignedToId?: string | null;
}

export interface MoveDealStageRequestDto {
  stageId: string;
  pipelineId?: string;
}

export interface PaginatedDealsResponse {
  deals: DealListItemDto[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type GetDealsServiceResult = ServiceResult<
  PaginatedDealsResponse,
  "DATABASE_ERROR"
>;

export type GetDealServiceResult = ServiceResult<
  DealResponseDto,
  "DEAL_NOT_FOUND" | "DATABASE_ERROR"
>;

export type CreateDealServiceResult = ServiceResult<
  DealResponseDto,
  | "INVALID_COMPANY"
  | "INVALID_CONTACT"
  | "INVALID_PIPELINE"
  | "INVALID_STAGE"
  | "STAGE_PIPELINE_MISMATCH"
  | "INVALID_ASSIGNEE"
  | "DATABASE_ERROR"
>;

export type UpdateDealServiceResult = ServiceResult<
  DealResponseDto,
  | "DEAL_NOT_FOUND"
  | "INVALID_COMPANY"
  | "INVALID_CONTACT"
  | "INVALID_PIPELINE"
  | "INVALID_STAGE"
  | "STAGE_PIPELINE_MISMATCH"
  | "INVALID_ASSIGNEE"
  | "DATABASE_ERROR"
>;

export type MoveDealStageServiceResult = ServiceResult<
  DealResponseDto,
  | "DEAL_NOT_FOUND"
  | "INVALID_PIPELINE"
  | "INVALID_STAGE"
  | "STAGE_PIPELINE_MISMATCH"
  | "DATABASE_ERROR"
>;

export type DeleteDealServiceResult = ServiceResult<
  { id: string },
  "DEAL_NOT_FOUND" | "DATABASE_ERROR"
>;
