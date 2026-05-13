import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validate } from "@middlewares/validate.middleware";
import {
  emailSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "./validators/auth.validators";
import { asyncHandler } from "@/shared/utils/asyncHandler.util";
import { authMiddleware } from "@middlewares/auth.middleware";

import {
  otpRateLimit,
  passwordResetRateLimit,
} from "@middlewares/rateLimit.middleware";

const router = Router();
const controller = new AuthController();

router.post(
  "/register",
  validate(registerSchema),
  asyncHandler(controller.register),
);

router.post(
  "/login",
  validate(loginSchema),
  asyncHandler(controller.login),
);

router.post(
  "/password/forgot",
  validate(emailSchema),
  passwordResetRateLimit,
  asyncHandler(controller.requestPasswordReset),
);

router.post(
  "/password/reset",
  validate(resetPasswordSchema),
  passwordResetRateLimit,
  asyncHandler(controller.resetPassword),
);

router.post(
  "/email/verify",
  validate(verifyEmailSchema),
  authMiddleware,
  otpRateLimit,
  asyncHandler(controller.verifyEmail),
);

router.post(
  "/email/otp",
  authMiddleware,
  otpRateLimit,
  asyncHandler(controller.requestEmailOTP),
);

export default router;