// src/modules/deals/types/deal.types.ts

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
export const DealStatus = {
  Open: "Open",
  Won: "Won",
  Lost: "Lost",
} as const;

export type DealStatus = (typeof DealStatus)[keyof typeof DealStatus];

// ==========================================
// Shared DTOs
// ==========================================
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

// ==========================================
// Deal Data Models
// ==========================================
export interface DealData {
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
  createdAt: string;
  updatedAt: string;
}

export interface DealListItem {
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
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// Pipeline Stage Data (for Kanban)
// ==========================================
export interface PipelineStageData {
  id: string;
  name: string;
  order: number;
  pipelineId: string;
  dealsCount: number;
  contactsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PipelineData {
  id: string;
  name: string;
  organizationId: string;
  stages: PipelineStageData[];
  dealsCount: number;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// API Endpoint Response DTOs
// ==========================================
export type GetDealsApiResponse = ApiResponse<{
  deals: DealListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}>;

export type DealResponseDto = ApiResponse<DealData>;

export type GetPipelineApiResponse = ApiResponse<PipelineData>;

// ==========================================
// Payload DTOs
// ==========================================
export interface CreateDealPayload {
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

export interface UpdateDealPayload {
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

export interface MoveDealStagePayload {
  stageId: string;
  pipelineId?: string;
}

// ==========================================
// Form Values
// ==========================================
export interface DealFormValues {
  name: string;
  value: string;
  currency: string;
  status: DealStatus;
  expectedCloseDate: string;
  notes: string;
  companyId: string;
  primaryContactId: string;
  pipelineId: string;
  stageId: string;
  assignedToId: string;
}
