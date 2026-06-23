import { prisma } from "@/shared/config/db/prisma";
import { PipelineStageDto } from "./pipelines.dto";

type StageWithCounts = {
  id: string;
  name: string;
  order: number;
  pipelineId: string;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    deals: number;
    contacts: number;
  };
};

export const mapPipelineStage = (stage: StageWithCounts): PipelineStageDto => ({
  id: stage.id,
  name: stage.name,
  order: stage.order,
  pipelineId: stage.pipelineId,
  dealsCount: stage._count.deals,
  contactsCount: stage._count.contacts,
  createdAt: stage.createdAt,
  updatedAt: stage.updatedAt,
});

export const pipelineExists = async (
  organizationId: string,
  pipelineId: string,
): Promise<boolean> => {
  const pipeline = await prisma.pipeline.findFirst({
    where: {
      id: pipelineId,
      organizationId,
    },
    select: { id: true },
  });

  return !!pipeline;
};

export const getPipelineStageInclude = () => ({
  _count: {
    select: {
      deals: true,
      contacts: true,
    },
  },
});

export const getNextStageOrder = async (pipelineId: string): Promise<number> => {
  const lastStage = await prisma.pipelineStage.findFirst({
    where: { pipelineId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  return lastStage ? lastStage.order + 1 : 0;
};

export const getPipelineWithStages = async (
  organizationId: string,
  pipelineId: string,
) => {
  return prisma.pipeline.findFirst({
    where: {
      id: pipelineId,
      organizationId,
    },
    include: {
      stages: {
        include: getPipelineStageInclude(),
        orderBy: { order: "asc" },
      },
      _count: {
        select: { deals: true },
      },
    },
  });
};
