import crypto from "crypto";
import { redis } from "@config/db/redis";

export const generateResetToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const hashToken = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const storeResetToken = async (
  userId: string,
  token: string,
  ttl = 60 * 15
) => {
  const hashed = hashToken(token);

  await redis.set(
    `password_reset:${hashed}`,
    userId,
    "EX",
    ttl
  );
};

export const consumeResetToken = async (token: string) => {
  const hashed = hashToken(token);

  return await redis.getdel(
    `password_reset:${hashed}`
  );
};