import { Router } from "express";
import { OrganizationController } from "./organization.controller";
import { authMiddleware } from "@/shared/middlewares/auth/auth.middleware";
import { asyncHandler } from "@/shared/utils/asyncHandler.util";
import { validate } from "@/shared/middlewares/validation/validate.middleware";
import {
  getUserOrganizationsSchema,
  updateOrgNameSchema,
} from "./organization.validators";

const router = Router();
const controller = new OrganizationController();

router.use(authMiddleware);

router.get(
  "/",
  validate(getUserOrganizationsSchema),
  asyncHandler(controller.getUserOrganizations),
);

// ============================================================================
// 2. INVITATION & TEAM MANAGEMENT ENDPOINTS
// ============================================================================



router.patch(
  "/:id/name",
  validate(updateOrgNameSchema),
  asyncHandler(controller.updateOrganizationName),
);

export default router;
