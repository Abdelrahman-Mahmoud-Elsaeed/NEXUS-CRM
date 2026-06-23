import { z } from "zod";
import {
  isValidDomainInput,
  isValidEmailInput,
  isValidSocialHandle,
  isValidWhatsAppInput,
} from "@/shared/utils/urlFieldUtils";

export const createCompanyFormSchema = z.object({
  name: z.string().min(2, "Company name is required"),
  domain: z
    .string()
    .refine((val) => isValidDomainInput(val), "Invalid domain format"),
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
  linkedinHandle: z
    .string()
    .refine((val) => isValidSocialHandle(val), "Invalid LinkedIn handle"),
  twitterHandle: z
    .string()
    .refine((val) => isValidSocialHandle(val), "Invalid Twitter handle"),
  notes: z.string(),
  tagIds: z.array(z.string()),
  channels: z.array(z.string()),
  emailHandle: z
    .string()
    .refine((val) => isValidEmailInput(val), "Invalid email address format"),
  whatsappHandle: z
    .string()
    .refine((val) => isValidWhatsAppInput(val), "Invalid WhatsApp number"),
  instagramHandle: z
    .string()
    .refine((val) => isValidSocialHandle(val), "Invalid Instagram handle"),
});

export const companiesQuerySchema = z.object({
  search: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(10),
});

export type CreateCompanyFormInput = z.infer<typeof createCompanyFormSchema>;
export type CompaniesQueryInput = z.infer<typeof companiesQuerySchema>;
