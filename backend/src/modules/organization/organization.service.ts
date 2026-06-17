import { prisma } from "@/shared/config/db/prisma";
import {
  UpdateOrgNameRequestDto,
  GetUserOrganizationsServiceResult,
  UpdateOrganizationNameServiceResult,
  OrganizationDto,
} from "./organization.dto";

export class OrganizationService {
  async getUserOrganizations(
    userId: string,
  ): Promise<GetUserOrganizationsServiceResult> {
    const userWorkspaceRelations = await prisma.organizationUser.findMany({
      where: { userId },
      include: { organization: true },
      orderBy: { createdAt: "desc" },
    });

    const organizations: OrganizationDto[] = userWorkspaceRelations.map(
      (relation) => ({
        id: relation.organization.id,
        name: relation.organization.name,
        billingPlan: relation.organization.billingPlan,
        createdAt: relation.organization.createdAt,
        avatar: relation.organization.avatar,
      }),
    );

    return { success: true, statusCode: 200, data: organizations };
  }



  async updateOrganizationName(
    sessionUserId: string,
    targetOrgId: string,
    dto: UpdateOrgNameRequestDto,
  ): Promise<UpdateOrganizationNameServiceResult> {
    const membership = await prisma.organizationUser.findFirst({
      where: { organizationId: targetOrgId, userId: sessionUserId },
    });

    if (!membership) {
      return {
        success: false,
        statusCode: 403,
        reason: "NOT_A_MEMBER",
        msg: "You are not a member of this organization.",
      };
    }

    if (!["OWNER", "ADMIN"].includes(membership.role)) {
      return {
        success: false,
        statusCode: 403,
        reason: "UNAUTHORIZED_ACTION",
        msg: "You do not have permission to perform this action.",
      };
    }

    const updatedOrg = await prisma.organization.update({
      where: { id: targetOrgId },
      data: { name: dto.name.trim() },
    });

    return {
      success: true,
      statusCode: 200,
      data: { id: updatedOrg.id, name: updatedOrg.name },
    };
  }
}
