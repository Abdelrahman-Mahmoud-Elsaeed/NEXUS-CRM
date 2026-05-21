import { z } from "zod";

const strictUuid = z.string().uuid("Invalid identifier context");

export const createLeadSchema = z.object({
  organizationId: strictUuid,
  body: z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    email: z.string().trim().email("Please enter a valid email address"),
    phone: z.string().trim().optional(),
    company: z.string().trim().optional(),
    website: z.string().trim().url("Invalid website URL format").optional().or(z.literal("")),
    pipelineStageId: strictUuid.optional(),
    source: z.string().trim().default("Manual"),
    notes: z.string().trim().optional(),
    tagIds: z.array(strictUuid).optional(),
  }),
});

export const getLeadsSchema = z.object({
  organizationId: strictUuid,
  query: z.object({
    search: z.string().optional(),
  }),
});