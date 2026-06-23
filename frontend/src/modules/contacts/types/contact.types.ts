// src/modules/contacts/types/contact.types.ts

// ==========================================
// Base API Response Wrapper (Matching Auth)
// ==========================================
export type ApiResponse<T, E extends string = string> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      reason: E;
      msg: string;
    };

// ==========================================
// Enums & Constants
// ==========================================
export const ContactStatus = {
  Active: "Active",
  Inactive: "Inactive",
  Prospect: "Prospect",
} as const;

export type ContactStatus = (typeof ContactStatus)[keyof typeof ContactStatus];

export const ChannelType = {
  Email: "Email",
  AlternativeEmail: "AlternativeEmail",
  Phone: "Phone",
  WhatsApp: "WhatsApp",
  LinkedIn: "LinkedIn",
  Instagram: "Instagram",
  Twitter: "Twitter",
} as const;

export type ChannelType = (typeof ChannelType)[keyof typeof ChannelType];

// ==========================================
// Shared DTOs
// ==========================================
export interface ContactChannelDto {
  id?: string;
  type: ChannelType;
  value: string;
}

export interface TagDto {
  id: string;
  name: string;
  color?: string;
}

export interface ContactData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  jobTitle: string | null;
  company: string | null;
  companyId: string | null;
  status: string;
  priority?: string;
  source: string;
  createdAt: string;
  tags: TagDto[];
  notes?: string | null;
  channels: ContactChannelDto[];
  avatarUrl?: string | null;
  website?: string | null;
  deals?: {
    id: string;
    name: string;
    value: string | null;
    status: string;
    expectedCloseDate: string | null;
    stage: string | null;
  }[];
  tasks?: {
    id: string;
    title: string;
    status: string;
    priority: string;
    createdAt: string;
  }[];
}

// ==========================================
// API Endpoint Response DTOs
// ==========================================
export type GetContactsApiResponse = ApiResponse<{
  contacts: ContactData[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}>;

export type ContactResponseDto = ApiResponse<ContactData>;

export type UploadAvatarResponse = ApiResponse<{
  avatarUrl: string;
}>;

// ==========================================
// Payload DTOs
// ==========================================
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
  channels?: ContactChannelDto[];
  notes?: string | null;
}

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
  priority: "Low" | "Medium" | "High";
  activeChannels: ChannelType[];
  alternativeEmailValue: string;
  whatsappValue: string;
  linkedinValue: string;
  instagramValue: string;
  twitterValue: string;
  notes: string;
  tagIds: string[];
}

export interface FinalSubmissionPayload extends CreateContactPayload {
  status: ContactStatus;
  priority: string;
  initials: string;
  notes: string | null;
}
