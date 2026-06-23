import { prisma } from "@/shared/config/db/prisma";
import {
  CreatePipelineRequestDto,
  CreatePipelineStageRequestDto,
  CreatePipelineServiceResult,
  CreatePipelineStageServiceResult,
  DeletePipelineServiceResult,
  DeletePipelineStageServiceResult,
  GetPipelineServiceResult,
  GetPipelinesServiceResult,
  PipelineListItemDto,
  PipelineResponseDto,
  ReorderPipelineStagesRequestDto,
  ReorderPipelineStagesServiceResult,
  UpdatePipelineRequestDto,
  UpdatePipelineServiceResult,
  UpdatePipelineStageRequestDto,
  UpdatePipelineStageServiceResult,
} from "./pipelines.dto";
import {
  getNextStageOrder,
  getPipelineStageInclude,
  getPipelineWithStages,
  mapPipelineStage,
} from "./pipelines.utils";

const mapPipelineResponse = (
  pipeline: NonNullable<Awaited<ReturnType<typeof getPipelineWithStages>>>,
): PipelineResponseDto => ({
  id: pipeline.id,
  name: pipeline.name,
  organizationId: pipeline.organizationId,
  stages: pipeline.stages.map((stage) => mapPipelineStage(stage)),
  dealsCount: pipeline._count.deals,
  createdAt: pipeline.createdAt,
  updatedAt: pipeline.updatedAt,
});

