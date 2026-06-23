import { prisma } from "@/shared/config/db/prisma";
import { Role as PrismaRole } from "@prisma/client";
import {
  CreateContactRequestDto,
  CreateContactServiceResult,
  GetAssignedContactsServiceResult,
  GetContactsServiceResult,
  GetSignelContactsServiceResult,
  UpdateContactRequestDto,
  UpdateContactServiceResult,
} from "./contacts.dto";
import {
  buildSearchWhere,
  buildContactUpdateData,
  companyExists,
  getContactInclude,
  getContactUpdateAccess,
  hasBlockedContactUpdateFields,
  mapContactResponse,
  pipelineStageExists,
  userBelongsToOrganization,
} from "./contacts.utils";

export class ContactService {
  async getContacts(
    organizationId: string,
    search?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<GetContactsServiceResult> {
    const skip = (page - 1) * limit;
    const whereCondition = buildSearchWhere(organizationId, search);

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where: whereCondition,
        include: getContactInclude(),
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.contact.count({
        where: whereCondition,
      }),
    ]);

    return {
      success: true,
      statusCode: 200,
      data: {
        contacts: contacts.map((contact) => mapContactResponse(contact)),
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }

  async getAssignedContacts(
    organizationId: string,
    userId: string,
    search?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<GetAssignedContactsServiceResult> {
    const skip = (page - 1) * limit;
    const whereCondition = {
      ...buildSearchWhere(organizationId, search),
      assignedToId: userId,
    };

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where: whereCondition,
        include: getContactInclude(),
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.contact.count({
        where: whereCondition,
      }),
    ]);

    return {
      success: true,
      statusCode: 200,
      data: {
        contacts: contacts.map((contact) => mapContactResponse(contact)),
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }

  async getContact(
    organizationId: string,
    contactId: string,
    userId: string,
    userRole: string,
  ): Promise<GetSignelContactsServiceResult> {
    
    const whereCondition: any = {
      id: contactId,
      organizationId,
    };

    if (userRole !== "Admin" && userRole !== "Owner") {
      whereCondition.assignedToId = userId;
    }

    const contact = await prisma.contact.findFirst({
      where: whereCondition,
      include: {
        ...getContactInclude(),
        deals: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            name: true,
            value: true,
            status: true,
            expectedCloseDate: true,
            stage: { select: { id: true, name: true } },
          },
        },
        tasks: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
            createdAt: true,
          },
        },
      },
    });

    // Returns 404 if contact doesn't exist OR if user isn't authorized to see it
    if (!contact) {
      return {
        success: false,
        statusCode: 404,
        reason: "CONTACT_NOT_FOUND",
        msg: "Contact not found.",
      };
    }

    const mapped = mapContactResponse(contact);
    return {
      success: true,
      statusCode: 200,
      data: {
        ...mapped,
        deals:
          contact.deals?.map((deal: any) => ({
            id: deal.id,
            name: deal.name,
            value: deal.value != null ? String(deal.value) : null,
            status: deal.status || "Open",
            expectedCloseDate: deal.expectedCloseDate
              ? deal.expectedCloseDate.toISOString()
              : null,
            stage: deal.stage?.name || null,
          })) ?? [],
        tasks:
          contact.tasks?.map((task: any) => ({
            id: task.id,
            title: task.title,
            status: task.status || "Pending",
            priority: task.priority || "Medium",
            createdAt: task.createdAt,
          })) ?? [],
      },
    };
  }
  async createContact(
    organizationId: string,
    dto: CreateContactRequestDto,
  ): Promise<CreateContactServiceResult> {
    const existingContact = await prisma.contact.findFirst({
      where: {
        email: dto.email,
        organizationId,
      },
    });

    if (existingContact) {
      return {
        success: false,
        statusCode: 409,
        reason: "EMAIL_IS_USED",
        msg: "A contact with this email address already exists in your organization records.",
      };
    }

    let finalCompanyId = dto.companyId || null;

    if (!finalCompanyId && dto.companyName?.trim()) {
      const generatedDomain =
        dto.website ||
        `${dto.companyName.toLowerCase().replace(/\s+/g, "")}.com`;

      const newCompany = await prisma.company.create({
        data: {
          name: dto.companyName.trim(),
          organizationId,
          domain: generatedDomain,
        },
      });
      finalCompanyId = newCompany.id;
    }

    const contact = await prisma.contact.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        avatarUrl: dto.avatarUrl ?? null,
        jobTitle: dto.jobTitle,
        website: dto.website ?? null,
        source: dto.source || "Manual",
        notes: dto.notes,
        organizationId,
        companyId: finalCompanyId,
        pipelineStageId: dto.pipelineStageId || undefined,
        tags: {
          create: dto.tagIds?.map((id) => ({
            tagId: id,
          })),
        },
        channels: {
          createMany: {
            data: dto.channels?.map((ch) => ({
              type: ch.type,
              value: ch.value.trim(),
            })) ?? [],
          },
        },
      },
      include: getContactInclude(),
    });

    return {
      success: true,
      statusCode: 201,
      data: mapContactResponse(contact),
    };
  }

  async updateContact(
    organizationId: string,
    contactId: string,
    currentUserId: string,
    organizationRole: PrismaRole | undefined,
    dto: UpdateContactRequestDto,
  ): Promise<UpdateContactServiceResult> {
    const contact = await prisma.contact.findFirst({
      where: {
        id: contactId,
        organizationId,
      },
      include: getContactInclude(),
    });

    if (!contact) {
      return {
        success: false,
        statusCode: 404,
        reason: "CONTACT_NOT_FOUND",
        msg: "Contact not found.",
      };
    }

    const access = getContactUpdateAccess(
      organizationRole,
      currentUserId,
      contact.assignedToId,
    );

    if (!access.isAdmin && !access.isAssignee) {
      return {
        success: false,
        statusCode: 403,
        reason: "INSUFFICIENT_PERMISSIONS",
        msg: "You are not allowed to update this contact.",
      };
    }

    if (!access.isAdmin) {
      if (hasBlockedContactUpdateFields(dto, access.allowedFields)) {
        return {
          success: false,
          statusCode: 403,
          reason: "INSUFFICIENT_PERMISSIONS",
          msg: "You are not allowed to update these contact fields.",
        };
      }
    }

    if (dto.email !== undefined) {
      const existingContact = await prisma.contact.findFirst({
        where: { email: dto.email.trim(), NOT: { id: contact.id } },
        select: { id: true },
      });

      if (existingContact) {
        return {
          success: false,
          statusCode: 409,
          reason: "EMAIL_IS_USED",
          msg: "A contact with this email address already exists.",
        };
      }
    }

    if (dto.companyId !== undefined && dto.companyId !== null) {
      const companyIsValid = await companyExists(organizationId, dto.companyId);

      if (!companyIsValid) {
        return {
          success: false,
          statusCode: 404,
          reason: "COMPANY_NOT_FOUND",
          msg: "Company not found in this workspace.",
        };
      }
    }

    if (dto.pipelineStageId !== undefined && dto.pipelineStageId !== null) {
      const pipelineStageIsValid = await pipelineStageExists(
        organizationId,
        dto.pipelineStageId,
      );

      if (!pipelineStageIsValid) {
        return {
          success: false,
          statusCode: 404,
          reason: "PIPELINE_STAGE_NOT_FOUND",
          msg: "Pipeline stage not found in this workspace.",
        };
      }
    }

    if (dto.assignedToId !== undefined && dto.assignedToId !== null) {
      const assignedUserIsValid = await userBelongsToOrganization(
        organizationId,
        dto.assignedToId,
      );

      if (!assignedUserIsValid) {
        return {
          success: false,
          statusCode: 404,
          reason: "ASSIGNED_USER_NOT_FOUND",
          msg: "Assigned user not found in this workspace.",
        };
      }
    }

    const data = buildContactUpdateData(dto, access.isAdmin);

    const updatedContact = await prisma.$transaction(async (tx) => {
      // Update standard contact fields
      const updated = await tx.contact.update({
        where: { id: contact.id },
        data,
      });

      // If channels are provided, replace the entire set
      if (dto.channels !== undefined) {
        await tx.contactChannel.deleteMany({
          where: { contactId: contact.id },
        });

        if (dto.channels.length > 0) {
          await tx.contactChannel.createMany({
            data: dto.channels.map((ch) => ({
              contactId: contact.id,
              type: ch.type,
              value: ch.value.trim(),
            })),
          });
        }
      }

      return tx.contact.findUnique({
        where: { id: contact.id },
        include: getContactInclude(),
      });
    });

    return {
      success: true,
      statusCode: 200,
      data: mapContactResponse(updatedContact),
    };
  }
}

export const contactService = new ContactService();
