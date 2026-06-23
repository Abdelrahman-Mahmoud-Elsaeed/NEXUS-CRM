import { DealStatus, Prisma } from "@prisma/client";
import { prisma } from "@/shared/config/db/prisma";
import { DealListItemDto, DealResponseDto } from "./deals.dto";

export const formatDecimalValue = (value: unknown): string | null => {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return value.toString();
  }

  if (typeof value === "object" && "toString" in value) {
    return String(value);
  }

  return null;
};

export const parseOptionalDate = (
  value?: string | null,
): Date | null | undefined => {
  if (value === undefined) {
    return undefined;
  }

  if (value === null || value === "") {
    return null;
  }

  return new Date(value);
};

export const getDealInclude = () => ({
  company: {
    select: {
      id: true,
      name: true,
    },
  },
  primaryContact: {
    select: {
      id: true,
      name: true,
    },
  },
  pipeline: {
    select: {
      id: true,
      name: true,
    },
  },
  stage: {
    select: {
      id: true,
      name: true,
      order: true,
    },
  },
  assignee: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
  creator: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
});

type DealWithRelations = Prisma.DealGetPayload<{
  include: ReturnType<typeof getDealInclude>;
}>;

const mapUserSummary = (
  user: DealWithRelations["assignee"],
): DealResponseDto["assignee"] => {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
};

export const mapDealResponse = (deal: DealWithRelations): DealResponseDto => ({
  id: deal.id,
  name: deal.name,
  value: formatDecimalValue(deal.value),
  currency: deal.currency,
  status: deal.status,
  expectedCloseDate: deal.expectedCloseDate?.toISOString() ?? null,
  actualCloseDate: deal.actualCloseDate?.toISOString() ?? null,
  notes: deal.notes,
  organizationId: deal.organizationId,
  companyId: deal.companyId,
  primaryContactId: deal.primaryContactId,
  pipelineId: deal.pipelineId,
  stageId: deal.stageId,
  assignedToId: deal.assignedToId,
  createdById: deal.createdById,
  company: deal.company,
  primaryContact: deal.primaryContact,
  pipeline: deal.pipeline,
  stage: deal.stage,
  assignee: mapUserSummary(deal.assignee),
  creator: mapUserSummary(deal.creator),
  createdAt: deal.createdAt,
  updatedAt: deal.updatedAt,
});

export const mapDealListItem = (deal: DealWithRelations): DealListItemDto => ({
  id: deal.id,
  name: deal.name,
  value: formatDecimalValue(deal.value),
  currency: deal.currency,
  status: deal.status,
  expectedCloseDate: deal.expectedCloseDate?.toISOString() ?? null,
  company: deal.company,
  pipeline: deal.pipeline,
  stage: deal.stage,
  assignee: mapUserSummary(deal.assignee),
  createdAt: deal.createdAt,
  updatedAt: deal.updatedAt,
});

export const buildDealSearchWhere = (
  organizationId: string,
  filters: {
    search?: string;
    status?: DealStatus;
    pipelineId?: string;
    stageId?: string;
    companyId?: string;
    assignedToId?: string;
  },
): Prisma.DealWhereInput => ({
  organizationId,
  ...(filters.search && {
    OR: [{ name: { contains: filters.search, mode: "insensitive" as const } }],
  }),
  ...(filters.status && { status: filters.status }),
  ...(filters.pipelineId && { pipelineId: filters.pipelineId }),
  ...(filters.stageId && { stageId: filters.stageId }),
  ...(filters.companyId && { companyId: filters.companyId }),
  ...(filters.assignedToId && { assignedToId: filters.assignedToId }),
});

export const companyExists = async (
  organizationId: string,
  companyId: string,
): Promise<boolean> => {
  const company = await prisma.company.findFirst({
    where: { id: companyId, organizationId },
    select: { id: true },
  });

  return !!company;
};

export const contactExists = async (
  organizationId: string,
  contactId: string,
): Promise<boolean> => {
  const contact = await prisma.contact.findFirst({
    where: { id: contactId, organizationId },
    select: { id: true },
  });

  return !!contact;
};

export const pipelineExists = async (
  organizationId: string,
  pipelineId: string,
): Promise<boolean> => {
  const pipeline = await prisma.pipeline.findFirst({
    where: { id: pipelineId, organizationId },
    select: { id: true },
  });

  return !!pipeline;
};

export const getPipelineStage = async (
  organizationId: string,
  stageId: string,
) => {
  return prisma.pipelineStage.findFirst({
    where: {
      id: stageId,
      organizationId,
    },
    select: {
      id: true,
      pipelineId: true,
    },
  });
};

export const userBelongsToOrganization = async (
  organizationId: string,
  userId: string,
): Promise<boolean> => {
  const membership = await prisma.organizationUser.findUnique({
    where: {
      organizationId_userId: {
        organizationId,
        userId,
      },
    },
    select: { userId: true },
  });

  return !!membership;
};

