import { Role } from "@/shared/generated/client/enums";
import { z } from "zod";


const strictEmail = z
  .string()
  .min(1, "Email is required")
  .trim()
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

const strictUuid = z
  .string()
  .uuid("Invalid identifier context");

export const roleEnum = z.nativeEnum(Role, {
  message: "Role must be a valid membership tier",
});


export const registerSchema = z.object({
  body: z.object({
    email: strictEmail,
    password: strictPassword,
    name: strictName.optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: strictEmail,
    password: z.string().min(1, "Password is required"),
  }),
});

export const verifyEmailSchema = z.object({
  body: z.object({
    OTP: z
      .string()
      .length(6, "Verification code must be exactly 6 digits")
      .regex(/^[0-9]+$/, "Verification code must contain numbers only"),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, "Token is required"),
    newPassword: strictPassword,
  }),
});

export const emailSchema = z.object({
  body: z.object({
    email: strictEmail,
  }),
});



export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type VerifyEmailDto = z.infer<typeof verifyEmailSchema>;
export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
export type EmailDto = z.infer<typeof emailSchema>;

