import { z } from "zod";
import {
  isValidEmailInput,
  isValidSocialHandle,
  isValidWebsiteInput,
  isValidWhatsAppInput,
} from "@/shared/utils/urlFieldUtils";

export const createContactFormSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address format"),
  phone: z.string(),
  jobTitle: z.string(),
  companyName: z.string(),
  companyId: z.string(),
  website: z
    .string()
    .refine((val) => isValidWebsiteInput(val), "Invalid website format"),
  pipelineStageId: z.string(),
  source: z.string(),
  initials: z.string().max(3, "Max 3 characters"),
  status: z.enum(["Active", "Inactive", "Prospect"]),
  priority: z.enum(["Low", "Medium", "High"]),
  activeChannels: z.array(
    z.enum([
      "AlternativeEmail",
      "WhatsApp",
      "LinkedIn",
      "Instagram",
      "Twitter",
    ]),
  ),
  alternativeEmailValue: z
    .string()
    .refine((val) => isValidEmailInput(val), "Invalid email address format"),
  whatsappValue: z
    .string()
    .refine((val) => isValidWhatsAppInput(val), "Invalid WhatsApp number"),
  linkedinValue: z
    .string()
    .refine((val) => isValidSocialHandle(val), "Invalid LinkedIn handle"),
  instagramValue: z
    .string()
    .refine((val) => isValidSocialHandle(val), "Invalid Instagram handle"),
  twitterValue: z
    .string()
    .refine((val) => isValidSocialHandle(val), "Invalid Twitter handle"),
  notes: z.string(),
  tagIds: z.array(z.string()),
});
// ============================================================================
// 2. Get Contacts Filter/Query Schema
// ============================================================================
export const contactsQuerySchema = z.object({
  search: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(10),
});

// ============================================================================
// TypeScript Inference Contracts for Hooks & UI Components
// ============================================================================
export type CreateContactFormInput = z.infer<typeof createContactFormSchema>;
export type ContactsQueryInput = z.infer<typeof contactsQuerySchema>;
