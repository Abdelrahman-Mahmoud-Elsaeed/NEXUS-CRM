import { DealStatus } from "@prisma/client";
import { prisma } from "@/shared/config/db/prisma";
import {
  CreateDealRequestDto,
  CreateDealServiceResult,
  DeleteDealServiceResult,
  GetDealServiceResult,
  GetDealsServiceResult,
  MoveDealStageRequestDto,
  MoveDealStageServiceResult,
  UpdateDealRequestDto,
  UpdateDealServiceResult,
} from "./deals.dto";
import {
  buildDealSearchWhere,
  getDealInclude,
  mapDealListItem,
  mapDealResponse,
  parseOptionalDate,
  resolveClosedStatusDates,
  validateDealRelations,
  validateStagePlacement,
} from "./deals.utils";

export class DealService {
  async getDeals(
    organizationId: string,
    filters: {
      search?: string;
      status?: DealStatus;
      pipelineId?: string;
      stageId?: string;
      companyId?: string;
      assignedToId?: string;
      page?: number;
      limit?: number;
    },
  ): Promise<GetDealsServiceResult> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    const skip = (page - 1) * limit;

    const whereCondition = buildDealSearchWhere(organizationId, filters);

    const [deals, total] = await Promise.all([
      prisma.deal.findMany({
        where: whereCondition,
        include: getDealInclude(),
        orderBy: { updatedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.deal.count({ where: whereCondition }),
    ]);

    return {
      success: true,
      statusCode: 200,
      data: {
        deals: deals.map((deal) => mapDealListItem(deal)),
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }

  async getDeal(
    organizationId: string,
    dealId: string,
  ): Promise<GetDealServiceResult> {
    const deal = await prisma.deal.findFirst({
      where: {
        id: dealId,
        organizationId,
      },
      include: getDealInclude(),
    });

    if (!deal) {
      return {
        success: false,
        statusCode: 404,
        reason: "DEAL_NOT_FOUND",
        msg: "Deal not found.",
      };
    }

    return {
      success: true,
      statusCode: 200,
      data: mapDealResponse(deal),
    };
  }

  async createDeal(
    organizationId: string,
    userId: string,
    dto: CreateDealRequestDto,
  ): Promise<CreateDealServiceResult> {
    const relationValidation = await validateDealRelations(organizationId, {
      companyId: dto.companyId,
      primaryContactId: dto.primaryContactId,
      pipelineId: dto.pipelineId,
      stageId: dto.stageId,
      assignedToId: dto.assignedToId,
    });

    if (!relationValidation.valid) {
      return {
        success: false,
        statusCode: 400,
        reason: relationValidation.reason,
        msg: relationValidation.msg,
      };
    }

    const status = dto.status ?? DealStatus.Open;
    const actualCloseDate =
      status === DealStatus.Won || status === DealStatus.Lost ? new Date() : null;

    const deal = await prisma.deal.create({
      data: {
        name: dto.name.trim(),
        value: dto.value ?? null,
        currency: dto.currency?.trim().toUpperCase() || "USD",
        status,
        expectedCloseDate: parseOptionalDate(dto.expectedCloseDate) ?? null,
        actualCloseDate,
        notes: dto.notes?.trim() || null,
        organizationId,
        companyId: dto.companyId ?? null,
        primaryContactId: dto.primaryContactId ?? null,
        pipelineId: relationValidation.pipelineId,
        stageId: relationValidation.stageId,
        assignedToId: dto.assignedToId ?? null,
        createdById: userId,
      },
      include: getDealInclude(),
    });

    return {
      success: true,
      statusCode: 201,
      data: mapDealResponse(deal),
    };
  }

  async updateDeal(
    organizationId: string,
    dealId: string,
    dto: UpdateDealRequestDto,
  ): Promise<UpdateDealServiceResult> {
    const existingDeal = await prisma.deal.findFirst({
      where: {
        id: dealId,
        organizationId,
      },
    });

    if (!existingDeal) {
      return {
        success: false,
        statusCode: 404,
        reason: "DEAL_NOT_FOUND",
        msg: "Deal not found.",
      };
    }

    const relationValidation = await validateDealRelations(organizationId, {
      companyId:
        dto.companyId !== undefined ? dto.companyId : existingDeal.companyId,
      primaryContactId:
        dto.primaryContactId !== undefined
          ? dto.primaryContactId
          : existingDeal.primaryContactId,
      pipelineId:
        dto.pipelineId !== undefined ? dto.pipelineId : existingDeal.pipelineId,
      stageId: dto.stageId !== undefined ? dto.stageId : existingDeal.stageId,
      assignedToId:
        dto.assignedToId !== undefined
          ? dto.assignedToId
          : existingDeal.assignedToId,
    });

    if (!relationValidation.valid) {
      return {
        success: false,
        statusCode: 400,
        reason: relationValidation.reason,
        msg: relationValidation.msg,
      };
    }

    const nextStatus = dto.status ?? existingDeal.status;
    const actualCloseDate = resolveClosedStatusDates(
      existingDeal.status,
      dto.status,
      parseOptionalDate(dto.actualCloseDate),
    );

    const deal = await prisma.deal.update({
      where: { id: existingDeal.id },
      data: {
        name: dto.name?.trim() ?? existingDeal.name,
        value: dto.value !== undefined ? dto.value : existingDeal.value,
        currency: dto.currency?.trim().toUpperCase() ?? existingDeal.currency,
        status: nextStatus,
        expectedCloseDate:
          dto.expectedCloseDate !== undefined
            ? parseOptionalDate(dto.expectedCloseDate) ?? null
            : existingDeal.expectedCloseDate,
        actualCloseDate:
          actualCloseDate !== undefined ? actualCloseDate : existingDeal.actualCloseDate,
        notes:
          dto.notes !== undefined ? dto.notes?.trim() || null : existingDeal.notes,
        companyId:
          dto.companyId !== undefined ? dto.companyId : existingDeal.companyId,
        primaryContactId:
          dto.primaryContactId !== undefined
            ? dto.primaryContactId
            : existingDeal.primaryContactId,
        pipelineId:
          dto.pipelineId !== undefined || dto.stageId !== undefined
            ? relationValidation.pipelineId
            : existingDeal.pipelineId,
        stageId:
          dto.stageId !== undefined || dto.pipelineId !== undefined
            ? relationValidation.stageId
            : existingDeal.stageId,
        assignedToId:
          dto.assignedToId !== undefined
            ? dto.assignedToId
            : existingDeal.assignedToId,
      },
      include: getDealInclude(),
    });

    return {
      success: true,
      statusCode: 200,
      data: mapDealResponse(deal),
    };
  }

  async moveDealStage(
    organizationId: string,
    dealId: string,
    dto: MoveDealStageRequestDto,
  ): Promise<MoveDealStageServiceResult> {
    const existingDeal = await prisma.deal.findFirst({
      where: {
        id: dealId,
        organizationId,
      },
    });

    if (!existingDeal) {
      return {
        success: false,
        statusCode: 404,
        reason: "DEAL_NOT_FOUND",
        msg: "Deal not found.",
      };
    }

    const targetPipelineId = dto.pipelineId ?? existingDeal.pipelineId;

    const relationValidation = await validateStagePlacement(organizationId, {
      pipelineId: targetPipelineId,
      stageId: dto.stageId,
    });

    if (!relationValidation.valid) {
      return {
        success: false,
        statusCode: 400,
        reason: relationValidation.reason,
        msg: relationValidation.msg,
      };
    }

    const deal = await prisma.deal.update({
      where: { id: existingDeal.id },
      data: {
        pipelineId: relationValidation.pipelineId,
        stageId: relationValidation.stageId,
      },
      include: getDealInclude(),
    });

    return {
      success: true,
      statusCode: 200,
      data: mapDealResponse(deal),
    };
  }

  async deleteDeal(
    organizationId: string,
    dealId: string,
  ): Promise<DeleteDealServiceResult> {
    const deal = await prisma.deal.findFirst({
      where: {
        id: dealId,
        organizationId,
      },
      select: { id: true },
    });

    if (!deal) {
      return {
        success: false,
        statusCode: 404,
        reason: "DEAL_NOT_FOUND",
        msg: "Deal not found.",
      };
    }

    await prisma.deal.delete({
      where: { id: deal.id },
    });

    return {
      success: true,
      statusCode: 200,
      data: { id: deal.id },
    };
  }
}

export const dealService = new DealService();
