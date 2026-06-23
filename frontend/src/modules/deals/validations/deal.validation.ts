import { z } from "zod";

export const createDealFormSchema = z.object({
  name: z.string().min(2, "Deal name is required"),
  value: z.string().optional(),
  currency: z.string().optional().default("USD"),
  status: z.enum(["Open", "Won", "Lost"]).optional().default("Open"),
  expectedCloseDate: z.string().optional(),
  notes: z.string().optional(),
  companyId: z.string().optional(),
  primaryContactId: z.string().optional(),
  pipelineId: z.string().optional(),
  stageId: z.string().optional(),
  assignedToId: z.string().optional(),
});

export const updateDealFormSchema = z.object({
  name: z.string().min(2, "Deal name is required").optional(),
  value: z.string().optional(),
  currency: z.string().optional(),
  status: z.enum(["Open", "Won", "Lost"]).optional(),
  expectedCloseDate: z.string().optional(),
  actualCloseDate: z.string().optional(),
  notes: z.string().optional(),
  companyId: z.string().optional(),
  primaryContactId: z.string().optional(),
  pipelineId: z.string().optional(),
  stageId: z.string().optional(),
  assignedToId: z.string().optional(),
});

export const moveDealStageSchema = z.object({
  stageId: z.string().min(1, "Stage ID is required"),
  pipelineId: z.string().optional(),
});

export const dealsQuerySchema = z.object({
  search: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(10),
  pipelineId: z.string().optional(),
  stageId: z.string().optional(),
});

export type CreateDealFormInput = z.infer<typeof createDealFormSchema>;
export type UpdateDealFormInput = z.infer<typeof updateDealFormSchema>;
export type MoveDealStageInput = z.infer<typeof moveDealStageSchema>;
export type DealsQueryInput = z.infer<typeof dealsQuerySchema>;
