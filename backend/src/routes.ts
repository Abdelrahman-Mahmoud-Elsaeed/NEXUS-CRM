import "@/shared/types/express";
import auth from "./modules/auth/auth.routes";
import { Router } from "express";

const router = Router()



router.use("/auth",auth)


export default router
