import { prisma } from "@/shared/config/db/prisma";
import {
  ContactResponseDto,
  CreateContactRequestDto,
  GetContactsServiceResult,
  CreateContactServiceResult,
} from "./contacts.dto";

export class ContactService {
  async getContacts(
    organizationId: string,
    search?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<GetContactsServiceResult> {
    const skip = (page - 1) * limit;

    const whereCondition = {
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

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where: whereCondition,
        include: {
          company: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: skip,
        take: limit,
      }),
      prisma.contact.count({
        where: whereCondition,
      }),
    ]);

    const formattedContacts: ContactResponseDto[] = contacts.map((contact) => ({
      id: contact.id,
      name: contact.name,
      email: contact.email,
      avatarUrl:contact.avatarUrl,
      phone: contact.phone,
      jobTitle: contact.jobTitle,
      company: contact.company?.name ?? null,
      companyId: contact.companyId,
      status: contact.status,
      source: contact.source,
      createdAt: contact.createdAt,
      tags: contact.tags.map((t) => ({
        id: t.tag.id,
        name: t.tag.name,
        color: t.tag.colorHex,
      })),
    }));

    return {
      success: true,
      statusCode: 200,
      data: {
        contacts: formattedContacts,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
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

      // Separate entity creation
      const newCompany = await prisma.company.create({
        data: {
          name: dto.companyName.trim(),
          organizationId,
          domain: generatedDomain,
        },
      });
      finalCompanyId = newCompany.id;
    }
    console.log(dto.avatarUrl)

    const contact = await prisma.contact.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        avatarUrl: dto.avatarUrl || "",
        jobTitle: dto.jobTitle,
        website: dto.website,
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
      },
      include: {
        company: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
    return {
      success: true,
      statusCode: 201,
      data: {
        id: contact.id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        avatarUrl:contact.avatarUrl,
        jobTitle: contact.jobTitle,
        company: contact.company?.name ?? null,
        companyId: contact.companyId,
        status: contact.status,
        source: contact.source,
        createdAt: contact.createdAt,
        tags: contact.tags.map((t) => ({
          id: t.tag.id,
          name: t.tag.name,
          color: t.tag.colorHex,
        })),
      },
    };
  }
}

export const contactService = new ContactService();
