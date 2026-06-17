import { z } from "zod";
import { Role } from "@/shared/generated/client/enums";


const strictUuid = z.string().uuid("Invalid identifier context");
const strictEmail = z
  .string()
  .min(1, "Email is required")
  .trim()
  .email("Please enter a valid email address");


  export const roleEnum = z.nativeEnum(Role, {
  message: "Role must be a valid membership tier",
});


export const getWorkspaceInvitationsSchema = z.object({
  params: z.object({
    id: strictUuid,
  }),
  organizationId: strictUuid,
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

export const getWorkspaceInviteByTokenSchema = z.object({
  params: z.object({
    id: strictUuid,
    token: z.string().min(1, "Invitation token is required"),
  }),
  organizationId: strictUuid,
});


export const acceptInviteSchema = z.object({
  user: z.object({
    userId: strictUuid,
  }),
  body: z.object({
    token: z
      .string()
      .trim()
      .min(1, "Invitation token string is required"),
  }),
});