export type DealRelationValidationResult =
  | { valid: true; pipelineId: string | null; stageId: string | null }
  | {
      valid: false;
      reason:
        | "INVALID_COMPANY"
        | "INVALID_CONTACT"
        | "INVALID_PIPELINE"
        | "INVALID_STAGE"
        | "STAGE_PIPELINE_MISMATCH"
        | "INVALID_ASSIGNEE";
      msg: string;
    };

export const validateStagePlacement = async (
  organizationId: string,
  relations: {
    pipelineId?: string | null;
    stageId: string;
  },
): Promise<
  | { valid: true; pipelineId: string | null; stageId: string }
  | {
      valid: false;
      reason: "INVALID_PIPELINE" | "INVALID_STAGE" | "STAGE_PIPELINE_MISMATCH";
      msg: string;
    }
> => {
  let resolvedPipelineId =
    relations.pipelineId === undefined ? undefined : relations.pipelineId;

  const stage = await getPipelineStage(organizationId, relations.stageId);
  if (!stage) {
    return {
      valid: false,
      reason: "INVALID_STAGE",
      msg: "Pipeline stage not found in this workspace.",
    };
  }

  if (resolvedPipelineId) {
    const isValid = await pipelineExists(organizationId, resolvedPipelineId);
    if (!isValid) {
      return {
        valid: false,
        reason: "INVALID_PIPELINE",
        msg: "Pipeline not found in this workspace.",
      };
    }

    if (stage.pipelineId !== resolvedPipelineId) {
      return {
        valid: false,
        reason: "STAGE_PIPELINE_MISMATCH",
        msg: "The selected stage does not belong to the specified pipeline.",
      };
    }
  } else if (resolvedPipelineId === undefined || resolvedPipelineId === null) {
    resolvedPipelineId = stage.pipelineId;
  }

  return {
    valid: true,
    pipelineId: resolvedPipelineId ?? null,
    stageId: relations.stageId,
  };
};

export const validateDealRelations = async (
  organizationId: string,
  relations: {
    companyId?: string | null;
    primaryContactId?: string | null;
    pipelineId?: string | null;
    stageId?: string | null;
    assignedToId?: string | null;
  },
): Promise<DealRelationValidationResult> => {
  if (relations.companyId) {
    const isValid = await companyExists(organizationId, relations.companyId);
    if (!isValid) {
      return {
        valid: false,
        reason: "INVALID_COMPANY",
        msg: "Company not found in this workspace.",
      };
    }
  }

  if (relations.primaryContactId) {
    const isValid = await contactExists(organizationId, relations.primaryContactId);
    if (!isValid) {
      return {
        valid: false,
        reason: "INVALID_CONTACT",
        msg: "Contact not found in this workspace.",
      };
    }
  }

  let resolvedPipelineId =
    relations.pipelineId === undefined ? undefined : relations.pipelineId;
  let resolvedStageId =
    relations.stageId === undefined ? undefined : relations.stageId;

  if (resolvedPipelineId) {
    const isValid = await pipelineExists(organizationId, resolvedPipelineId);
    if (!isValid) {
      return {
        valid: false,
        reason: "INVALID_PIPELINE",
        msg: "Pipeline not found in this workspace.",
      };
    }
  }

  if (resolvedStageId) {
    const stage = await getPipelineStage(organizationId, resolvedStageId);
    if (!stage) {
      return {
        valid: false,
        reason: "INVALID_STAGE",
        msg: "Pipeline stage not found in this workspace.",
      };
    }

    if (resolvedPipelineId && stage.pipelineId !== resolvedPipelineId) {
      return {
        valid: false,
        reason: "STAGE_PIPELINE_MISMATCH",
        msg: "The selected stage does not belong to the specified pipeline.",
      };
    }

    if (resolvedPipelineId === undefined || resolvedPipelineId === null) {
      resolvedPipelineId = stage.pipelineId;
    }
  }

  if (relations.assignedToId) {
    const isValid = await userBelongsToOrganization(
      organizationId,
      relations.assignedToId,
    );
    if (!isValid) {
      return {
        valid: false,
        reason: "INVALID_ASSIGNEE",
        msg: "Assignee is not a member of this workspace.",
      };
    }
  }

  return {
    valid: true,
    pipelineId: resolvedPipelineId ?? null,
    stageId: resolvedStageId ?? null,
  };
};

export const resolveClosedStatusDates = (
  currentStatus: DealStatus,
  nextStatus: DealStatus | undefined,
  actualCloseDate: Date | null | undefined,
): Date | null | undefined => {
  if (nextStatus === undefined) {
    return actualCloseDate;
  }

  if (nextStatus === DealStatus.Open) {
    return actualCloseDate === undefined ? null : actualCloseDate;
  }

  if (actualCloseDate !== undefined) {
    return actualCloseDate;
  }

  return new Date();
};
