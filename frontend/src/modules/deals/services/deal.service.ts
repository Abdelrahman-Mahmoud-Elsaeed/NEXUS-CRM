// src/modules/deals/services/deal.service.ts
import { api } from "@/lib/axios";
import type {
  GetDealsApiResponse,
  DealResponseDto,
  CreateDealPayload,
  UpdateDealPayload,
  MoveDealStagePayload,
  GetPipelineApiResponse,
} from "../types/deal.types";

const DEALS_BASE = "/deals";
const PIPELINES_BASE = "/pipelines";

export const dealService = {
  getDeals: async (params: {
    search?: string;
    page?: number;
    limit?: number;
    pipelineId?: string;
    stageId?: string;
  }): Promise<GetDealsApiResponse> => {
    const response = await api.get<GetDealsApiResponse>(`${DEALS_BASE}`, {
      params: {
        search: params.search || undefined,
        page: params.page?.toString(),
        limit: params.limit?.toString(),
        pipelineId: params.pipelineId || undefined,
        stageId: params.stageId || undefined,
      },
    });
    return response.data;
  },

  getDeal: async (id: string): Promise<DealResponseDto> => {
    const response = await api.get<DealResponseDto>(`${DEALS_BASE}/${id}`);
    return response.data;
  },

  createDeal: async (body: CreateDealPayload): Promise<DealResponseDto> => {
    const response = await api.post<DealResponseDto>(`${DEALS_BASE}`, body);
    return response.data;
  },

  updateDeal: async (
    id: string,
    body: UpdateDealPayload,
  ): Promise<DealResponseDto> => {
    const response = await api.patch<DealResponseDto>(`${DEALS_BASE}/${id}`, body);
    return response.data;
  },

  moveDealStage: async (
    id: string,
    body: MoveDealStagePayload,
  ): Promise<DealResponseDto> => {
    const response = await api.patch<DealResponseDto>(
      `${DEALS_BASE}/${id}/move-stage`,
      body,
    );
    return response.data;
  },

  deleteDeal: async (id: string): Promise<DealResponseDto> => {
    const response = await api.delete<DealResponseDto>(`${DEALS_BASE}/${id}`);
    return response.data;
  },

  // Pipeline-related endpoints for Kanban board
  getPipeline: async (id: string): Promise<GetPipelineApiResponse> => {
    const response = await api.get<GetPipelineApiResponse>(
      `${PIPELINES_BASE}/${id}`,
    );
    return response.data;
  },

  getPipelines: async (params: {
    page?: number;
    limit?: number;
  }): Promise<GetPipelineApiResponse> => {
    const response = await api.get<GetPipelineApiResponse>(`${PIPELINES_BASE}`, {
      params: {
        page: params.page?.toString(),
        limit: params.limit?.toString(),
      },
    });
    return response.data;
  },
};
