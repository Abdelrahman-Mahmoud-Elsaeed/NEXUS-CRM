import { z } from "zod";
import { DealStatus } from "@prisma/client";

const strictUuid = z.string().uuid("Invalid identifier context");
const dealStatusSchema = z.nativeEnum(DealStatus);

const optionalNullableUuid = strictUuid.nullable().optional();
const optionalNullableDate = z
  .string()
  .datetime({ message: "Invalid date format" })
  .nullable()
  .optional()
  .or(z.literal(""));

export const getDealsSchema = z.object({
  organizationId: strictUuid,
  query: z.object({
    search: z.string().optional(),
    status: dealStatusSchema.optional(),
    pipelineId: strictUuid.optional(),
    stageId: strictUuid.optional(),
    companyId: strictUuid.optional(),
    assignedToId: strictUuid.optional(),
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

export const getDealSchema = z.object({
  organizationId: strictUuid,
  params: z.object({
    id: strictUuid,
  }),
});

export const createDealSchema = z.object({
  organizationId: strictUuid,
  body: z.object({
    name: z.string().trim().min(2, "Deal name must be at least 2 characters"),
    value: z.number().nonnegative().nullable().optional(),
    currency: z.string().trim().length(3).optional(),
    status: dealStatusSchema.optional(),
    expectedCloseDate: optionalNullableDate,
    notes: z.string().trim().nullable().optional().or(z.literal("")),
    companyId: optionalNullableUuid,
    primaryContactId: optionalNullableUuid,
    pipelineId: optionalNullableUuid,
    stageId: optionalNullableUuid,
    assignedToId: optionalNullableUuid,
  }),
});

export const updateDealSchema = z.object({
  organizationId: strictUuid,
  params: z.object({
    id: strictUuid,
  }),
  body: z
    .object({
      name: z.string().trim().min(2, "Deal name must be at least 2 characters").optional(),
      value: z.number().nonnegative().nullable().optional(),
      currency: z.string().trim().length(3).optional(),
      status: dealStatusSchema.optional(),
      expectedCloseDate: optionalNullableDate,
      actualCloseDate: optionalNullableDate,
      notes: z.string().trim().nullable().optional().or(z.literal("")),
      companyId: optionalNullableUuid,
      primaryContactId: optionalNullableUuid,
      pipelineId: optionalNullableUuid,
      stageId: optionalNullableUuid,
      assignedToId: optionalNullableUuid,
    })
    .strict()
    .refine((body) => Object.values(body).some((value) => value !== undefined), {
      message: "At least one deal field must be provided.",
    }),
});

export const moveDealStageSchema = z.object({
  organizationId: strictUuid,
  params: z.object({
    id: strictUuid,
  }),
  body: z.object({
    stageId: strictUuid,
    pipelineId: strictUuid.optional(),
  }),
});

export const deleteDealSchema = z.object({
  organizationId: strictUuid,
  params: z.object({
    id: strictUuid,
  }),
});
