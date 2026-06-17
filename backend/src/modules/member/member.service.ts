import bcrypt from "bcrypt";
import { prisma } from "@config/db/prisma";
import {
  GetOrganizationMembersServiceResult,
  OrgMemberDto,
} from "./member.dto";

export class MemberService {
  async getOrganizationMembers(
    sessionUserId: string,
    targetOrgId: string,
  ): Promise<GetOrganizationMembersServiceResult> {
    const checkMembership = await prisma.organizationUser.findFirst({
      where: { organizationId: targetOrgId, userId: sessionUserId },
    });

    if (!checkMembership) {
      return {
        success: false,
        statusCode: 403,
        reason: "NOT_A_MEMBER",
        msg: "You are not a member of this organization.",
      };
    }
    const memberRelations = await prisma.organizationUser.findMany({
      where: { organizationId: targetOrgId },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    const members: OrgMemberDto[] = memberRelations.map((relation) => ({
      id: relation.user.id,
      name: relation.user.name,
      email: relation.user.email,
      role: relation.role,
      joinedAt: relation.createdAt,
    }));

    return { success: true, statusCode: 200, data: members };
  }
}
