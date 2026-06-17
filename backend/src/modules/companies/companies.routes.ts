import { Router } from "express";
import { CompanyController } from "./companies.controller";
import { asyncHandler } from "@/shared/utils/asyncHandler.util";
import { authMiddleware, requireWorkspace, validate } from "@/shared/middlewares";
import { createCompanySchema, getCompaniesSchema } from "./companies.validators";

const router = Router();
const companyController = new CompanyController();

router.get(
  "/",
  authMiddleware,
  requireWorkspace,
  validate(getCompaniesSchema),
  asyncHandler(companyController.getCompanies),
);

router.post(
  "/",
  authMiddleware,
  requireWorkspace,
  validate(createCompanySchema),
  asyncHandler(companyController.createCompany),
);

export default router;