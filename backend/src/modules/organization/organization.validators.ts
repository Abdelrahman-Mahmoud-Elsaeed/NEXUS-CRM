import { Role } from "@/shared/generated/client/enums";
import { z } from "zod";

// --- Reusable Core System Primitives ---

const strictEmail = z
  .string()
  .min(1, "Email is required")
  .trim()
  .email("Please enter a valid email address");

const strictUuid = z.string().uuid("Invalid identifier context");

export const roleEnum = z.nativeEnum(Role, {
  message: "Role must be a valid membership tier",
});

export const getUserOrganizationsSchema = z.object({
  user: z.object({
    userId: strictUuid,
  }),
});

export const inviteUserSchema = z.object({
  params: z.object({
    id: strictUuid,
  }),
  organizationId: strictUuid,
  body: z.object({
    email: strictEmail,
    role: roleEnum,
  }),
});

export const getWorkspaceInvitationsSchema = z.object({
  params: z.object({
    id: strictUuid,
  }),
  organizationId: strictUuid,
});

export const switchOrganizationSchema = z.object({
  body: z.object({
    organizationId: z.string().uuid("Invalid organization identifier"),
  }),
});

export const updateOrgNameSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid organization identifier context"),
  }),
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Organization name must be at least 2 characters")
      .max(100, "Organization name cannot exceed 100 characters"),
  }),
});

export type UpdateOrgNameDto = z.infer<typeof updateOrgNameSchema>;

export type InviteUserDto = z.infer<typeof inviteUserSchema>;
