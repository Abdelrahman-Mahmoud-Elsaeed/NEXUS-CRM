import { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/db/prisma";

export const requireWorkspace = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const targetOrgId = req.headers["x-organization-id"] as string;
    const authenticatedUserId = req.jwtPayload?.userId || req.user?.userId;

    if (!authenticatedUserId) {
      return res.status(401).json({
        success: false,
        reason: "UNAUTHORIZED",
        message: "Authentication context is missing or expired.",
      });
    }

    if (!targetOrgId) {
      return res.status(400).json({
        success: false,
        reason: "ORGANIZATION_HEADER_REQUIRED",
        message: "Missing 'x-organization-id' in request headers.",
      });
    }

    // UPDATED: Now queries relational fields to fetch organization context parameters
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
            name: true, // Pulls the organization name directly from DB
          },
        },
      },
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        reason: "FORBIDDEN_WORKSPACE_ACCESS",
        message: "You do not have authorization to access this workspace.",
      });
    }

    req.organizationId = targetOrgId;
    req.organizationRole = membership.role;
    req.organizationName = membership.organization.name;
    
    return next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      reason: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred during tenancy isolation check.",
    });
  }
};