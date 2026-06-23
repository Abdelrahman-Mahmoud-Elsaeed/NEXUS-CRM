import { Router } from "express";
import { CompanyController } from "./companies.controller";
import { asyncHandler } from "@/shared/utils/asyncHandler.util";
import { authMiddleware, requireRole, requireWorkspace, validate } from "@/shared/middlewares";
import { createCompanySchema, getCompaniesSchema, getCompanySchema, updateCompanySchema } from "./companies.validators";

const router = Router();
const companyController = new CompanyController();

router.get(
  "/",
  authMiddleware,
  requireWorkspace,
  validate(getCompaniesSchema),
  asyncHandler(companyController.getCompanies),
);

router.get(
  "/:id",
  authMiddleware,
  requireWorkspace,
  validate(getCompanySchema),
  asyncHandler(companyController.getCompany),
);

router.post(
  "/",
  authMiddleware,
  requireWorkspace,
  requireRole(["Owner", "Admin"]),
  validate(createCompanySchema),
  asyncHandler(companyController.createCompany),
);

router.patch(
  "/:id",
  authMiddleware,
  requireWorkspace,
  requireRole(["Owner", "Admin"]),
  validate(updateCompanySchema),
  asyncHandler(companyController.updateCompany),
);

export default router;
