import { ApiResponse } from "@/shared/types/api.types";
import { TagDto } from "../tags/tags.dto";

export interface CreateLeadRequestDto {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  pipelineStageId?: string;
  source: string;
  notes?: string;
  tagIds?: string[];
}

export interface LeadResponseDto {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  source: string;
  createdAt: Date;
  tags: TagDto[];
}

export type LeadServiceResult<T> = 
  | { success: true; data: T }
  | { success: false; reason: "DATABASE_ERROR" };

export type GetLeadsApiResponse = ApiResponse<{ leads: LeadResponseDto[] }>;
export type CreateLeadApiResponse = ApiResponse<LeadResponseDto, "DATABASE_ERROR" | "INTERNAL_SERVER_ERROR">;