// src/shared/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError, JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";
import { CacheService } from "@/shared/services/cache.service";
import { CachedSession } from "@/modules/session/session.service";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, reason: "UNAUTHORIZED" });
    }

    const token = authHeader.split(" ")[1];
    let payload: JwtPayload;
    let isAccessTokenExpired = false;
    try {
      payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (verifyErr) {
      if (verifyErr instanceof TokenExpiredError) {
        payload = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true }) as JwtPayload;
        isAccessTokenExpired = true; 
        
      } else {
        return res.status(401).json({ success: false, reason: "INVALID_TOKEN" });
      }
    }
    
    if (!payload || !payload.sessionId || !payload.userId) {
      return res.status(401).json({ success: false, reason: "INVALID_TOKEN" });
    }

    const currentSessionId = req.cookies["sid"];
    if (!currentSessionId || currentSessionId !== payload.sessionId) {
      return res.status(401).json({ success: false, reason: "SESSION_EXPIRED_OR_REVOKED" });
    }

    const oldSessionKey = `refresh_token:${payload.userId}:${currentSessionId}`;
    const session = await CacheService.get<CachedSession>(oldSessionKey);

    if (!session) {
      return res.status(401).json({ success: false, reason: "SESSION_EXPIRED_OR_REVOKED" });
    }
    if (session.isDeleted) {
      return res.status(403).json({ success: false, reason: "ACCOUNT_HAS_BEEN_DELETED" });
    }
    if (!session.isActive) {
      return res.status(403).json({ success: false, reason: "ACCOUNT_IS_INACTIVE_OR_SUSPENDED" });
    }
    console.log("run")
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

    return next();
  } catch (err) {
    return res.status(401).json({ success: false, reason: "INVALID_TOKEN" });
  }
};