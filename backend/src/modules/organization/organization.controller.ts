import { Request, Response } from "express";
import { OrganizationService } from "./organization.service";
import {
  AcceptInviteApiResponse,
  CreateInviteApiResponse,
  GetOrgMembersApiResponse,
  GetUserOrganizationsResponse,
  UpdateOrgNameApiResponse,
} from "./organization.dto";

const organizationService = new OrganizationService();

export class OrganizationController {
  async getUserOrganizations(
    req: Request,
    res: Response,
  ): Promise<Response<GetUserOrganizationsResponse>> {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, reason: "UNAUTHORIZED" });
    }

    const result = await organizationService.getUserOrganizations(userId);

    return res.status(result.statusCode).json({
      success: true,
      data: { organizations: result.data },
    });
  }

  async inviteUser(
    req: Request,
    res: Response,
  ): Promise<Response<CreateInviteApiResponse>> {
    const sessionOrgId = req.organizationId;
    const routeOrgId = req.params.id as string;
    const userId = req.user?.userId;
    const { email, role } = req.body;

    if (!sessionOrgId || !userId) {
      return res.status(401).json({ success: false, reason: "UNAUTHORIZED" });
    }

    const result = await organizationService.createWorkspaceInvite(
      sessionOrgId,
      routeOrgId,
      userId,
      req.organizationName || "Workspace",
      { email, role },
    );

    if (!result.success) {
      return res.status(result.statusCode).json({
        success: false,
        reason:
          result.reason === "UNAUTHORIZED_ACTION"
            ? "INSUFFICIENT_PERMISSIONS"
            : result.reason,
      });
    }

    return res.status(result.statusCode).json({
      success: true,
      data: {
        invitationId: result.data.id,
        email: result.data.email,
        role: result.data.role,
        createdAt: result.data.createdAt,
        expiresAt: result.data.expiresAt,
      },
    });
  }

  async getWorkspaceInvitations(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const routeOrgId = req.params.id as string;
    const sessionOrgId = req.organizationId as string;

    if (!sessionOrgId) {
      return res.status(401).json({ success: false, reason: "UNAUTHORIZED" });
    }

    const result = await organizationService.getWorkspaceInvitations(
      sessionOrgId,
      routeOrgId,
    );

    if (!result.success) {
      return res
        .status(result.statusCode)
        .json({ success: false, reason: result.reason });
    }

    return res
      .status(result.statusCode)
      .json({ success: true, data: result.data });
  }

  async acceptInvite(
    req: Request,
    res: Response,
  ): Promise<Response<AcceptInviteApiResponse>> {
    const { token } = req.body;
    const user = req.user;

    if (!token || typeof token !== "string") {
      return res.status(400).json({ success: false, reason: "INVALID_INPUT" });
    }

    if (!user?.userId) {
      return res.status(401).json({ success: false, reason: "UNAUTHORIZED" });
    }

    const result = await organizationService.acceptWorkspaceInvite(
      user.userId,
      user.email,
      { token },
    );

    if (!result.success) {
      return res
        .status(result.statusCode)
        .json({ success: false, reason: result.reason });
    }

    return res.status(result.statusCode).json({
      success: true,
      data: {
        organizationId: result.data.organizationId,
        message: "Successfully joined workspace.",
      },
    });
  }

  async getOrganizationMembers(
    req: Request,
    res: Response,
  ): Promise<Response<GetOrgMembersApiResponse>> {
    const userId = req.user?.userId;
    const targetOrgId = req.params.id as string;

    if (!userId) {
      return res.status(401).json({ success: false, reason: "UNAUTHORIZED" });
    }

    const result = await organizationService.getOrganizationMembers(
      userId,
      targetOrgId,
    );

    if (!result.success) {
      return res.status(result.statusCode).json({
        success: false,
        reason:
          result.reason === "NOT_A_MEMBER"
            ? "FORBIDDEN_ORGANIZATION_ACCESS"
            : "UNAUTHORIZED",
      });
    }

    return res.status(result.statusCode).json({
      success: true,
      data: { members: result.data },
    });
  }

  async updateOrganizationName(
    req: Request,
    res: Response,
  ): Promise<Response<UpdateOrgNameApiResponse>> {
    const userId = req.user?.userId;
    const targetOrgId = req.params.id as string;
    const { name } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, reason: "UNAUTHORIZED" });
    }

    const result = await organizationService.updateOrganizationName(
      userId,
      targetOrgId,
      { name },
    );

    if (!result.success) {
      return res.status(result.statusCode).json({
        success: false,
        reason:
          result.reason === "NOT_A_MEMBER"
            ? "FORBIDDEN_ORGANIZATION_ACCESS"
            : "UNAUTHORIZED",
      });
    }

    return res
      .status(result.statusCode)
      .json({ success: true, data: result.data });
  }

  async getWorkspaceInviteByToken(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const routeOrgId = req.params.id as string;
    const sessionOrgId = req.organizationId as string;
    const { token } = req.params;

    if (!token || typeof token !== "string") {
      return res.status(400).json({ success: false, reason: "INVALID_INPUT" });
    }

    const result = await organizationService.getWorkspaceInviteByToken(
      sessionOrgId,
      routeOrgId,
      token,
    );

    if (!result.success) {
      return res
        .status(result.statusCode)
        .json({ success: false, reason: result.reason });
    }

    return res
      .status(result.statusCode)
      .json({ success: true, data: result.data });
  }

  async getInvitationDetailsByToken(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const { token } = req.params;

    if (!token || typeof token !== "string") {
      return res.status(400).json({ success: false, reason: "INVALID_INPUT" });
    }

    const result = await organizationService.getInvitationDetailsByToken(token);

    if (!result.success) {
      return res
        .status(result.statusCode)
        .json({ success: false, reason: result.reason });
    }

    return res
      .status(result.statusCode)
      .json({ success: true, data: result.data });
  }
}
