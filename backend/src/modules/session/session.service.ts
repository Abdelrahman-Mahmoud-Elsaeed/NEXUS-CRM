import {
  generateAccessToken,
  generateRefreshToken,
} from "@/shared/utils/token.util";
import { CacheService } from "@/shared/services/cache.service";
import crypto from "crypto";
import { UserProfileDto } from "../auth/dto/user-profile.dto";

export interface CachedSession {
  token: string;
  createdAt: number;
  otpVerified: boolean;
  isActive: boolean;
  isDeleted: boolean;
  email: string;
  name: string;
  meta?: any;
}

export class SessionService {
  async create(user: UserProfileDto, meta: any) {
    const sessionId = crypto.randomUUID();
    const userId = user.id;
    const otpVerified = user.isVerified;

    const accessToken = generateAccessToken({
      userId,
      sessionId,
      otpVerified,
      email: user.email,
      name: user.name || "",
    });

    const refreshToken = generateRefreshToken({
      userId,
      sessionId,
      otpVerified,
      email: user.email,
      name: user.name || "",
    });

    const sessionData: CachedSession = {
      token: refreshToken,
      createdAt: Date.now(),
      meta,
      otpVerified,
      isActive: !user.isDisabled,
      email: user.email,
      isDeleted: user.isDeleted ?? false,
      name: user.name || "",
    };
    await CacheService.set(
      `refresh_token:${userId}:${sessionId}`,
      sessionData,
      7 * 24 * 60 * 60,
    );

    return {
      accessToken,
      sessionId,
    };
  }
  // Add this inside your SessionService class
  async rotate(
    user: UserProfileDto,
    currentSessionId: string,
    cachedSession: CachedSession,
    shouldRotateRefresh: boolean,
    newMeta?: any,
  ) {
    const userId = user.id;
    const otpVerified = user.isVerified;

    const targetSessionId = shouldRotateRefresh
      ? crypto.randomUUID()
      : currentSessionId;

    const accessToken = generateAccessToken({
      userId,
      sessionId: targetSessionId,
      otpVerified,
      email: user.email,
      name: user.name || "",
    });

    if (shouldRotateRefresh) {
      const refreshToken = generateRefreshToken({
        userId,
        sessionId: targetSessionId,
        otpVerified,
        email: user.email,
        name: user.name || "",
      });

      const updatedSessionData: CachedSession = {
        ...cachedSession,
        token: refreshToken,
        createdAt: Date.now(),
        meta: newMeta || cachedSession.meta,
      };

      await CacheService.set(
        `refresh_token:${userId}:${targetSessionId}`,
        updatedSessionData,
        7 * 24 * 60 * 60, // 7 days in seconds
      );

      await CacheService.delete(`refresh_token:${userId}:${currentSessionId}`);
    }

    return {
      accessToken,
      sessionId: targetSessionId,
    };
  }
  async verifySessionOtp(userId: string, sessionId: string) {
    const sessionKey = `refresh_token:${userId}:${sessionId}`;

    const session = await CacheService.get<CachedSession>(sessionKey);

    if (!session) {
      throw new Error("Session not found or expired");
    }

    const accessToken = generateAccessToken({
      userId,
      sessionId,
      otpVerified: true,
      email: session.email,
      name: session.name || "",
    });

    const refreshToken = generateRefreshToken({
      userId,
      sessionId,
      otpVerified: true,
      email: session.email,
      name: session.name || "",
    });

    session.otpVerified = true;
    session.token = refreshToken;
    await CacheService.set(sessionKey, session, 7 * 24 * 60 * 60);
    return {
      accessToken,
      sessionId,
    };
  }
}
