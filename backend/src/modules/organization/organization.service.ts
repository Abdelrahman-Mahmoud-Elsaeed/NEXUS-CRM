import { prisma } from "@/shared/config/db/prisma";

import crypto from "crypto";
import {
  AcceptInviteRequestDto,
  AcceptInviteServiceResult,
  CreateInviteRequestDto,
  CreateInviteServiceResult,
  GetInvitationsServiceResult,
  GetOrgMembersServiceResult,
  GetUserOrganizationsServiceResult,
  OrganizationDto,
  OrgMemberDto,
  UpdateOrgNameRequestDto,
  UpdateOrgNameServiceResult,
} from "./organization.dto";
import { emailService } from "@/shared/config/email/email.service";

export class OrganizationService {
  async getUserOrganizations(
    userId: string,
  ): Promise<GetUserOrganizationsServiceResult> {
    const userWorkspaceRelations = await prisma.organizationUser.findMany({
      where: { userId },
      include: {
        organization: {
          include: {
            tags: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const organizations: OrganizationDto[] = userWorkspaceRelations.map(
      (relation: any) => ({
        id: relation.organization.id,
        name: relation.organization.name,
        billingPlan: relation.organization.billingPlan,
        createdAt: relation.organization.createdAt,
        avatar: relation.organization.avatar,
      }),
    );

    return {
      success: true,
      data: organizations,
    };
  }

  async createWorkspaceInvite(
    sessionOrgId: string,
    routeOrgId: string,
    orgName: string,
    dto: CreateInviteRequestDto,
  ): Promise<CreateInviteServiceResult> {
    if (sessionOrgId !== routeOrgId) {
      return { success: false, reason: "ORGANIZATION_MISMATCH" };
    }

    const existingMember = await prisma.organizationUser.findFirst({
      where: {
        organizationId: sessionOrgId,
        user: { email: dto.email.toLowerCase().trim() },
      },
    });

    if (existingMember) {
      return { success: false, reason: "USER_ALREADY_MEMBER" };
    }

    const activeInvite = await prisma.invitation.findFirst({
      where: {
        organizationId: sessionOrgId,
        email: dto.email.toLowerCase().trim(),
        isUsed: false,
        expiresAt: { gte: new Date() },
      },
    });

    if (activeInvite) {
      return { success: false, reason: "INVITE_ALREADY_PENDING" };
    }

    const secureToken = crypto.randomBytes(32).toString("hex");
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 48);

    const invitation = await prisma.invitation.create({
      data: {
        organizationId: sessionOrgId,
        email: dto.email.toLowerCase().trim(),
        role: dto.role,
        token: secureToken,
        expiresAt: expirationDate,
      },
    });
    await emailService.sendWorkspaceInvitation(
    invitation.email,
    orgName,
    invitation.token
  );
    return { success: true, data: invitation };
  }

  async getWorkspaceInvitations(
    sessionOrgId: string,
    routeOrgId: string,
  ): Promise<GetInvitationsServiceResult> {
    if (sessionOrgId !== routeOrgId) {
      return { success: false, reason: "ORGANIZATION_MISMATCH" };
    }

    const invitations = await prisma.invitation.findMany({
      where: {
        organizationId: sessionOrgId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, data: [...invitations] };
  }

  async acceptWorkspaceInvite(
    userId: string,
    dto: AcceptInviteRequestDto,
  ): Promise<AcceptInviteServiceResult> {
    const invitation = await prisma.invitation.findUnique({
      where: { token: dto.token },
    });

    if (!invitation) {
      return { success: false, reason: "INVITE_NOT_FOUND" };
    }

    if (invitation.isUsed) {
      return { success: false, reason: "INVITE_ALREADY_USED" };
    }

    if (new Date() > invitation.expiresAt) {
      return { success: false, reason: "INVITE_EXPIRED" };
    }

    await prisma.$transaction([
      prisma.organizationUser.create({
        data: {
          organizationId: invitation.organizationId,
          userId: userId,
          role: invitation.role,
        },
      }),

      prisma.invitation.update({
        where: { id: invitation.id },
        data: {
          isUsed: true,
          acceptedAt: new Date(),
        },
      }),
    ]);

    return {
      success: true,
      data: {
        organizationId: invitation.organizationId,
        role: invitation.role,
      },
    };
  }

  async getOrganizationMembers(
    sessionUserId: string,
    targetOrgId: string,
  ): Promise<GetOrgMembersServiceResult> {
    const isUserInOrg = await prisma.organizationUser.findFirst({
      where: {
        organizationId: targetOrgId,
        userId: sessionUserId,
      },
    });

    if (!isUserInOrg) {
      return { success: false, reason: "NOT_A_MEMBER" };
    }

    const memberRelations = await prisma.organizationUser.findMany({
      where: {
        organizationId: targetOrgId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const members: OrgMemberDto[] = memberRelations.map((relation) => ({
      id: relation.user.id,
      name: relation.user.name ?? "Unknown Member",
      email: relation.user.email,
      role: relation.role,
      joinedAt: relation.createdAt,
    }));

    return {
      success: true,
      data: members,
    };
  }

  async updateOrganizationName(
    sessionUserId: string,
    targetOrgId: string,
    dto: UpdateOrgNameRequestDto,
  ): Promise<UpdateOrgNameServiceResult> {
    const membership = await prisma.organizationUser.findFirst({
      where: {
        organizationId: targetOrgId,
        userId: sessionUserId,
      },
    });

    if (!membership) {
      return { success: false, reason: "NOT_A_MEMBER" };
    }

    try {
      // 2. Perform the update operation
      const updatedOrg = await prisma.organization.update({
        where: { id: targetOrgId },
        data: { name: dto.name.trim() },
      });

      return {
        success: true,
        data: {
          id: updatedOrg.id,
          name: updatedOrg.name,
        },
      };
    } catch (error) {
      return { success: false, reason: "ORGANIZATION_NOT_FOUND" };
    }
  }

  async getInvitationDetailsByToken(
    token: string,
  ): Promise<any> {
    try {
      const invitation = await prisma.invitation.findUnique({
        where: { token },
        include: {
          organization: {
            select: {
              name: true,
            },
          },
          invitedBy: {
            select: {
              name: true,
            },
          },
        },
      });

      if (!invitation) {
        return { success: false, reason: "INVITATION_NOT_FOUND" };
      }

      if (invitation.isUsed) {
        return { success: false, reason: "INVITATION_ALREADY_USED" };
      }

      if (new Date() > invitation.expiresAt) {
        return { success: false, reason: "INVITATION_EXPIRED" };
      }

      const inviterRole = await prisma.organizationUser.findFirst({
        where: {
          organizationId: invitation.organizationId,
          userId: invitation.invitedById,
        },
        select: {
          role: true,
        },
      });

      return {
        success: true,
        data: {
          email: invitation.email,
          workspaceName: invitation.organization.name,
          inviterName: invitation.invitedBy.name,
          inviterRole: inviterRole?.role || "MEMBER",
          token: invitation.token,
          expiresAt: invitation.expiresAt,
        },
      };
    } catch (error) {
      return { success: false, reason: "DATABASE_ERROR" };
    }
  }
}

