import { Router } from "express";
import { LeadController } from "./leads.controller";
import { createLeadSchema, getLeadsSchema } from "./leads.validators";
import { asyncHandler } from "@/shared/utils/asyncHandler.util";
import {
  validate,
} from "@/shared/middlewares";

const router = Router();
const leadController = new LeadController();


router.get(
  "/leads",
  validate(getLeadsSchema),
  asyncHandler(leadController.getLeads),
);
router.post(
  "/leads",
  validate(createLeadSchema),
  asyncHandler(leadController.createLead),
);

export default router;
