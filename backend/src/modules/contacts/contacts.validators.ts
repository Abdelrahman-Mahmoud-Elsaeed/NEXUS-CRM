import { z } from "zod";
import { ContactStatus, LeadPriority, ChannelType } from "@prisma/client";

const strictUuid = z.string().uuid("Invalid identifier context");

const channelItemSchema = z.object({
  type: z.nativeEnum(ChannelType),
  value: z.string().trim().min(1, "Channel value cannot be empty"),
});

const paginationQuerySchema = z.object({
  search: z.string().optional(),
  page: z
    .string()
    .regex(/^\d+$/, "Page must be a valid positive integer")
    .optional(),
  limit: z
    .string()
    .regex(/^\d+$/, "Limit must be a valid positive integer")
    .optional(),
});

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
    channels: z.array(channelItemSchema).optional(),
  }),
});

export const getContactsSchema = z.object({
  organizationId: strictUuid,
  query: paginationQuerySchema,
});

export const getAssignedContactsSchema = z.object({
  organizationId: strictUuid,
  params: z.object({
    userId: strictUuid,
  }),
  query: paginationQuerySchema,
});

export const updateContactSchema = z.object({
  organizationId: strictUuid,
  params: z.object({
    id: strictUuid,
  }),
  body: z
    .object({
      name: z.string().trim().min(2, "Name must be at least 2 characters").optional(),
      email: z.string().trim().email("Please enter a valid email address").optional(),
      phone: z.string().trim().nullish(),
      jobTitle: z.string().trim().nullish(),
      website: z
        .string()
        .trim()
        .url("Invalid website URL format")
        .nullable()
        .optional(),
      avatarUrl: z.string().trim().nullish(),
      companyId: strictUuid.nullable().optional(),
      status: z.nativeEnum(ContactStatus).optional(),
      priority: z.nativeEnum(LeadPriority).optional(),
      source: z.string().trim().optional(),
      notes: z.string().trim().nullish(),
      pipelineStageId: strictUuid.nullable().optional(),
      assignedToId: strictUuid.nullable().optional(),
      channels: z.array(channelItemSchema).optional(),
    })
    .strict()
    .refine(
      (body) => Object.values(body).some((value) => value !== undefined),
      {
        message: "At least one contact field must be provided.",
      },
    ),
});


export const getContactSchema = z.object({
  organizationId: strictUuid,
  organizationRole: z.string(),
  user: z.object({
    userId: strictUuid,
  }),
  params: z.object({
    id: strictUuid,
  }),
});
