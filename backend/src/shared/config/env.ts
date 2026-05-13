import "dotenv/config";

function getEnv(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export const NODE_ENV = process.env.NODE_ENV || "development";

export const PORT = Number(getEnv("PORT") || 3000);

export const DATABASE_URL = getEnv("DATABASE_URL");

export const REDIS_URL = getEnv("REDIS_URL");

export const RESEND_API_KEY = getEnv("RESEND_API_KEY");

export const CLIENT_URL = getEnv("CLIENT_URL");

export const JWT_SECRET = getEnv("JWT_SECRET");

export const JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET");