export class PipelineService {
  async getPipelines(
    organizationId: string,
    search?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<GetPipelinesServiceResult> {
    const skip = (page - 1) * limit;

    const whereCondition = {
      organizationId,
      ...(search && {
        name: { contains: search, mode: "insensitive" as const },
      }),
    };

    const [pipelines, total] = await Promise.all([
      prisma.pipeline.findMany({
        where: whereCondition,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              stages: true,
              deals: true,
            },
          },
        },
      }),
      prisma.pipeline.count({ where: whereCondition }),
    ]);

    const formattedPipelines: PipelineListItemDto[] = pipelines.map((pipeline) => ({
      id: pipeline.id,
      name: pipeline.name,
      stagesCount: pipeline._count.stages,
      dealsCount: pipeline._count.deals,
      createdAt: pipeline.createdAt,
      updatedAt: pipeline.updatedAt,
    }));

    return {
      success: true,
      statusCode: 200,
      data: {
        pipelines: formattedPipelines,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }

  async getPipeline(
    organizationId: string,
    pipelineId: string,
  ): Promise<GetPipelineServiceResult> {
    const pipeline = await getPipelineWithStages(organizationId, pipelineId);

    if (!pipeline) {
      return {
        success: false,
        statusCode: 404,
        reason: "PIPELINE_NOT_FOUND",
        msg: "Pipeline not found.",
      };
    }

    return {
      success: true,
      statusCode: 200,
      data: mapPipelineResponse(pipeline),
    };
  }

  async createPipeline(
    organizationId: string,
    dto: CreatePipelineRequestDto,
  ): Promise<CreatePipelineServiceResult> {
    const pipeline = await prisma.$transaction(async (tx) => {
      const createdPipeline = await tx.pipeline.create({
        data: {
          name: dto.name.trim(),
          organizationId,
        },
      });

      if (dto.stages?.length) {
        await tx.pipelineStage.createMany({
          data: dto.stages.map((stage, index) => ({
            name: stage.name.trim(),
            order: stage.order ?? index,
            pipelineId: createdPipeline.id,
            organizationId,
          })),
        });
      }

      return createdPipeline.id;
    });

    const fullPipeline = await getPipelineWithStages(organizationId, pipeline);

    return {
      success: true,
      statusCode: 201,
      data: mapPipelineResponse(fullPipeline!),
    };
  }

  async updatePipeline(
    organizationId: string,
    pipelineId: string,
    dto: UpdatePipelineRequestDto,
  ): Promise<UpdatePipelineServiceResult> {
    const pipeline = await getPipelineWithStages(organizationId, pipelineId);

    if (!pipeline) {
      return {
        success: false,
        statusCode: 404,
        reason: "PIPELINE_NOT_FOUND",
        msg: "Pipeline not found.",
      };
    }

    await prisma.pipeline.update({
      where: { id: pipeline.id },
      data: {
        name: dto.name?.trim() ?? pipeline.name,
      },
    });

    const updatedPipeline = await getPipelineWithStages(organizationId, pipelineId);

    return {
      success: true,
      statusCode: 200,
      data: mapPipelineResponse(updatedPipeline!),
    };
  }

  async deletePipeline(
    organizationId: string,
    pipelineId: string,
  ): Promise<DeletePipelineServiceResult> {
    const pipeline = await prisma.pipeline.findFirst({
      where: {
        id: pipelineId,
        organizationId,
      },
      select: { id: true },
    });

    if (!pipeline) {
      return {
        success: false,
        statusCode: 404,
        reason: "PIPELINE_NOT_FOUND",
        msg: "Pipeline not found.",
      };
    }

    await prisma.pipeline.delete({
      where: { id: pipeline.id },
    });

    return {
      success: true,
      statusCode: 200,
      data: { id: pipeline.id },
    };
  }

  async createPipelineStage(
    organizationId: string,
    pipelineId: string,
    dto: CreatePipelineStageRequestDto,
  ): Promise<CreatePipelineStageServiceResult> {
    const pipeline = await prisma.pipeline.findFirst({
      where: {
        id: pipelineId,
        organizationId,
      },
      select: { id: true },
    });

    if (!pipeline) {
      return {
        success: false,
        statusCode: 404,
        reason: "PIPELINE_NOT_FOUND",
        msg: "Pipeline not found.",
      };
    }

    const order =
      dto.order !== undefined ? dto.order : await getNextStageOrder(pipelineId);

    const stage = await prisma.pipelineStage.create({
      data: {
        name: dto.name.trim(),
        order,
        pipelineId,
        organizationId,
      },
      include: getPipelineStageInclude(),
    });

    return {
      success: true,
      statusCode: 201,
      data: mapPipelineStage(stage),
    };
  }

  async updatePipelineStage(
    organizationId: string,
    pipelineId: string,
    stageId: string,
    dto: UpdatePipelineStageRequestDto,
  ): Promise<UpdatePipelineStageServiceResult> {
    const stage = await prisma.pipelineStage.findFirst({
      where: {
        id: stageId,
        pipelineId,
        organizationId,
      },
      include: getPipelineStageInclude(),
    });

    if (!stage) {
      return {
        success: false,
        statusCode: 404,
        reason: "STAGE_NOT_FOUND",
        msg: "Pipeline stage not found.",
      };
    }

    const updatedStage = await prisma.pipelineStage.update({
      where: { id: stage.id },
      data: {
        name: dto.name?.trim() ?? stage.name,
        order: dto.order ?? stage.order,
      },
      include: getPipelineStageInclude(),
    });

    return {
      success: true,
      statusCode: 200,
      data: mapPipelineStage(updatedStage),
    };
  }

  async deletePipelineStage(
    organizationId: string,
    pipelineId: string,
    stageId: string,
  ): Promise<DeletePipelineStageServiceResult> {
    const stage = await prisma.pipelineStage.findFirst({
      where: {
        id: stageId,
        pipelineId,
        organizationId,
      },
      include: {
        _count: {
          select: { contacts: true },
        },
      },
    });

    if (!stage) {
      return {
        success: false,
        statusCode: 404,
        reason: "STAGE_NOT_FOUND",
        msg: "Pipeline stage not found.",
      };
    }

    if (stage._count.contacts > 0) {
      return {
        success: false,
        statusCode: 409,
        reason: "STAGE_HAS_CONTACTS",
        msg: "Cannot delete a stage that has contacts assigned to it.",
      };
    }

    await prisma.pipelineStage.delete({
      where: { id: stage.id },
    });

    return {
      success: true,
      statusCode: 200,
      data: { id: stage.id },
    };
  }

  async reorderPipelineStages(
    organizationId: string,
    pipelineId: string,
    dto: ReorderPipelineStagesRequestDto,
  ): Promise<ReorderPipelineStagesServiceResult> {
    const pipeline = await prisma.pipeline.findFirst({
      where: {
        id: pipelineId,
        organizationId,
      },
      select: {
        id: true,
        stages: {
          select: { id: true },
        },
      },
    });

    if (!pipeline) {
      return {
        success: false,
        statusCode: 404,
        reason: "PIPELINE_NOT_FOUND",
        msg: "Pipeline not found.",
      };
    }

    const existingStageIds = new Set(pipeline.stages.map((stage) => stage.id));
    const incomingStageIds = dto.stages.map((stage) => stage.id);

    if (
      incomingStageIds.length !== existingStageIds.size ||
      incomingStageIds.some((id) => !existingStageIds.has(id))
    ) {
      return {
        success: false,
        statusCode: 400,
        reason: "INVALID_STAGE_SET",
        msg: "Reorder payload must include every stage in the pipeline exactly once.",
      };
    }

    await prisma.$transaction(
      dto.stages.map((stage) =>
        prisma.pipelineStage.update({
          where: { id: stage.id },
          data: { order: stage.order },
        }),
      ),
    );

    const stages = await prisma.pipelineStage.findMany({
      where: {
        pipelineId,
        organizationId,
      },
      include: getPipelineStageInclude(),
      orderBy: { order: "asc" },
    });

    return {
      success: true,
      statusCode: 200,
      data: stages.map((stage) => mapPipelineStage(stage)),
    };
  }
}

export const pipelineService = new PipelineService();
