import { prisma } from "@/shared/config/db/prisma";
import crypto from "crypto";
import {
  AcceptInviteRequestDto,
  CreateInviteRequestDto,
  UpdateOrgNameRequestDto,
  GetUserOrganizationsServiceResult,
  CreateWorkspaceInviteServiceResult,
  GetWorkspaceInvitationsServiceResult,
  AcceptWorkspaceInviteServiceResult,
  GetOrganizationMembersServiceResult,
  UpdateOrganizationNameServiceResult,
  GetWorkspaceInviteByTokenServiceResult,
  GetInvitationDetailsByTokenServiceResult,
  OrganizationDto,
  OrgMemberDto,
  InvitationDetailsDto,
} from "./organization.dto";
import { emailService } from "@/shared/config/email/email.service";

export class OrganizationService {

  async getUserOrganizations(userId: string): Promise<GetUserOrganizationsServiceResult> {
    const userWorkspaceRelations = await prisma.organizationUser.findMany({
      where: { userId },
      include: { organization: true },
      orderBy: { createdAt: "desc" },
    });

    const organizations: OrganizationDto[] = userWorkspaceRelations.map((relation) => ({
      id: relation.organization.id,
      name: relation.organization.name,
      billingPlan: relation.organization.billingPlan,
      createdAt: relation.organization.createdAt,
      avatar: relation.organization.avatar,
    }));

    return { success: true, statusCode: 200, data: organizations };
  }

  async createWorkspaceInvite(
    sessionOrgId: string,
    routeOrgId: string,
    userId: string,
    orgName: string,
    dto: CreateInviteRequestDto,
  ): Promise<CreateWorkspaceInviteServiceResult> {
    if (sessionOrgId !== routeOrgId) {
      return { success: false, statusCode: 400, reason: "ORGANIZATION_MISMATCH" };
    }

    const inviterMembership = await prisma.organizationUser.findFirst({
      where: { organizationId: sessionOrgId, userId },
    });

    if (!inviterMembership || !["OWNER", "ADMIN"].includes(inviterMembership.role)) {
      return { success: false, statusCode: 403, reason: "UNAUTHORIZED_ACTION" };
    }

    const sanitizedEmail = dto.email.toLowerCase().trim();

    const existingMember = await prisma.organizationUser.findFirst({
      where: {
        organizationId: sessionOrgId,
        user: { email: sanitizedEmail },
      },
    });

    if (existingMember) {
      return { success: false, statusCode: 409, reason: "USER_ALREADY_MEMBER" };
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
      return { success: false, statusCode: 409, reason: "INVITE_ALREADY_PENDING" };
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
    emailService.sendWorkspaceInvitation(invitation.email, orgName, invitation.token);

    return { success: true, statusCode: 201, data: invitation };
  }

  async getWorkspaceInvitations(
    sessionOrgId: string,
    routeOrgId: string,
  ): Promise<GetWorkspaceInvitationsServiceResult> {
    if (sessionOrgId !== routeOrgId) {
      return { success: false, statusCode: 400, reason: "ORGANIZATION_MISMATCH" };
    }

    const invitations = await prisma.invitation.findMany({
      where: { organizationId: sessionOrgId },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, statusCode: 200, data: invitations };
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
      return { success: false, statusCode: 404, reason: "INVITE_NOT_FOUND" };
    }

    if (invitation.email.toLowerCase().trim() !== authEmail.toLowerCase().trim()) {
      return { success: false, statusCode: 403, reason: "EMAIL_MISMATCH" };
    }

    if (invitation.isUsed) {
      return { success: false, statusCode: 410, reason: "INVITE_ALREADY_USED" };
    }

    if (new Date() > invitation.expiresAt) {
      return { success: false, statusCode: 410, reason: "INVITE_EXPIRED" };
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
      data: { organizationId: invitation.organizationId, role: invitation.role },
    };
  }

  async getOrganizationMembers(
    sessionUserId: string,
    targetOrgId: string,
  ): Promise<GetOrganizationMembersServiceResult> {
    const checkMembership = await prisma.organizationUser.findFirst({
      where: { organizationId: targetOrgId, userId: sessionUserId },
    });

    if (!checkMembership) {
      return { success: false, statusCode: 403, reason: "NOT_A_MEMBER" };
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

  async updateOrganizationName(
    sessionUserId: string,
    targetOrgId: string,
    dto: UpdateOrgNameRequestDto,
  ): Promise<UpdateOrganizationNameServiceResult> {
    const membership = await prisma.organizationUser.findFirst({
      where: { organizationId: targetOrgId, userId: sessionUserId },
    });

    if (!membership) {
      return { success: false, statusCode: 403, reason: "NOT_A_MEMBER" };
    }

    if (!["OWNER", "ADMIN"].includes(membership.role)) {
      return { success: false, statusCode: 403, reason: "UNAUTHORIZED_ACTION" };
    }

    const updatedOrg = await prisma.organization.update({
      where: { id: targetOrgId },
      data: { name: dto.name.trim() },
    });

    return { success: true, statusCode: 200, data: { id: updatedOrg.id, name: updatedOrg.name } };
  }

  async getWorkspaceInviteByToken(
    sessionOrgId: string,
    routeOrgId: string,
    token: string,
  ): Promise<GetWorkspaceInviteByTokenServiceResult> {
    if (sessionOrgId !== routeOrgId) {
      return { success: false, statusCode: 400, reason: "ORGANIZATION_MISMATCH" };
    }

    const invitation = await prisma.invitation.findFirst({
      where: { organizationId: sessionOrgId, token: token },
    });

    if (!invitation) {
      return { success: false, statusCode: 404, reason: "INVITATION_NOT_FOUND" };
    }

    return { success: true, statusCode: 200, data: invitation };
  }

  async getInvitationDetailsByToken(token: string): Promise<GetInvitationDetailsByTokenServiceResult> {
    const invitation = await prisma.invitation.findUnique({
      where: { token },
      include: {
        organization: { select: { name: true } },
        invitedBy: { select: { name: true } },
      },
    });

    if (!invitation) {
      return { success: false, statusCode: 404, reason: "INVITATION_NOT_FOUND" };
    }

    if (invitation.isUsed) {
      return { success: false, statusCode: 410, reason: "INVITATION_ALREADY_USED" };
    }

    if (new Date() > invitation.expiresAt) {
      return { success: false, statusCode: 410, reason: "INVITATION_EXPIRED" };
    }

    const inviterRole = await prisma.organizationUser.findFirst({
      where: { organizationId: invitation.organizationId, userId: invitation.invitedById },
      select: { role: true },
    });

    const details: InvitationDetailsDto = {
      email: invitation.email,
      workspaceName: invitation.organization.name,
      inviterName: invitation.invitedBy?.name ?? null,
      inviterRole: inviterRole?.role || "MEMBER",
      assignedRole: invitation.role || "MEMBER",
      token: invitation.token,
      expiresAt: invitation.expiresAt,
      isExistingUser : invitation.isExistingUser
    };






    return { success: true, statusCode: 200, data: details };
  }
}