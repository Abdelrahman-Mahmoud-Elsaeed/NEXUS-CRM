import { z } from "zod";

const strictUuid = z.string().uuid("Invalid identifier context");

const stageInputSchema = z.object({
  name: z.string().trim().min(1, "Stage name is required"),
  order: z.number().int().min(0).optional(),
});

export const getPipelinesSchema = z.object({
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

export const getPipelineSchema = z.object({
  organizationId: strictUuid,
  params: z.object({
    id: strictUuid,
  }),
});

export const createPipelineSchema = z.object({
  organizationId: strictUuid,
  body: z.object({
    name: z.string().trim().min(2, "Pipeline name must be at least 2 characters"),
    stages: z.array(stageInputSchema).optional(),
  }),
});

export const updatePipelineSchema = z.object({
  organizationId: strictUuid,
  params: z.object({
    id: strictUuid,
  }),
  body: z
    .object({
      name: z.string().trim().min(2, "Pipeline name must be at least 2 characters").optional(),
    })
    .strict()
    .refine((body) => Object.values(body).some((value) => value !== undefined), {
      message: "At least one pipeline field must be provided.",
    }),
});

export const deletePipelineSchema = z.object({
  organizationId: strictUuid,
  params: z.object({
    id: strictUuid,
  }),
});

export const createPipelineStageSchema = z.object({
  organizationId: strictUuid,
  params: z.object({
    pipelineId: strictUuid,
  }),
  body: z.object({
    name: z.string().trim().min(1, "Stage name is required"),
    order: z.number().int().min(0).optional(),
  }),
});

export const updatePipelineStageSchema = z.object({
  organizationId: strictUuid,
  params: z.object({
    pipelineId: strictUuid,
    stageId: strictUuid,
  }),
  body: z
    .object({
      name: z.string().trim().min(1, "Stage name is required").optional(),
      order: z.number().int().min(0).optional(),
    })
    .strict()
    .refine((body) => Object.values(body).some((value) => value !== undefined), {
      message: "At least one stage field must be provided.",
    }),
});

export const deletePipelineStageSchema = z.object({
  organizationId: strictUuid,
  params: z.object({
    pipelineId: strictUuid,
    stageId: strictUuid,
  }),
});

export const reorderPipelineStagesSchema = z.object({
  organizationId: strictUuid,
  params: z.object({
    pipelineId: strictUuid,
  }),
  body: z.object({
    stages: z
      .array(
        z.object({
          id: strictUuid,
          order: z.number().int().min(0),
        }),
      )
      .min(1, "At least one stage must be provided for reordering"),
  }),
});
