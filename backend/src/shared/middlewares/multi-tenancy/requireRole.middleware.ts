import { Request, Response, NextFunction } from "express";
import { Role as PrismaRole } from "@prisma/client";

export const requireRole = (allowedRoles: PrismaRole[]) => {
  return (req: Request, res: Response, next: NextFunction): any => {
    if (
      !req.organizationRole ||
      !allowedRoles.includes(req.organizationRole)
    ) {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        reason: "INSUFFICIENT_PERMISSIONS",
        msg:
          "Your workspace role does not have permission to perform this action.",
      });
    }

    return next();
  };
};