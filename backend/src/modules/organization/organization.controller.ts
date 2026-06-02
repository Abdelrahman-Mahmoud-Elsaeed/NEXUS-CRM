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
      return res.status(401).json({
        success: false,
        reason: "UNAUTHORIZED",
      });
    }

    const result = await organizationService.getUserOrganizations(userId);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        reason: "INTERNAL_SERVER_ERROR",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        organizations: result.data,
      },
    });
  }

  async inviteUser(
    req: Request,
    res: Response,
  ): Promise<Response<CreateInviteApiResponse>> {
    const sessionOrgId = req.organizationId;
    const routeOrgId = req.params.id as string;
    const { email, role } = req.body;

    if (!sessionOrgId) {
      return res.status(401).json({ success: false, reason: "UNAUTHORIZED" });
    }

    const result = await organizationService.createWorkspaceInvite(
      sessionOrgId,
      routeOrgId,
      req.organizationName,
      { email, role },
    );

    if (!result.success) {
      switch (result.reason) {
        case "ORGANIZATION_MISMATCH":
          return res
            .status(400)
            .json({ success: false, reason: "ORGANIZATION_MISMATCH" });
        case "USER_ALREADY_MEMBER":
          return res
            .status(409)
            .json({ success: false, reason: "USER_ALREADY_MEMBER" });
        case "INVITE_ALREADY_PENDING":
          return res
            .status(409)
            .json({ success: false, reason: "INVITE_ALREADY_PENDING" });
        case "DATABASE_ERROR":
        default:
          return res
            .status(500)
            .json({ success: false, reason: "INTERNAL_SERVER_ERROR" });
      }
    }

    return res.status(201).json({
      success: true,
      data: {
        invitationId: result.data.id,
        email: result.data.email,
        expiresAt: result.data.expiresAt,
      },
    });
  }

  async getWorkspaceInvitations(req: Request, res: Response) {
    const routeOrgId = req.params.id as string;
    const sessionOrgId = req.organizationId as string;

    const result = await organizationService.getWorkspaceInvitations(
      sessionOrgId,
      routeOrgId,
    );
    if (!result.success) {
      if (result.reason === "ORGANIZATION_MISMATCH") {
        res.status(403).json({
          success: false,
          reason: "ORGANIZATION_MISMATCH",
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        reason:
        "An internal server error occurred while retrieving invitations.",
      });
      return;
    }

    // Send back successful results ledger
    res.status(200).json({
      success: true,
      data: result.data,
    });
  }

  async acceptInvite(
    req: Request,
    res: Response,
  ): Promise<Response<AcceptInviteApiResponse>> {
    const { token } = req.body;
    const userId = req.user?.userId;

    if (!token || typeof token !== "string") {
      return res.status(400).json({ success: false, reason: "INVALID_INPUT" });
    }

    if (!userId) {
      return res.status(401).json({ success: false, reason: "UNAUTHORIZED" });
    }

    const result = await organizationService.acceptWorkspaceInvite(userId, {
      token,
    });

    if (!result.success) {
      switch (result.reason) {
        case "INVITE_NOT_FOUND":
          return res
            .status(404)
            .json({ success: false, reason: "INVITE_NOT_FOUND" });
        case "INVITE_ALREADY_USED":
          return res
            .status(409)
            .json({ success: false, reason: "INVITE_ALREADY_USED" });
        case "INVITE_EXPIRED":
          return res
            .status(410)
            .json({ success: false, reason: "INVITE_EXPIRED" });
        default:
          return res
            .status(500)
            .json({ success: false, reason: "INTERNAL_SERVER_ERROR" });
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        organizationId: result.data.organizationId,
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
      switch (result.reason) {
        case "NOT_A_MEMBER":
          return res.status(403).json({
            success: false,
            reason: "FORBIDDEN_ORGANIZATION_ACCESS",
          });
        default:
          return res.status(500).json({
            success: false,
            reason: "INTERNAL_SERVER_ERROR",
          });
      }
    }

    return res.status(200).json({
      success: true,
      data:result.data,
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
      switch (result.reason) {
        case "NOT_A_MEMBER":
          return res.status(403).json({
            success: false,
            reason: "FORBIDDEN_ORGANIZATION_ACCESS",
          });
        case "ORGANIZATION_NOT_FOUND":
          return res.status(404).json({
            success: false,
            reason: "ORGANIZATION_NOT_FOUND",
          });
        default:
          return res.status(500).json({
            success: false,
            reason: "INTERNAL_SERVER_ERROR",
          });
      }
    }

    return res.status(200).json({
      success: true,
      data: result.data,
    });
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
      switch (result.reason) {
        case "INVITATION_NOT_FOUND":
          return res.status(404).json({
            success: false,
            reason: "INVITATION_NOT_FOUND",
          });
        case "INVITATION_ALREADY_USED":
          return res.status(410).json({
            success: false,
            reason: "INVITATION_ALREADY_USED",
          });
        case "INVITATION_EXPIRED":
          return res.status(410).json({
            success: false,
            reason: "INVITATION_EXPIRED",
          });
        default:
          return res.status(500).json({
            success: false,
            reason: "INTERNAL_SERVER_ERROR",
          });
      }
    }

    return res.status(200).json({
      success: true,
      data: result.data,
    });
  }
}
