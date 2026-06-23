import { Router } from "express";
import { DealController } from "./deals.controller";
import { asyncHandler } from "@/shared/utils/asyncHandler.util";
import { authMiddleware, requireRole, requireWorkspace, validate } from "@/shared/middlewares";
import {
  createDealSchema,
  deleteDealSchema,
  getDealSchema,
  getDealsSchema,
  moveDealStageSchema,
  updateDealSchema,
} from "./deals.validators";

const router = Router();
const dealController = new DealController();

router.get(
  "/",
  authMiddleware,
  requireWorkspace,
  validate(getDealsSchema),
  asyncHandler(dealController.getDeals),
);

router.get(
  "/:id",
  authMiddleware,
  requireWorkspace,
  validate(getDealSchema),
  asyncHandler(dealController.getDeal),
);

router.post(
  "/",
  authMiddleware,
  requireWorkspace,
  validate(createDealSchema),
  asyncHandler(dealController.createDeal),
);

router.patch(
  "/:id",
  authMiddleware,
  requireWorkspace,
  validate(updateDealSchema),
  asyncHandler(dealController.updateDeal),
);

router.patch(
  "/:id/stage",
  authMiddleware,
  requireWorkspace,
  validate(moveDealStageSchema),
  asyncHandler(dealController.moveDealStage),
);

router.delete(
  "/:id",
  authMiddleware,
  requireWorkspace,
  requireRole(["Owner", "Admin"]),
  validate(deleteDealSchema),
  asyncHandler(dealController.deleteDeal),
);

export default router;
