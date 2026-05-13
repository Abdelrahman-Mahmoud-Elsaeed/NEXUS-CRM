import { generateAccessToken, generateRefreshToken } from "@/shared/utils/token.util";
import { Request, Response } from "express";
import { getSessionMeta, setRefreshCookie } from "./session.utils";
import { redis } from "@/shared/config/db/redis";
import crypto from "crypto"

export class SessionService {
  async create(userId: string, meta: any) {
    const sessionId = crypto.randomUUID();

    const accessToken = generateAccessToken({
      userId,
      sessionId,
    });

    const refreshToken = generateRefreshToken({
      userId,
      sessionId,
    });

    await redis.set(
      `refresh_token:${userId}:${sessionId}`,
      JSON.stringify({
        token: refreshToken,
        createdAt: Date.now(),
        meta
      }),
      "EX",
      7 * 24 * 60 * 60,
    );

    return {
      accessToken,
      sessionId,
    };
  }
}
