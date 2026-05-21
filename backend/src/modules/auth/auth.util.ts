import crypto from "crypto";
import { CacheService } from "@/shared/services/cache.service";
import jwt from "jsonwebtoken";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../../shared/config/env";

export const generateResetToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const hashToken = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const storeResetToken = async (
  userId: string,
  token: string,
  ttl = 60 * 15,
) => {
  const hashed = hashToken(token);
  await CacheService.set(`password_reset:${hashed}`, userId, ttl);
};

export const consumeResetToken = async (token: string) => {
  const hashed = hashToken(token);
  const userId = await CacheService.getAndDelete<string>(
    `password_reset:${hashed}`,
  );

  if (userId) {
    await CacheService.deleteByPattern(`refresh_token:${userId}:*`);
  }

  return userId;
};

export const generateOtp = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

export const hashOtp = (otp: string) => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};

export const storeOtp = async (key: string, otp: string, ttl = 300) => {
  const hashed = hashOtp(otp);
  await CacheService.set(key, hashed, ttl);
};

export const verifyOtp = async (key: string, otp: string) => {
  const stored = await CacheService.get<string>(key);

  if (!stored) {
    return { success: false, reason: "OTP_EXPIRED" };
  }

  const hashed = hashOtp(otp);

  if (stored !== hashed) {
    return { success: false, reason: "INVALID_OTP" };
  }

  return { success: true };
};

export const deleteOtp = async (key: string) => {
  await CacheService.delete(key);
};

export type JwtPayload = {
  userId: string;
  sessionId: string;
  otpVerified: boolean;
  email: string;
  name: string;
};

export const generateAccessToken = (payload: JwtPayload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (payload: JwtPayload) => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload;
};
