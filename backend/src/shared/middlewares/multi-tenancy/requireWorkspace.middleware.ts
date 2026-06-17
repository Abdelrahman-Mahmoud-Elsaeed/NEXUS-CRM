import { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/db/prisma";

export const requireWorkspace = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const targetOrgId = req.headers["x-organization-id"] as string;
    const authenticatedUserId =
      req.jwtPayload?.userId || req.user?.userId;

    if (!authenticatedUserId) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        reason: "UNAUTHORIZED",
        msg: "Authentication context is missing or expired.",
      });
    }

    if (!targetOrgId) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        reason: "ORGANIZATION_HEADER_REQUIRED",
        msg: "Missing 'x-organization-id' in request headers.",
      });
    }

    const membership = await prisma.organizationUser.findUnique({
      where: {
        organizationId_userId: {
          organizationId: targetOrgId,
          userId: authenticatedUserId,
        },
      },
      select: {
        role: true,
        organization: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        reason: "FORBIDDEN_WORKSPACE_ACCESS",
        msg: "You do not have access to this workspace.",
      });
    }

    req.organizationId = targetOrgId;
    req.organizationRole = membership.role;
    req.organizationName = membership.organization.name;

    return next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      reason: "INTERNAL_SERVER_ERROR",
      msg:
        "An unexpected error occurred during workspace validation.",
    });
  }
};