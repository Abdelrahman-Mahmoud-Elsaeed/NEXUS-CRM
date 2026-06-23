import { Router } from "express";
import { ContactController } from "./contacts.controller";
import { asyncHandler } from "@/shared/utils/asyncHandler.util";
import { authMiddleware, requireRole, requireWorkspace, validate } from "@/shared/middlewares";
import {
  createContactSchema,
  getAssignedContactsSchema,
  getContactsSchema,
  getContactSchema,
  updateContactSchema,
} from "./contacts.validators";

const router = Router();
const contactController = new ContactController();

router.get(
  "/",
  authMiddleware,
  requireWorkspace,
  requireRole(["Owner","Admin"]),
  validate(getContactsSchema),
  asyncHandler(contactController.getContacts),
);

router.get(
  "/assigned/:userId",
  authMiddleware,
  requireWorkspace,
  validate(getAssignedContactsSchema),
  asyncHandler(contactController.getAssignedContacts),
);

router.get(
  "/:id",
  authMiddleware,
  requireWorkspace,
  validate(getContactSchema),
  asyncHandler(contactController.getContact),
);

router.post(
  "/",
  authMiddleware,
  requireWorkspace,
  validate(createContactSchema),
  asyncHandler(contactController.createContact),
);

router.patch(
  "/:id",
  authMiddleware,
  requireWorkspace,
  validate(updateContactSchema),
  asyncHandler(contactController.updateContact),
);

export default router;
