import { z } from "zod";


const strictEmail = z
  .string()
  .min(1, "Email is required")
  .trim()
  .normalize()
  .email("Please enter a valid email address");

const strictPassword = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(100, "Password is too long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[@$!%*?&#]/, "Password must contain at least one special character (@$!%*?&#)");

const strictName = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name cannot exceed 50 characters")
  .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Name can only contain letters, spaces, hyphens, or apostrophes");



export const registerSchema = z.object({
  email: strictEmail,
  password: strictPassword,
  name: strictName.optional(),
});

export const loginSchema = z.object({
  email: strictEmail,
  password: z.string().min(1, "Password is required"),
});

export const verifyEmailSchema = z.object({
  OTP: z
    .string()
    .length(6, "Verification code must be exactly 6 digits")
    .regex(/^[0-9]+$/, "Verification code must contain numbers only"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  newPassword: strictPassword,
});

export const emailSchema = z.object({
  email: strictEmail,
});