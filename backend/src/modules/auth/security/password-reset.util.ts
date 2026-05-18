import crypto from "crypto";
import { CacheService } from "@/shared/services/cache.service";

export const generateResetToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const hashToken = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const storeResetToken = async (userId: string, token: string, ttl = 60 * 15) => {
  const hashed = hashToken(token);
  await CacheService.set(`password_reset:${hashed}`, userId, ttl);
};

export const consumeResetToken = async (token: string) => {
  const hashed = hashToken(token);
  const userId = await CacheService.getAndDelete<string>(`password_reset:${hashed}`);

  if (userId) {
    await CacheService.deleteByPattern(`refresh_token:${userId}:*`);
  }
  
  return userId;
};