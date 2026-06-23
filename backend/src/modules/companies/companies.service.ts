import { prisma } from "@/shared/config/db/prisma";
import {
  CompanyResponseDto,
  CompanyListItemDto,
  CreateCompanyRequestDto,
  GetCompaniesServiceResult,
  CreateCompanyServiceResult,
  UpdateCompanyRequestDto,
  UpdateCompanyServiceResult,
} from "./companies.dto";

function formatDecimalValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "0";
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

  return "0";
}

export class CompanyService {

  async getCompanies(
    organizationId: string,
    search?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<GetCompaniesServiceResult> {
    const skip = (page - 1) * limit;

    const whereCondition = {
      organizationId,
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { domain: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    };

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where: whereCondition,
        orderBy: { createdAt: "desc" },
        skip: skip,
        take: limit,
        include: {
          _count: {
            select: { contacts: true },
          },
          contacts: {
            take: 3,
            orderBy: { createdAt: "desc" },
            select: {
              id: true,
              name: true,
              avatarUrl: true,
              initials: true,
            },
          },
        },
      }),
      prisma.company.count({
        where: whereCondition,
      }),
    ]);

    const companyIds = companies.map((company) => company.id);
    const dealSummaryByCompanyId = new Map<
      string,
      { activeDealsCount: number; totalRevenue: string }
    >();

    if (companyIds.length > 0) {
      const dealValueTotals = await prisma.deal.groupBy({
        by: ["companyId"],
        where: {
          organizationId,
          companyId: {
            in: companyIds,
          },
          status: "Open",
        },
        _count: {
          _all: true,
        },
        _sum: {
          value: true,
        },
      });

      for (const aggregate of dealValueTotals) {
        if (!aggregate.companyId) {
          continue;
        }

        dealSummaryByCompanyId.set(
          aggregate.companyId,
          {
            activeDealsCount: aggregate._count._all,
            totalRevenue: formatDecimalValue(aggregate._sum.value),
          },
        );
      }
    }

    const formattedCompanies: CompanyListItemDto[] = companies.map((company) => {
      const c = company as any;
      return {
        id: company.id,
        name: company.name,
        domain: company.domain,
        logoUrl: company.logoUrl,
        industry: c.industry || null,
        status: c.status || "Lead",
        address: c.address || null,
        location: c.address || null,
        activeDealsCount: dealSummaryByCompanyId.get(company.id)?.activeDealsCount ?? 0,
        totalRevenue: dealSummaryByCompanyId.get(company.id)?.totalRevenue || "0",
        contactsCount: c._count?.contacts ?? 0,
        contacts: c.contacts?.map((contact: any) => ({
          id: contact.id,
          name: contact.name,
          avatarUrl: contact.avatarUrl || null,
          initials: contact.initials || null,
        })) ?? [],
      };
    });

    return {
      success: true,
      statusCode: 200,
      data: {
        companies: formattedCompanies,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }

  async getCompany(
    organizationId: string,
    companyId: string,
  ): Promise<{
    success: true;
    statusCode: number;
    data: CompanyResponseDto;
  } | {
    success: false;
    statusCode: number;
    reason: string;
    msg: string;
  }> {
    const company = await prisma.company.findFirst({
      where: {
        id: companyId,
        organizationId,
      },
      include: {
        _count: {
          select: { contacts: true },
        },
        contacts: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            initials: true,
            email: true,
            jobTitle: true,
          },
        },
        deals: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            name: true,
            value: true,
            status: true,
            expectedCloseDate: true,
            stage: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });

    if (!company) {
      return {
        success: false,
        statusCode: 404,
        reason: "COMPANY_NOT_FOUND",
        msg: "Company not found.",
      };
    }

    const c = company as any;
    return {
      success: true,
      statusCode: 200,
      data: {
        id: company.id,
        name: company.name,
        domain: company.domain,
        logoUrl: company.logoUrl,
        industry: c.industry || null,
        phone: c.phone || null,
        status: c.status || "Lead",
        employeeCount: c.employeeCount ?? null,
        annualRevenue: c.annualRevenue != null ? String(c.annualRevenue) : null,
        address: c.address || null,
        source: c.source || "Manual",
        notes: c.notes || null,
        linkedin: c.linkedin || null,
        twitter: c.twitter || null,
        instagram: c.instagram || null,
        whatsapp: c.whatsapp || null,
        email: c.email || null,
        organizationId: company.organizationId,
        contactsCount: company._count.contacts,
        totalDealValue: "0",
        createdAt: company.createdAt,
        contacts: c.contacts?.map((contact: any) => ({
          id: contact.id,
          name: contact.name,
          avatarUrl: contact.avatarUrl || null,
          initials: contact.initials || null,
        })) ?? [],
        deals: c.deals?.map((deal: any) => ({
          id: deal.id,
          name: deal.name,
          value: deal.value != null ? String(deal.value) : null,
          status: deal.status || "Open",
          expectedCloseDate: deal.expectedCloseDate ? deal.expectedCloseDate.toISOString() : null,
          stage: deal.stage?.name || null,
        })) ?? [],
      },
    };
  }
  
  async createCompany(
    organizationId: string,
    dto: CreateCompanyRequestDto,
  ): Promise<CreateCompanyServiceResult> {
    
    if (dto.domain?.trim()) {
      const existingDomain = await prisma.company.findUnique({
        where: {
          domain: dto.domain.trim().toLowerCase(),
        },
      });

      if (existingDomain) {
        return {
          success: false,
          statusCode: 409,
          reason: "DOMAIN_IS_USED",
          msg: "A company corporate record with this domain address already exists.",
        };
      }
    }

    const company = await prisma.company.create({
      data: {
        name: dto.name.trim(),
        domain: dto.domain?.trim().toLowerCase() || null,
        logoUrl: dto.logoUrl?.trim() || null,
        industry: dto.industry?.trim() || null,
        phone: dto.phone?.trim() || null,
        status: dto.status || "Lead",
        employeeCount: dto.employeeCount ?? null,
        annualRevenue: dto.annualRevenue != null ? BigInt(dto.annualRevenue) : null,
        address: dto.address?.trim() || null,
        source: dto.source?.trim() || "Manual",
        notes: dto.notes?.trim() || null,
        linkedin: dto.linkedin?.trim() || null,
        twitter: dto.twitter?.trim() || null,
        instagram: dto.instagram?.trim() || null,
        whatsapp: dto.whatsapp?.trim() || null,
        email: dto.email?.trim() || null,
        organizationId,
      },
      include: {
        _count: {
          select: { contacts: true },
        },
      },
    });

    const c = company as any;
    return {
      success: true,
      statusCode: 201,
      data: {
        id: company.id,
        name: company.name,
        domain: company.domain,
        logoUrl: company.logoUrl,
        industry: c.industry || null,
        phone: c.phone || null,
        status: c.status || "Lead",
        employeeCount: c.employeeCount ?? null,
        annualRevenue: c.annualRevenue != null ? String(c.annualRevenue) : null,
        address: c.address || null,
        source: c.source || "Manual",
        notes: c.notes || null,
        linkedin: c.linkedin || null,
        twitter: c.twitter || null,
        instagram: c.instagram || null,
        whatsapp: c.whatsapp || null,
        email: c.email || null,
        organizationId: company.organizationId,
        contactsCount: company._count.contacts,
        totalDealValue: "0",
        createdAt: company.createdAt,
      },
    };
  }

  async updateCompany(
    organizationId: string,
    companyId: string,
    dto: UpdateCompanyRequestDto,
  ): Promise<UpdateCompanyServiceResult> {
    console.log(dto)
    const company = await prisma.company.findFirst({
      where: {
        id: companyId,
        organizationId,
      },
      include: {
        _count: {
          select: { contacts: true },
        },
      },
    });

    if (!company) {
      return {
        success: false,
        statusCode: 404,
        reason: "COMPANY_NOT_FOUND",
        msg: "Company not found.",
      };
    }

    const nextDomain = dto.domain === "" ? null : dto.domain?.trim().toLowerCase();

    if (nextDomain && nextDomain !== company.domain) {
      const existingDomain = await prisma.company.findUnique({
        where: {
          domain: nextDomain,
        },
      });

      if (existingDomain && existingDomain.id !== company.id) {
        return {
          success: false,
          statusCode: 409,
          reason: "DOMAIN_IS_USED",
          msg: "A company corporate record with this domain address already exists.",
        };
      }
    }

    const updatedCompany = await prisma.company.update({
      where: {
        id: company.id,
      },
      data: {
        name: dto.name?.trim() ?? company.name,
        domain: dto.domain === undefined ? company.domain : nextDomain,
        logoUrl:
          dto.logoUrl === undefined
            ? company.logoUrl
            : dto.logoUrl?.trim() || null,
        industry: dto.industry === undefined ? (company as any).industry : dto.industry?.trim() || null,
        phone: dto.phone === undefined ? (company as any).phone : dto.phone?.trim() || null,
        status: dto.status === undefined ? (company as any).status : dto.status || "Lead",
        employeeCount: dto.employeeCount === undefined ? (company as any).employeeCount : dto.employeeCount ?? null,
        annualRevenue: dto.annualRevenue === undefined ? (company as any).annualRevenue : dto.annualRevenue != null ? BigInt(dto.annualRevenue) : null,
        address: dto.address === undefined ? (company as any).address : dto.address?.trim() || null,
        source: dto.source === undefined ? (company as any).source : dto.source?.trim() || null,
        notes: dto.notes === undefined ? (company as any).notes : dto.notes?.trim() || null,
        linkedin: dto.linkedin === undefined ? (company as any).linkedin : dto.linkedin?.trim() || null,
        twitter: dto.twitter === undefined ? (company as any).twitter : dto.twitter?.trim() || null,
        instagram: dto.instagram === undefined ? (company as any).instagram : dto.instagram?.trim() || null,
        whatsapp: dto.whatsapp === undefined ? (company as any).whatsapp : dto.whatsapp?.trim() || null,
        email: dto.email === undefined ? (company as any).email : dto.email?.trim() || null,
      },
      include: {
        _count: {
          select: { contacts: true },
        },
      },
    });

    const dealTotals = await prisma.deal.aggregate({
      where: {
        organizationId,
        companyId: updatedCompany.id,
      },
      _sum: {
        value: true,
      },
    });

    const uc = updatedCompany as any;
    return {
      success: true,
      statusCode: 200,
      data: {
        id: updatedCompany.id,
        name: updatedCompany.name,
        domain: updatedCompany.domain,
        logoUrl: updatedCompany.logoUrl,
        industry: uc.industry || null,
        phone: uc.phone || null,
        status: uc.status || "Lead",
        employeeCount: uc.employeeCount ?? null,
        annualRevenue: uc.annualRevenue != null ? String(uc.annualRevenue) : null,
        address: uc.address || null,
        source: uc.source || "Manual",
        notes: uc.notes || null,
        linkedin: uc.linkedin || null,
        twitter: uc.twitter || null,
        instagram: uc.instagram || null,
        whatsapp: uc.whatsapp || null,
        email: uc.email || null,
        organizationId: updatedCompany.organizationId,
        contactsCount: updatedCompany._count.contacts,
        totalDealValue: formatDecimalValue(dealTotals._sum.value),
        createdAt: updatedCompany.createdAt,
      },
    };
  }
}

export const companyService = new CompanyService();
