import { z } from "zod";

// ============================================================================
// 1. Accept Invitation Schema
// ============================================================================

export const acceptInvitationSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter at least 2 characters.")
    .max(50, "Name cannot exceed 50 characters.")
    .regex(
      /^[a-zA-ZÀ-ÿ\s'-]+$/, 
      "Names can only contain letters, spaces, hyphens, or apostrophes."
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter (A-Z).")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter (a-z).")
    .regex(/[0-9]/, "Password must contain at least one numeric digit (0-9).")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special symbol (@, $, !, etc.)."),
});
// ============================================================================
// 2. Invitation & Member Forms Schema
// ============================================================================
export const invitationFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  role: z.enum(["Member", "Admin"]),
});

export const memberInviteFormSchema = invitationFormSchema; // Reusable structural match

// ============================================================================
// 3. Roles Context Schema
// ============================================================================
export const roleUpdateSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1, "Role name is required"),
  description: z.string().trim().min(1, "Role description is required"),
});