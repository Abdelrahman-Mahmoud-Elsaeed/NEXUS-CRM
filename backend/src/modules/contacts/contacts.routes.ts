import { Router } from "express";
import { ContactController } from "./contacts.controller";
import { asyncHandler } from "@/shared/utils/asyncHandler.util";
import { authMiddleware, requireWorkspace, validate } from "@/shared/middlewares";
import { createContactSchema, getContactsSchema } from "./contacts.validators";

const router = Router();
const contactController = new ContactController();

router.get(
  "/",
  authMiddleware,
  requireWorkspace,
  validate(getContactsSchema),
  asyncHandler(contactController.getContacts),
);

router.post(
  "/",
  authMiddleware,
  requireWorkspace,
  validate(createContactSchema),
  asyncHandler(contactController.createContact),
);

export default router;