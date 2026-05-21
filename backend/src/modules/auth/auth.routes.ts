import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validate } from "@/shared/middlewares/validation/validate.middleware";
import { asyncHandler } from "@/shared/utils/asyncHandler.util";
import { authMiddleware } from "@/shared/middlewares/auth/auth.middleware";

import {
  otpRateLimit,
  passwordResetRateLimit,
} from "@/shared/middlewares/security/rateLimit.middleware";

import {
  emailSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "./auth.validators"; 
import { tokenRotationMiddleware } from "@/shared/middlewares";

const router = Router();
const controller = new AuthController();

// ============================================================================
// 1. PUBLIC ENDPOINTS (No Auth Needed)
// ============================================================================

router.post(
  "/register",
  validate(registerSchema),
  asyncHandler(controller.register),
);

router.post(
  "/login", 
  validate(loginSchema), 
  asyncHandler(controller.login)
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

router.get(
  "/verifyPasswordResetToken/:token",
  asyncHandler(controller.verifyPasswordResetToken),
);




// ============================================================================
// 2. PROTECTED ENDPOINTS
// ============================================================================

router.use(authMiddleware);


router.post(
  "/email/verify",
  validate(verifyEmailSchema),
  otpRateLimit,
  asyncHandler(controller.verifyEmail),
);

router.post(
  "/email/otp",
  otpRateLimit,
  asyncHandler(controller.requestEmailOTP),
);

router.get(
  "/verifyAccessToken",
  tokenRotationMiddleware,
  asyncHandler(controller.verifyAccessToken),
);

export default router;