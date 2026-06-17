import { z } from "zod";

const strictUuid = z.string().uuid("Invalid identifier context");

export const createCompanySchema = z.object({
  organizationId: strictUuid,
  body: z.object({
    name: z.string().trim().min(2, "Company name must be at least 2 characters"),
    domain: z
      .string()
      .trim()
      .toLowerCase()
      .optional()
      .nullable()
      .or(z.literal("")),
    logoUrl: z
      .string()
      .trim()
      .url("Invalid logo URL format")
      .optional()
      .nullable()
      .or(z.literal("")),
  }),
});

export const getCompaniesSchema = z.object({
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