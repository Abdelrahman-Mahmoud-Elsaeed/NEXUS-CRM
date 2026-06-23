import { Request, Response } from "express";
import { companyService } from "./companies.service";

export class CompanyController {
  async getCompanies(req: Request, res: Response): Promise<Response> {
    const orgId = req.organizationId!;
    const search = req.query.search as string | undefined;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await companyService.getCompanies(orgId, search, page, limit);

    if (!result.success) {
      return res.status(result.statusCode).json({
        success: false,
        reason: result.reason,
        msg: result.msg,
      });
    }

    return res.status(result.statusCode).json({
      success: true,
      data: result.data,
    });
  }

  async getCompany(req: Request, res: Response): Promise<Response> {
    const orgId = req.organizationId!;
    const companyId = req.params.id as string;

    const result = await companyService.getCompany(orgId, companyId);

    if (!result.success) {
      return res.status(result.statusCode).json({
        success: false,
        reason: result.reason,
        msg: result.msg,
      });
    }

    return res.status(result.statusCode).json({
      success: true,
      data: result.data,
    });
  }

  async createCompany(req: Request, res: Response): Promise<Response> {
    const orgId = req.organizationId!;

    const result = await companyService.createCompany(orgId, req.body);

    if (!result.success) {
      return res.status(result.statusCode).json({
        success: false,
        reason: result.reason,
        msg: result.msg,
      });
    }

    return res.status(result.statusCode).json({
      success: true,
      data: result.data,
    });
  }

  async updateCompany(req: Request, res: Response): Promise<Response> {
    const orgId = req.organizationId!;
    const companyId = req.params.id as string;

    const result = await companyService.updateCompany(orgId, companyId, req.body);

    if (!result.success) {
      return res.status(result.statusCode).json({
        success: false,
        reason: result.reason,
        msg: result.msg,
      });
    }

    return res.status(result.statusCode).json({
      success: true,
      data: result.data,
    });
  }
}

export const companyController = new CompanyController();
