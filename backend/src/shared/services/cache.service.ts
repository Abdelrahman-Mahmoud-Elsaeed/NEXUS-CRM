import { redis } from "@config/db/redis";

export class CacheService {

  static async set(key: string, value: string | object, ttlSeconds?: number): Promise<void> {
    const stringValue = typeof value === "object" ? JSON.stringify(value) : String(value);
    if (ttlSeconds) {
      await redis.set(key, stringValue, "EX", ttlSeconds);
    } else {
      await redis.set(key, stringValue);
    }
  }
  static async get<T = string>(key: string): Promise<T | null> {
    const value = await redis.get(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  }
  static async delete(key: string): Promise<void> {
    await redis.del(key);
  }

  static async getAndDelete<T = string>(key: string): Promise<T | null> {
    const value = await redis.getdel(key);
    if (!value) return null;

    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  }
  static async deleteByPattern(pattern: string): Promise<void> {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(keys);
    }
  }
}