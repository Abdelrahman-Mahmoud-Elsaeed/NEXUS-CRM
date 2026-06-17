import { Request, Response } from "express";
import { InvitationService } from "./invitation.service";
import { AcceptInviteApiResponse, CreateInviteApiResponse } from "./invitation.dto";

const invitationService = new InvitationService();

export class InvitationController {
  async getWorkspaceInvitations(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const routeOrgId = req.params.id as string;
    const sessionOrgId = req.organizationId as string;

    if (!sessionOrgId) {
      return res.status(401).json({ success: false, reason: "UNAUTHORIZED" });
    }

    const result = await invitationService.getWorkspaceInvitations(
      sessionOrgId,
      routeOrgId,
    );

    if (!result.success) {
      return res
        .status(result.statusCode)
        .json({ success: false, reason: result.reason, msg: result.msg });
    }

    return res
      .status(result.statusCode)
      .json({ success: true, data: result.data });
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

    const result = await invitationService.createWorkspaceInvite(
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
        msg: result.msg,
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

  async getInvitationDetailsByToken(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const { token } = req.params;

    if (!token || typeof token !== "string") {
      return res.status(400).json({ success: false, reason: "INVALID_INPUT" });
    }

    const result = await invitationService.getInvitationDetailsByToken(token);

    if (!result.success) {
      return res
        .status(result.statusCode)
        .json({ success: false, reason: result.reason, msg: result.msg });
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

    const result = await invitationService.getWorkspaceInviteByToken(
      sessionOrgId,
      routeOrgId,
      token,
    );

    if (!result.success) {
      return res
        .status(result.statusCode)
        .json({ success: false, reason: result.reason, msg: result.msg });
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
  
      const result = await invitationService.acceptWorkspaceInvite(
        user.userId,
        user.email,
        { token },
      );
  
      if (!result.success) {
        return res
          .status(result.statusCode)
          .json({ success: false, reason: result.reason, msg: result.msg });
      }
  
      return res.status(result.statusCode).json({
        success: true,
        data: {
          organizationId: result.data.organizationId,
          message: "Successfully joined workspace.",
        },
      });
    }
}
