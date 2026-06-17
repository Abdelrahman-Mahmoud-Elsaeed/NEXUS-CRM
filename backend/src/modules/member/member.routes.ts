import { Router } from "express";
import { MemberController } from "./member.controller";
import { validate } from "@/shared/middlewares/validation/validate.middleware";
import { asyncHandler } from "@/shared/utils/asyncHandler.util";

import {  getOrganizationMembersSchema } from "./member.validators";
import { authMiddleware, requireWorkspace } from "@/shared/middlewares";

const router = Router();
const controller = new MemberController();

router.use(authMiddleware);
router.use(requireWorkspace);


router.get(
  "/:id/members",
  validate(getOrganizationMembersSchema),
  asyncHandler(controller.getOrganizationMembers),
);



export default router;
