import { z } from "zod";

const strictUuid = z.string().uuid("Invalid identifier context");

export const createTagSchema = z.object({
  organizationId: strictUuid,
  body: z.object({
    name: z.string().trim().min(1, "Tag name is required").max(30, "Tag name is too long"),
    colorHex: z
      .string()
      .trim()
      .regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid 6-character hex code (e.g., #FF0000)"),
  }),
});

export const getTagsSchema = z.object({
  organizationId: strictUuid,
});