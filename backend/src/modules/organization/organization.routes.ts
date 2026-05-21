import { Router } from "express";
import { OrganizationController } from "./organization.controller";
import { authMiddleware } from "@/shared/middlewares/auth/auth.middleware";
import { asyncHandler } from "@/shared/utils/asyncHandler.util";
import { requireWorkspace } from "@/shared/middlewares/multi-tenancy/requireWorkspace.middleware";
import { requireRole } from "@/shared/middlewares/multi-tenancy/requireRole.middleware";
import { validate } from "@/shared/middlewares/validation/validate.middleware";
import { 
  acceptInviteSchema, 
  getOrganizationMembersSchema, 
  getUserOrganizationsSchema, 
  inviteUserSchema, 
  updateOrgNameSchema
} from "./organization.validators";

const router = Router();
const controller = new OrganizationController();

// ============================================================================
// GLOBAL PROTECTED GATEWAY (Applies to ALL organization endpoints)
// ============================================================================
router.use(authMiddleware);

// ============================================================================
// 1. GENERAL WORKSPACE ENDPOINTS
// ============================================================================

router.get(
  "/",
  validate(getUserOrganizationsSchema),
  asyncHandler(controller.getUserOrganizations),
);

router.get(
  "/organizations/:id/members",
  validate(getOrganizationMembersSchema),
  asyncHandler(controller.getOrganizationMembers),
);

// ============================================================================
// 2. INVITATION & TEAM MANAGEMENT ENDPOINTS
// ============================================================================

router.post(
  "/:id/invites",
  validate(inviteUserSchema),
  requireWorkspace,
  requireRole(["OWNER", "ADMIN"]),
  asyncHandler(controller.inviteUser),
);

router.post(
  "/invites/accept",
  validate(acceptInviteSchema),
  asyncHandler(controller.acceptInvite),
);

router.patch(
  "/:id/name",
  validate(updateOrgNameSchema),
  asyncHandler(controller.updateOrganizationName),
);

export default router;