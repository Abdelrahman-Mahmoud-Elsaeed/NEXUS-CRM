import rateLimit from "express-rate-limit";
import { Request } from "express";

const getEmailFromReq = (req: Request) => {
  if (req.user?.email) return req.user.email;
  if (req.body?.email) return req.body.email;
  return "unknown";
};

const getIP = (req: Request) =>
  (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
  req.socket.remoteAddress ||
  "unknown";

const keyGenerator = (req: Request) => {
  return `${getIP(req)}:${getEmailFromReq(req)}`;
};

const rateLimitResponse = {
  success: false,
  statusCode: 429,
  reason: "TOO_MANY_REQUESTS",
  msg: "Too many requests. Please try again later.",
};

export const passwordResetRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  keyGenerator,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return res.status(429).json(rateLimitResponse);
  },
});

export const otpRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  keyGenerator,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return res.status(429).json(rateLimitResponse);
  },
});