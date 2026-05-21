import "@/shared/types/express";
import auth from "./modules/auth/auth.routes";
import { Router } from "express";
import contacts from "./modules/contacts/contacts.routes";
import files from "./modules/files/files.routes";
import organization from "./modules/organization/organization.routes";

const router = Router()



router.use("/auth",auth)
router.use("/contacts", contacts);
router.use("/files", files);
router.use("/organization", organization);

export default router
