export type ContactStatus = "Active" | "Cold" | "Prospect";
export type ChannelType = "mail" | "linkedin" | "whatsapp" | "instagram" | "twitter";

export interface TagDto {
  id: string;
  name: string;
  color?: string;
}

export interface ContactResponseDto {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  jobTitle: string | null;
  company: string | null;
  companyId: string | null;
  status: string;
  source: string;
  createdAt: string;
  tags: TagDto[];
}

export interface GetContactsApiResponse {
  success: boolean;
  data: {
    contacts: ContactResponseDto[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface CreateContactPayload {
  name: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  companyName?: string;
  companyId?: string;
  website?: string;
  pipelineStageId?: string;
  source?: string;
}

/**
 * FIXED: Explicitly define all tracking fields as strict strings.
 * This matches the HTML input behavior and the Zod schema structures perfectly.
 */
export interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  companyName: string;
  companyId: string;
  website: string;
  pipelineStageId: string;
  source: string;
  initials: string;
  status: ContactStatus;
  priority: "LOW" | "MEDIUM" | "HIGH";
  channels: ChannelType[];
  whatsappHandle: string;
  linkedinHandle: string;
  instagramHandle: string;
  twitterHandle: string;
  emailHandle: string;
  notes: string;
  tagIds: string[];
}

export interface FinalSubmissionPayload extends CreateContactPayload {
  status: ContactStatus;
  priority: string;
  channels: ChannelType[];
  initials: string;
  notes: string | null;
  socialHandles: {
    whatsapp: string | null;
    linkedin: string | null;
    instagram: string | null;
    twitter: string | null;
    email: string | null;
  };
}