import { prisma } from "@/shared/config/db/prisma";
import {
  CompanyResponseDto,
  CreateCompanyRequestDto,
  GetCompaniesServiceResult,
  CreateCompanyServiceResult,
} from "./companies.dto";

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
        include: {
          _count: {
            select: { contacts: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: skip,
        take: limit,
      }),
      prisma.company.count({
        where: whereCondition,
      }),
    ]);

    const formattedCompanies: CompanyResponseDto[] = companies.map((company) => ({
      id: company.id,
      name: company.name,
      domain: company.domain,
      logoUrl: company.logoUrl,
      organizationId: company.organizationId,
      contactsCount: company._count.contacts,
      createdAt: company.createdAt,
    }));

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
        organizationId,
      },
      include: {
        _count: {
          select: { contacts: true },
        },
      },
    });

    return {
      success: true,
      statusCode: 201,
      data: {
        id: company.id,
        name: company.name,
        domain: company.domain,
        logoUrl: company.logoUrl,
        organizationId: company.organizationId,
        contactsCount: company._count.contacts,
        createdAt: company.createdAt,
      },
    };
  }
}

export const companyService = new CompanyService();