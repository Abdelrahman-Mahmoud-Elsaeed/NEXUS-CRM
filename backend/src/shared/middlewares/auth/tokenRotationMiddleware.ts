import { Request, Response, NextFunction } from "express";
import { SessionService } from "@/modules/session/session.service";
import {
  getSessionMeta,
  setRefreshCookie,
} from "@/modules/session/session.utils";
import { UserProfileDto } from "@/modules/auth/auth.dto";

const sessionService = new SessionService();

const unauthorized = (res: Response, reason: string, msg: string, statusCode = 401) => {
  return res.status(statusCode).json({
    success: false,
    statusCode,
    reason,
    msg,
  });
};

export const tokenRotationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const payload = req.jwtPayload;
  const currentSession = req.currentCachedSession;

  if (!payload || !currentSession) {
    return unauthorized(
      res,
      "UNAUTHORIZED",
      "Session context is missing or corrupted."
    );
  }

  const now = Math.floor(Date.now() / 1000);

  const ACCESS_TOKEN_THRESHOLD = 5 * 60;
  const REFRESH_TOKEN_THRESHOLD = 24 * 60 * 60;

  const timeRemaining = payload.exp - now;

  const shouldRotateAccess =
    payload.isExpired || timeRemaining < ACCESS_TOKEN_THRESHOLD;

  const sessionAge =
    now - Math.floor(currentSession.createdAt / 1000);

  const shouldRotateRefresh = sessionAge > REFRESH_TOKEN_THRESHOLD;

  if (!shouldRotateAccess) {
    req.sessionId = payload.sessionId;
    return next();
  }

  const user = {
    id: payload.userId,
    email: payload.email,
    name: payload.name,
    isVerified: payload.otpVerified,
  } as UserProfileDto;

  const meta = shouldRotateRefresh ? await getSessionMeta(req) : undefined;

  const rotated = await sessionService.rotate(
    user,
    payload.sessionId,
    currentSession,
    shouldRotateRefresh,
    meta,
  );

  if (!rotated) {
    return unauthorized(
      res,
      "TOKEN_ROTATION_FAILED",
      "Failed to refresh session."
    );
  }

  if (shouldRotateRefresh) {
    setRefreshCookie(res, rotated.sessionId);
  }

  res.setHeader("X-New-Access-Token", rotated.accessToken);
  res.setHeader("Access-Control-Expose-Headers", "X-New-Access-Token");

  req.sessionId = rotated.sessionId;

  return next();
};