import { Request, Response, NextFunction } from "express";

export const verifiedMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user?.isVerified) {
    return res.status(403).json({
      success: false,
      reason: "EMAIL_NOT_VERIFIED",
    });
  }

  next();
};