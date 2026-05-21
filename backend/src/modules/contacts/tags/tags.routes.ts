import { Router } from "express";
import { TagController } from "./tags.controller";
import { createTagSchema, getTagsSchema } from "./tags.validators";
import { asyncHandler } from "@/shared/utils/asyncHandler.util";
import { validate } from "@/shared/middlewares";

const router = Router();
const tagController = new TagController();


router.get("/tags", validate(getTagsSchema), asyncHandler(tagController.getTags));
router.post("/tags", validate(createTagSchema), asyncHandler(tagController.createTag));


export default router;