// src/shared/middleware/token-rotation.middleware.ts
import { Request, Response, NextFunction } from "express";
import { SessionService } from "@/modules/session/session.service";
import {
  getSessionMeta,
  setRefreshCookie,
} from "@/modules/session/session.utils";
import { UserProfileDto } from "@/modules/auth/auth.dto";

const sessionService = new SessionService();

export const tokenRotationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const payload = req.jwtPayload;
    const currentSession = req.currentCachedSession;

    if (!payload || !currentSession) {
      return res.status(401).json({
        success: false,
        reason: "UNAUTHORIZED",
        message: "Session context is missing or corrupted.",
      });
    }

    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    const timeRemainingInSeconds = payload.exp - currentTimeInSeconds;

    const ACCESS_TOKEN_THRESHOLD = 5 * 60; // 5 minutes
    const REFRESH_TOKEN_THRESHOLD = 24 * 60 * 60; // 1 day

    const shouldRotateAccess =
      payload.isExpired || timeRemainingInSeconds < ACCESS_TOKEN_THRESHOLD;

    const sessionAgeInSeconds =
      currentTimeInSeconds - Math.floor(currentSession.createdAt / 1000);
    const shouldRotateRefresh = sessionAgeInSeconds > REFRESH_TOKEN_THRESHOLD;

    if (shouldRotateAccess) {
      const userMock = {
        id: payload.userId,
        email: payload.email,
        name: payload.name,
        isVerified: payload.otpVerified,
      } as UserProfileDto;

      const meta = shouldRotateRefresh ? await getSessionMeta(req) : undefined;

      const rotated = await sessionService.rotate(
        userMock,
        payload.sessionId,
        currentSession,
        shouldRotateRefresh,
        meta,
      );

      if (shouldRotateRefresh) {
        setRefreshCookie(res, rotated.sessionId);
      }

      res.setHeader("X-New-Access-Token", rotated.accessToken);
      res.setHeader("Access-Control-Expose-Headers", "X-New-Access-Token");

      req.sessionId = rotated.sessionId;
    } else {
      req.sessionId = payload.sessionId;
    }

    return next();
  } catch (err) {
    return next();
  }
};
