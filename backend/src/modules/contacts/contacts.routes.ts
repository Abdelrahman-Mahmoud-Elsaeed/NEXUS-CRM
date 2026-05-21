import { Router } from "express";
import leadRoutes from "./leads/leads.routes";
import tagRoutes from "./tags/tags.routes";
import { authMiddleware, requireWorkspace } from "@/shared/middlewares";

const router = Router();

router.use(authMiddleware);
router.use(requireWorkspace);

router.use("/", leadRoutes);
router.use("/", tagRoutes);

export default router;