import "@/shared/types/express";
import auth from "./modules/auth/auth.routes";
import { Router } from "express";
import contacts from "./modules/contacts/contacts.routes";
import tags from "./modules/tags/tags.routes";
import files from "./modules/files/files.routes";
import organization from "./modules/organization/organization.routes";
import member from "./modules/member/member.routes";
import invitation from "./modules/invitation/invitation.routes";
import companies from "./modules/companies/companies.routes";

const router = Router()



router.use("/auth",auth)
router.use("/contacts", contacts);
router.use("/companies", companies);
router.use("/organization", organization);
router.use("/invitation", invitation);
router.use("/member", member);
router.use("/files", files);
router.use("/tags", tags);

export default router
