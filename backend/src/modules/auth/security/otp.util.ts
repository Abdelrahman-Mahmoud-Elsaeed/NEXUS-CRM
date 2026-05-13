import crypto from "crypto";
import { redis } from "@config/db/redis";

export const generateOtp = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

export const hashOtp = (otp: string) => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};

export const storeOtp = async (
  key: string,
  otp: string,
  ttl = 300
) => {
  const hashed = hashOtp(otp);

  await redis.set(key, hashed, "EX", ttl);
};

export const verifyOtp = async (
  key: string,
  otp: string
) => {
  const stored = await redis.get(key);

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
  await redis.del(key);
};