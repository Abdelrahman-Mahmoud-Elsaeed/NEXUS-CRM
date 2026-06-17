import { Router } from "express";
import { FilesController } from "./files.controller";
import { asyncHandler } from "@/shared/utils/asyncHandler.util";
import { authMiddleware } from "@/shared/middlewares/auth/auth.middleware";
import { requireWorkspace } from "@/shared/middlewares";
import { parseUploadedFile } from "@/shared/middlewares/files/fileParser.middleware";
import { requireFile, setUploadFolder } from "@/shared/middlewares/files/file.middleware";

const router = Router();
const controller = new FilesController();

router.use(authMiddleware);
router.use(requireWorkspace);


router.post(
  "/organization/avatars",
  parseUploadedFile({ fieldName: "avatar", maxSizeInBytes: 2 * 1024 * 1024 }),
  requireFile,
  setUploadFolder("avatars_organization"),
  asyncHandler(controller.uploadFile)
);

router.post(
  "/users/avatars",
  parseUploadedFile({ fieldName: "avatar", maxSizeInBytes: 2 * 1024 * 1024 }),
  requireFile,
  setUploadFolder("avatars_user"),
  asyncHandler(controller.uploadFile)
);

router.post(
  "/contacts/avatars",
  parseUploadedFile({ fieldName: "avatar", maxSizeInBytes: 2 * 1024 * 1024 }),
  requireFile,
  setUploadFolder("avatars_contact"),
  asyncHandler(controller.uploadFile)
);


router.post(
  "/companies/avatars",
  parseUploadedFile({ fieldName: "avatar", maxSizeInBytes: 2 * 1024 * 1024 }),
  requireFile,
  setUploadFolder("avatars_companies"),
  asyncHandler(controller.uploadFile)
);

export default router;