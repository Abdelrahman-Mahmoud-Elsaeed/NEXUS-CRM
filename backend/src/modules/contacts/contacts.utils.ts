import { prisma } from "@/shared/config/db/prisma";
import { Role as PrismaRole } from "@prisma/client";
import { ContactResponseDto, UpdateContactRequestDto } from "./contacts.dto";

export const adminRoles: PrismaRole[] = ["Owner", "Admin"];

export const employeeEditableContactFields = [
  "status",
  "notes",
  "channels",
  "companyId",
] as const;

export const adminEditableContactFields = [
  "name",
  "email",
  "phone",
  "jobTitle",
  "website",
  "avatarUrl",
  "companyId",
  "status",
  "priority",
  "source",
  "notes",
  "pipelineStageId",
  "assignedToId",
  "channels",
] as const;

export type ContactUpdateAccess = {
  isAdmin: boolean;
  isAssignee: boolean;
  allowedFields: readonly string[];
};

export const isAdminRole = (role?: PrismaRole): boolean => {
  return !!role && adminRoles.includes(role);
};

export const getContactUpdateAccess = (
  organizationRole: PrismaRole | undefined,
  currentUserId: string,
  contactAssignedToId: string | null,
): ContactUpdateAccess => {
  const isAdmin = isAdminRole(organizationRole);
  const isAssignee = contactAssignedToId === currentUserId;

  return {
    isAdmin,
    isAssignee,
    allowedFields: isAdmin
      ? adminEditableContactFields
      : employeeEditableContactFields,
  };
};

export const hasBlockedContactUpdateFields = (
  dto: UpdateContactRequestDto,
  allowedFields: readonly string[],
): boolean => {
  return Object.entries(dto).some(([field, value]) => {
    if (value === undefined) {
      return false;
    }

    return !allowedFields.includes(field);
  });
};

export const getContactInclude = () => {
  return {
    company: true,
    channels: true,
    tags: {
      include: {
        tag: true,
      },
    },
  } as const;
};

export const mapContactResponse = (contact: any): ContactResponseDto => {
  return {
    id: contact.id,
    name: contact.name,
    email: contact.email,
    avatarUrl: contact.avatarUrl,
    phone: contact.phone,
    jobTitle: contact.jobTitle,
    website: contact.website,
    company: contact.company?.name ?? null,
    companyId: contact.companyId,
    status: contact.status,
    priority: contact.priority,
    source: contact.source,
    notes: contact.notes,
    pipelineStageId: contact.pipelineStageId,
    assignedToId: contact.assignedToId,
    channels: (contact.channels || []).map((ch: any) => ({
      id: ch.id,
      type: ch.type,
      value: ch.value,
    })),
    createdAt: contact.createdAt,
    tags: contact.tags.map((t: any) => ({
      id: t.tag.id,
      name: t.tag.name,
      color: t.tag.colorHex,
    })),
  };
};

export const buildContactUpdateData = (
  dto: UpdateContactRequestDto,
  isAdmin: boolean,
) => {
  const data: Record<string, any> = {};

  if (isAdmin) {
    if (dto.name !== undefined) {
      data.name = dto.name.trim();
    }

    if (dto.email !== undefined) {
      data.email = dto.email.trim();
    }

    if (dto.phone !== undefined) {
      data.phone = dto.phone?.trim() || null;
    }

    if (dto.jobTitle !== undefined) {
      data.jobTitle = dto.jobTitle?.trim() || null;
    }

    if (dto.website !== undefined) {
      data.website = dto.website?.trim() || null;
    }

    if (dto.avatarUrl !== undefined) {
      data.avatarUrl = dto.avatarUrl?.trim() || null;
    }

    if (dto.priority !== undefined) {
      data.priority = dto.priority;
    }

    if (dto.source !== undefined) {
      data.source = dto.source.trim();
    }

    if (dto.pipelineStageId !== undefined) {
      data.pipelineStageId = dto.pipelineStageId;
    }

    if (dto.assignedToId !== undefined) {
      data.assignedToId = dto.assignedToId;
    }
  }

  if (dto.companyId !== undefined) {
    data.companyId = dto.companyId;
  }

  if (dto.status !== undefined) {
    data.status = dto.status;
  }

  if (dto.notes !== undefined) {
    data.notes = dto.notes?.trim() || null;
  }

  // channels are handled separately in a transaction, not here

  return data;
};

export const buildSearchWhere = (organizationId: string, search?: string) => {
  return {
    organizationId,
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" as const } },
        { email: { contains: search, mode: "insensitive" as const } },
        { jobTitle: { contains: search, mode: "insensitive" as const } },
        {
          company: {
            name: { contains: search, mode: "insensitive" as const },
          },
        },
      ],
    }),
  };
};

export const companyExists = async (
  organizationId: string,
  companyId: string,
): Promise<boolean> => {
  const company = await prisma.company.findFirst({
    where: {
      id: companyId,
      organizationId,
    },
    select: {
      id: true,
    },
  });

  return !!company;
};

export const pipelineStageExists = async (
  organizationId: string,
  pipelineStageId: string,
): Promise<boolean> => {
  const pipelineStage = await prisma.pipelineStage.findFirst({
    where: {
      id: pipelineStageId,
      organizationId,
    },
    select: {
      id: true,
    },
  });

  return !!pipelineStage;
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
    select: {
      userId: true,
    },
  });

  return !!membership;
};
