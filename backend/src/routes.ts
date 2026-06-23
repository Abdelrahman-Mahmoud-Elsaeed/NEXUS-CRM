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
import pipelines from "./modules/pipelines/pipelines.routes";
import deals from "./modules/deals/deals.routes";

const router = Router()



router.use("/auth",auth)
router.use("/contacts", contacts);
router.use("/companies", companies);
router.use("/pipelines", pipelines);
router.use("/deals", deals);
router.use("/organization", organization);
router.use("/invitation", invitation);
router.use("/member", member);
router.use("/files", files);
router.use("/tags", tags);

export default router
