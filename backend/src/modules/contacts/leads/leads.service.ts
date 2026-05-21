import { prisma } from "@/shared/config/db/prisma";
import { CreateLeadRequestDto, LeadResponseDto, LeadServiceResult } from "./leads.dto";

export class LeadService {
  async getLeads(organizationId: string, search?: string): Promise<LeadServiceResult<LeadResponseDto[]>> {
    const leads = await prisma.lead.findMany({
      where: {
        organizationId,
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { company: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    const formattedLeads: LeadResponseDto[] = leads.map((lead) => ({
      id: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      source: lead.source,
      createdAt: lead.createdAt,
      tags: lead.tags.map(t => t.tag)
    }));

    return { success: true, data: formattedLeads };
  }

  async createLead(organizationId: string, dto: CreateLeadRequestDto): Promise<LeadServiceResult<LeadResponseDto>> {
    const lead = await prisma.lead.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        company: dto.company,
        website: dto.website,
        pipelineStageId: dto.pipelineStageId,
        source: dto.source || "Manual",
        notes: dto.notes,
        organizationId,
        tags: {
          create: dto.tagIds?.map((id) => ({
            tag: { connect: { id } }
          }))
        }
      },
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      }
    });

    return {
      success: true,
      data: {
        id: lead.id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        source: lead.source,
        createdAt: lead.createdAt,
        tags: lead.tags.map(t => t.tag)
      }
    };
  }
}