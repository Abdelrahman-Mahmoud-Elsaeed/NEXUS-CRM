import { Router } from "express";
import { PipelineController } from "./pipelines.controller";
import { asyncHandler } from "@/shared/utils/asyncHandler.util";
import { authMiddleware, requireRole, requireWorkspace, validate } from "@/shared/middlewares";
import {
  createPipelineSchema,
  createPipelineStageSchema,
  deletePipelineSchema,
  deletePipelineStageSchema,
  getPipelineSchema,
  getPipelinesSchema,
  reorderPipelineStagesSchema,
  updatePipelineSchema,
  updatePipelineStageSchema,
} from "./pipelines.validators";

const router = Router();
const pipelineController = new PipelineController();

router.get(
  "/",
  authMiddleware,
  requireWorkspace,
  validate(getPipelinesSchema),
  asyncHandler(pipelineController.getPipelines),
);

router.get(
  "/:id",
  authMiddleware,
  requireWorkspace,
  validate(getPipelineSchema),
  asyncHandler(pipelineController.getPipeline),
);

router.post(
  "/",
  authMiddleware,
  requireWorkspace,
  requireRole(["Owner", "Admin"]),
  validate(createPipelineSchema),
  asyncHandler(pipelineController.createPipeline),
);

router.patch(
  "/:id",
  authMiddleware,
  requireWorkspace,
  requireRole(["Owner", "Admin"]),
  validate(updatePipelineSchema),
  asyncHandler(pipelineController.updatePipeline),
);

router.delete(
  "/:id",
  authMiddleware,
  requireWorkspace,
  requireRole(["Owner", "Admin"]),
  validate(deletePipelineSchema),
  asyncHandler(pipelineController.deletePipeline),
);

router.post(
  "/:pipelineId/stages",
  authMiddleware,
  requireWorkspace,
  requireRole(["Owner", "Admin"]),
  validate(createPipelineStageSchema),
  asyncHandler(pipelineController.createPipelineStage),
);

router.patch(
  "/:pipelineId/stages/reorder",
  authMiddleware,
  requireWorkspace,
  requireRole(["Owner", "Admin"]),
  validate(reorderPipelineStagesSchema),
  asyncHandler(pipelineController.reorderPipelineStages),
);

router.patch(
  "/:pipelineId/stages/:stageId",
  authMiddleware,
  requireWorkspace,
  requireRole(["Owner", "Admin"]),
  validate(updatePipelineStageSchema),
  asyncHandler(pipelineController.updatePipelineStage),
);

router.delete(
  "/:pipelineId/stages/:stageId",
  authMiddleware,
  requireWorkspace,
  requireRole(["Owner", "Admin"]),
  validate(deletePipelineStageSchema),
  asyncHandler(pipelineController.deletePipelineStage),
);

export default router;
