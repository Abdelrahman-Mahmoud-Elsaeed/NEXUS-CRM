import { z } from "zod";


export const createContactFormSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address format"),
  phone: z.string(),
  jobTitle: z.string(),
  companyName: z.string(),
  companyId: z.string(),
  website: z.string(),
  pipelineStageId: z.string(),
  source: z.string(),
  initials: z.string().max(3, "Max 3 characters"),
  status: z.enum(["Active", "Cold", "Prospect"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  channels: z.array(z.enum(["mail", "linkedin", "whatsapp", "instagram", "twitter"])),
  whatsappHandle: z.string(),
  linkedinHandle: z.string(),
  instagramHandle: z.string(),
  twitterHandle: z.string(),
  emailHandle: z.string(),
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