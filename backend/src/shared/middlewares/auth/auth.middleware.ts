import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError, JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../../config/env";
import { CacheService } from "@/shared/services/cache.service";
import { CachedSession } from "@/modules/session/session.service";

const unauthorized = (
  res: Response,
  reason: string,
  msg: string,
  statusCode = 401,
) => {
  return res.status(statusCode).json({
    success: false,
    statusCode,
    reason,
    msg,
  });
};

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return unauthorized(res, "UNAUTHORIZED", "Missing authorization token.");
  }

  const token = authHeader.split(" ")[1];

  let payload: JwtPayload;
  let isAccessTokenExpired = false;

  try {
    payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      payload = jwt.verify(token, JWT_SECRET, {
        ignoreExpiration: true,
      }) as JwtPayload;

      isAccessTokenExpired = true;
    } else {
      return unauthorized(res, "INVALID_TOKEN", "Invalid token.");
    }
  }

  if (!payload?.sessionId || !payload?.userId) {
    return unauthorized(res, "INVALID_TOKEN", "Malformed token payload.");
  }

  const currentSessionId = req.cookies["sid"];

  if (!currentSessionId || currentSessionId !== payload.sessionId) {
    return unauthorized(
      res,
      "SESSION_EXPIRED_OR_REVOKED",
      "Session expired or revoked.",
    );
  }

  const sessionKey = `refresh_token:${payload.userId}:${currentSessionId}`;
  const session = await CacheService.get<CachedSession>(sessionKey);

  if (!session) {
    return unauthorized(
      res,
      "SESSION_EXPIRED_OR_REVOKED",
      "Session expired or revoked.",
    );
  }

  if (session.isDeleted) {
    return unauthorized(
      res,
      "ACCOUNT_HAS_BEEN_DELETED",
      "Account has been deleted.",
      403,
    );
  }

  if (!session.isActive) {
    return unauthorized(
      res,
      "ACCOUNT_IS_INACTIVE_OR_SUSPENDED",
      "Account is inactive or suspended.",
      403,
    );
  }

  req.jwtPayload = {
    userId: payload.userId,
    sessionId: payload.sessionId,
    otpVerified: payload.otpVerified,
    email: payload.email,
    name: payload.name,
    exp: payload.exp || 0,
    isExpired: isAccessTokenExpired,
  };

  req.currentCachedSession = session;

  req.user = {
    name: payload.name,
    email: payload.email,
    otpVerified: payload.otpVerified,
    userId: payload.userId,
  };

  req.sessionId = payload.sessionId;

  return next();
};
