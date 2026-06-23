import { authMiddleware, requireRole, requireWorkspace } from "@/shared/middlewares";
import { Router } from "express";
import { validate } from "@/shared/middlewares/validation/validate.middleware";
import { acceptInviteSchema, getWorkspaceInvitationsSchema, getWorkspaceInviteByTokenSchema, inviteUserSchema } from "./invitation.validators";
import { asyncHandler } from "@/shared/utils/asyncHandler.util";
import { InvitationController } from "./invitation.controller";

const router = Router();


const controller = new InvitationController();


router.get(
  "/invites/details/:token",
  asyncHandler(controller.getInvitationDetailsByToken),
);


router.use(authMiddleware);

router.get(
  "/:id/invites",
  requireWorkspace,
  validate(getWorkspaceInvitationsSchema), 
  asyncHandler(controller.getWorkspaceInvitations)
);



router.post(
  "/:id/invites",
  requireWorkspace,
  validate(inviteUserSchema),
  requireRole(["Owner", "Admin"]),
  asyncHandler(controller.inviteUser),
);

router.get(
  "/:id/invites/:token",
  requireWorkspace,
  validate(getWorkspaceInviteByTokenSchema),
  asyncHandler(controller.getWorkspaceInviteByToken)
);


router.post(
  "/accept",
  validate(acceptInviteSchema),
  asyncHandler(controller.acceptInvite),
);

export default router