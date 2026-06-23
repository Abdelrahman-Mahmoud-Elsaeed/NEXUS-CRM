import { DealStatus } from "@prisma/client";
import { Request, Response } from "express";
import { dealService } from "./deals.service";

export class DealController {
  async getDeals(req: Request, res: Response): Promise<Response> {
    const orgId = req.organizationId!;
    const search = req.query.search as string | undefined;
    const status = req.query.status as DealStatus | undefined;
    const pipelineId = req.query.pipelineId as string | undefined;
    const stageId = req.query.stageId as string | undefined;
    const companyId = req.query.companyId as string | undefined;
    const assignedToId = req.query.assignedToId as string | undefined;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await dealService.getDeals(orgId, {
      search,
      status,
      pipelineId,
      stageId,
      companyId,
      assignedToId,
      page,
      limit,
    });

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

  async getDeal(req: Request, res: Response): Promise<Response> {
    const orgId = req.organizationId!;
    const dealId = req.params.id as string;

    const result = await dealService.getDeal(orgId, dealId);

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

  async createDeal(req: Request, res: Response): Promise<Response> {
    const orgId = req.organizationId!;
    const userId = req.jwtPayload?.userId || req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        reason: "UNAUTHORIZED",
        msg: "Authentication context is missing or expired.",
      });
    }

    const result = await dealService.createDeal(orgId, userId, req.body);

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

  async updateDeal(req: Request, res: Response): Promise<Response> {
    const orgId = req.organizationId!;
    const dealId = req.params.id as string;

    const result = await dealService.updateDeal(orgId, dealId, req.body);

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

  async moveDealStage(req: Request, res: Response): Promise<Response> {
    const orgId = req.organizationId!;
    const dealId = req.params.id as string;

    const result = await dealService.moveDealStage(orgId, dealId, req.body);

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

  async deleteDeal(req: Request, res: Response): Promise<Response> {
    const orgId = req.organizationId!;
    const dealId = req.params.id as string;

    const result = await dealService.deleteDeal(orgId, dealId);

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

export const dealController = new DealController();
