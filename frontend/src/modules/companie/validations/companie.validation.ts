import { z } from "zod";

export const createCompanyFormSchema = z.object({
  name: z.string().min(2, "Company name is required"),
  domain: z.string().url("Invalid domain link format").or(z.string().max(0)), // Optional but must be a URL if typed
  industry: z.string(),
  phone: z.string(),
  status: z.enum(["Active", "Inactive", "Lead", "Customer"]),
  employeeCount: z.string().refine((val) => val === "" || !isNaN(Number(val)), {
    message: "Employee count must be a number",
  }),
  annualRevenue: z.string().refine((val) => val === "" || !isNaN(Number(val)), {
    message: "Annual revenue must be a number",
  }),
  address: z.string(),
  source: z.string(),
  linkedinHandle: z.string(),
  twitterHandle: z.string(),
  notes: z.string(),
  tagIds: z.array(z.string()),
});

export const companiesQuerySchema = z.object({
  search: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(10),
});

export type CreateCompanyFormInput = z.infer<typeof createCompanyFormSchema>;
export type CompaniesQueryInput = z.infer<typeof companiesQuerySchema>;