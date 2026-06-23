import { ServiceResult } from "@/shared/types/api.types";

export interface PipelineStageDto {
  id: string;
  name: string;
  order: number;
  pipelineId: string;
  dealsCount: number;
  contactsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PipelineResponseDto {
  id: string;
  name: string;
  organizationId: string;
  stages: PipelineStageDto[];
  dealsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PipelineListItemDto {
  id: string;
  name: string;
  stagesCount: number;
  dealsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePipelineStageInputDto {
  name: string;
  order?: number;
}

export interface CreatePipelineRequestDto {
  name: string;
  stages?: CreatePipelineStageInputDto[];
}

export interface UpdatePipelineRequestDto {
  name?: string;
}

export interface CreatePipelineStageRequestDto {
  name: string;
  order?: number;
}

export interface UpdatePipelineStageRequestDto {
  name?: string;
  order?: number;
}

export interface ReorderPipelineStagesRequestDto {
  stages: {
    id: string;
    order: number;
  }[];
}

export interface PaginatedPipelinesResponse {
  pipelines: PipelineListItemDto[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type GetPipelinesServiceResult = ServiceResult<
  PaginatedPipelinesResponse,
  "DATABASE_ERROR"
>;

export type GetPipelineServiceResult = ServiceResult<
  PipelineResponseDto,
  "PIPELINE_NOT_FOUND" | "DATABASE_ERROR"
>;

export type CreatePipelineServiceResult = ServiceResult<
  PipelineResponseDto,
  "PIPELINE_NAME_REQUIRED" | "DATABASE_ERROR"
>;

export type UpdatePipelineServiceResult = ServiceResult<
  PipelineResponseDto,
  "PIPELINE_NOT_FOUND" | "DATABASE_ERROR"
>;

export type DeletePipelineServiceResult = ServiceResult<
  { id: string },
  "PIPELINE_NOT_FOUND" | "DATABASE_ERROR"
>;

export type CreatePipelineStageServiceResult = ServiceResult<
  PipelineStageDto,
  "PIPELINE_NOT_FOUND" | "DATABASE_ERROR"
>;

export type UpdatePipelineStageServiceResult = ServiceResult<
  PipelineStageDto,
  "PIPELINE_NOT_FOUND" | "STAGE_NOT_FOUND" | "DATABASE_ERROR"
>;

export type DeletePipelineStageServiceResult = ServiceResult<
  { id: string },
  | "PIPELINE_NOT_FOUND"
  | "STAGE_NOT_FOUND"
  | "STAGE_HAS_CONTACTS"
  | "DATABASE_ERROR"
>;

export type ReorderPipelineStagesServiceResult = ServiceResult<
  PipelineStageDto[],
  | "PIPELINE_NOT_FOUND"
  | "INVALID_STAGE_SET"
  | "DATABASE_ERROR"
>;
