import rateLimit from "express-rate-limit";
import { Request } from "express";

const getEmailFromReq = (req: Request) => {
  if (req.user?.email) return req.user.email;

  if (req.body?.email) return req.body.email;

  return "unknown";
};

const getIP = (req: Request) =>
  req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
  req.socket.remoteAddress ||
  "unknown";

const keyGenerator = (req: Request) => {
  return `${getIP(req)}:${getEmailFromReq(req)}`;
};

export const passwordResetRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  keyGenerator,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    reason: "TOO_MANY_REQUESTS",
  },
});

export const otpRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  keyGenerator,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    reason: "TOO_MANY_REQUESTS",
  },
});
