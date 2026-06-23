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
    industry: z.string().trim().optional().nullable().or(z.literal("")),
    phone: z.string().trim().optional().nullable().or(z.literal("")),
    status: z.string().trim().optional().nullable().or(z.literal("")),
    employeeCount: z.number().int().optional().nullable(),
    annualRevenue: z.number().int().optional().nullable(),
    address: z.string().trim().optional().nullable().or(z.literal("")),
    source: z.string().trim().optional().nullable().or(z.literal("")),
    notes: z.string().trim().optional().nullable().or(z.literal("")),
    linkedin: z.string().trim().optional().nullable().or(z.literal("")),
    twitter: z.string().trim().optional().nullable().or(z.literal("")),
    instagram: z.string().trim().optional().nullable().or(z.literal("")),
    whatsapp: z.string().trim().optional().nullable().or(z.literal("")),
    email: z.string().trim().optional().nullable().or(z.literal("")),
  }),
});

export const updateCompanySchema = z.object({
  organizationId: strictUuid,
  params: z.object({
    id: strictUuid,
  }),
  body: z
    .object({
      name: z.string().trim().min(2, "Company name must be at least 2 characters").optional(),
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
      industry: z.string().trim().optional().nullable().or(z.literal("")),
      phone: z.string().trim().optional().nullable().or(z.literal("")),
      status: z.string().trim().optional().nullable().or(z.literal("")),
      employeeCount: z.number().int().optional().nullable(),
      annualRevenue: z.number().int().optional().nullable(),
      address: z.string().trim().optional().nullable().or(z.literal("")),
      source: z.string().trim().optional().nullable().or(z.literal("")),
      notes: z.string().trim().optional().nullable().or(z.literal("")),
      linkedin: z.string().trim().optional().nullable().or(z.literal("")),
      twitter: z.string().trim().optional().nullable().or(z.literal("")),
      instagram: z.string().trim().optional().nullable().or(z.literal("")),
      whatsapp: z.string().trim().optional().nullable().or(z.literal("")),
      email: z.string().trim().optional().nullable().or(z.literal("")),
    })
    .strict()
    .refine(
      (body) => Object.values(body).some((value) => value !== undefined),
      {
        message: "At least one company field must be provided.",
      },
    ),
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


export const getCompanySchema = z.object({
  organizationId: strictUuid,
  params: z.object({
    id: strictUuid,
  }),
});
