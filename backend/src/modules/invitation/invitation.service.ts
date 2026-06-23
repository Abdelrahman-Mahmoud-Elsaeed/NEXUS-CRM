import { prisma } from "@config/db/prisma";
import {
  AcceptInviteRequestDto,
  AcceptWorkspaceInviteServiceResult,
  CreateInviteRequestDto,
  CreateWorkspaceInviteServiceResult,
  GetInvitationDetailsByTokenServiceResult,
  GetWorkspaceInvitationsServiceResult,
  GetWorkspaceInviteByTokenServiceResult,
  InvitationDetailsDto,
} from "./invitation.dto";
import { emailService } from "@/shared/config/email/email.service";
import crypto from "crypto";

export class InvitationService {
  async getWorkspaceInvitations(
    sessionOrgId: string,
    routeOrgId: string,
  ): Promise<GetWorkspaceInvitationsServiceResult> {
    if (sessionOrgId !== routeOrgId) {
      return {
        success: false,
        statusCode: 400,
        reason: "ORGANIZATION_MISMATCH",
        msg: "Organization mismatch. Please switch to the correct organization.",
      };
    }

    const invitations = await prisma.invitation.findMany({
      where: { organizationId: sessionOrgId },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, statusCode: 200, data: invitations };
  }

  async getInvitationDetailsByToken(
    token: string,
  ): Promise<GetInvitationDetailsByTokenServiceResult> {
    const invitation = await prisma.invitation.findUnique({
      where: { token },
      include: {
        organization: { select: { name: true } },
        invitedBy: { select: { name: true } },
      },
    });
    if (!invitation) {
      return {
        success: false,
        statusCode: 404,
        reason: "INVITATION_NOT_FOUND",
        msg: "Invitation not found or invalid.",
      };
    }

    if (invitation.isUsed) {
      return {
        success: false,
        statusCode: 410,
        reason: "INVITATION_ALREADY_USED",
        msg: "This invitation has already been used.",
      };
    }

    if (new Date() > invitation.expiresAt) {
      return {
        success: false,
        statusCode: 410,
        reason: "INVITATION_EXPIRED",
        msg: "This invitation has expired. Please request a new one.",
      };
    }
    const inviterRole = await prisma.organizationUser.findFirst({
      where: {
        organizationId: invitation.organizationId,
        userId: invitation.invitedById,
      },
      select: { role: true },
    });

    const details: InvitationDetailsDto = {
      email: invitation.email,
      workspaceName: invitation.organization.name,
      inviterName: invitation.invitedBy?.name ?? null,
      inviterRole: inviterRole?.role || "Member",
      assignedRole: invitation.role || "Member",
      token: invitation.token,
      expiresAt: invitation.expiresAt,
      isExistingUser: invitation.isExistingUser,
    };

    return { success: true, statusCode: 200, data: details };
  }

  async createWorkspaceInvite(
    sessionOrgId: string,
    routeOrgId: string,
    userId: string,
    orgName: string,
    dto: CreateInviteRequestDto,
  ): Promise<CreateWorkspaceInviteServiceResult> {
    if (sessionOrgId !== routeOrgId) {
      return {
        success: false,
        statusCode: 400,
        reason: "ORGANIZATION_MISMATCH",
        msg: "Organization mismatch. Please switch to the correct organization.",
      };
    }

    const inviterMembership = await prisma.organizationUser.findFirst({
      where: { organizationId: sessionOrgId, userId },
    });

    if (
      !inviterMembership ||
      !["Owner", "Admin"].includes(inviterMembership.role)
    ) {
      return {
        success: false,
        statusCode: 403,
        reason: "UNAUTHORIZED_ACTION",
        msg: "You are not allowed to perform this action.",
      };
    }

    const sanitizedEmail = dto.email.toLowerCase().trim();

    const existingMember = await prisma.organizationUser.findFirst({
      where: {
        organizationId: sessionOrgId,
        user: { email: sanitizedEmail },
      },
    });

    if (existingMember) {
      return {
        success: false,
        statusCode: 409,
        reason: "USER_ALREADY_MEMBER",
        msg: "This user is already a member of the organization.",
      };
    }

    const activeInvite = await prisma.invitation.findFirst({
      where: {
        organizationId: sessionOrgId,
        email: sanitizedEmail,
        isUsed: false,
        expiresAt: { gte: new Date() },
      },
    });

    if (activeInvite) {
      return {
        success: false,
        statusCode: 409,
        reason: "INVITE_ALREADY_PENDING",
        msg: "An invitation is already pending for this user.",
      };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
    });

    const secureToken = crypto.randomBytes(32).toString("hex");
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 48);

    const invitation = await prisma.invitation.create({
      data: {
        organizationId: sessionOrgId,
        email: sanitizedEmail,
        role: dto.role,
        token: secureToken,
        expiresAt: expirationDate,
        invitedById: userId,
        isExistingUser: !!existingUser,
      },
    });
    emailService.sendWorkspaceInvitation(
      invitation.email,
      orgName,
      invitation.token,
    );

    return { success: true, statusCode: 201, data: invitation };
  }

  async getWorkspaceInviteByToken(
    sessionOrgId: string,
    routeOrgId: string,
    token: string,
  ): Promise<GetWorkspaceInviteByTokenServiceResult> {
    if (sessionOrgId !== routeOrgId) {
      return {
        success: false,
        statusCode: 400,
        reason: "ORGANIZATION_MISMATCH",
        msg: "Organization mismatch. Please verify you are using the correct organization.",
      };
    }

    const invitation = await prisma.invitation.findFirst({
      where: { organizationId: sessionOrgId, token: token },
    });

    if (!invitation) {
      return {
        success: false,
        statusCode: 404,
        reason: "INVITATION_NOT_FOUND",
        msg: "Invitation not found.",
      };
    }

    return { success: true, statusCode: 200, data: invitation };
  }

  async acceptWorkspaceInvite(
    userId: string,
    authEmail: string,
    dto: AcceptInviteRequestDto,
  ): Promise<AcceptWorkspaceInviteServiceResult> {
    const invitation = await prisma.invitation.findUnique({
      where: { token: dto.token },
    });
    if (!invitation) {
      return {
        success: false,
        statusCode: 404,
        reason: "INVITE_NOT_FOUND",
        msg: "Invitation not found.",
      };
    }

    if (
      invitation.email.toLowerCase().trim() !== authEmail.toLowerCase().trim()
    ) {
      return {
        success: false,
        statusCode: 403,
        reason: "EMAIL_MISMATCH",
        msg: "This invitation is not linked to your email address.",
      };
    }

    if (invitation.isUsed) {
      return {
        success: false,
        statusCode: 410,
        reason: "INVITE_ALREADY_USED",
        msg: "This invitation has already been used.",
      };
    }

    if (new Date() > invitation.expiresAt) {
      return {
        success: false,
        statusCode: 410,
        reason: "INVITE_EXPIRED",
        msg: "This invitation has expired. Please request a new one.",
      };
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
        data: { isUsed: true, acceptedAt: new Date() },
      }),
    ]);

    return {
      success: true,
      statusCode: 200,
      data: {
        organizationId: invitation.organizationId,
        role: invitation.role,
      },
    };
  }
}
