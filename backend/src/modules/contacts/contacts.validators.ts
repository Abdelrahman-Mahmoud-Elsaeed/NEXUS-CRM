import { z } from "zod";

const strictUuid = z.string().uuid("Invalid identifier context");

export const createContactSchema = z.object({
  organizationId: strictUuid,
  body: z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    email: z.string().trim().email("Please enter a valid email address"),
    phone: z.string().trim().nullish(),
    avatarUrl: z.string().trim().nullish(),
    jobTitle: z.string().trim().nullish(),
    companyName: z.string().trim().nullish(),
    companyId: strictUuid.optional(),
    website: z
      .string()
      .trim()
      .url("Invalid website URL format")
      .optional()
      .or(z.literal("")),
    pipelineStageId: strictUuid.optional(),
    source: z.string().trim().default("Manual"),
    notes: z.string().trim().nullish(),
    tagIds: z.array(strictUuid).optional(),
  }),
});

export const getContactsSchema = z.object({
  organizationId: strictUuid,
  query: z.object({
    search: z.string().optional(),
    page: z
      .string()
      .regex(/^\d+$/, "Page must be a valid positive integer")
      .optional(),
    limit: z
      .string()
      .regex(/^\d+$/, "Limit must be a valid positive integer")
      .optional(),
  }),
});
