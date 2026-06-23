import { Request, Response } from "express";
import { pipelineService } from "./pipelines.service";

export class PipelineController {
  async getPipelines(req: Request, res: Response): Promise<Response> {
    const orgId = req.organizationId!;
    const search = req.query.search as string | undefined;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await pipelineService.getPipelines(orgId, search, page, limit);

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

  async getPipeline(req: Request, res: Response): Promise<Response> {
    const orgId = req.organizationId!;
    const pipelineId = req.params.id as string;

    const result = await pipelineService.getPipeline(orgId, pipelineId);

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

  async createPipeline(req: Request, res: Response): Promise<Response> {
    const orgId = req.organizationId!;

    const result = await pipelineService.createPipeline(orgId, req.body);

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

  async updatePipeline(req: Request, res: Response): Promise<Response> {
    const orgId = req.organizationId!;
    const pipelineId = req.params.id as string;

    const result = await pipelineService.updatePipeline(orgId, pipelineId, req.body);

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

  async deletePipeline(req: Request, res: Response): Promise<Response> {
    const orgId = req.organizationId!;
    const pipelineId = req.params.id as string;

    const result = await pipelineService.deletePipeline(orgId, pipelineId);

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

  async createPipelineStage(req: Request, res: Response): Promise<Response> {
    const orgId = req.organizationId!;
    const pipelineId = req.params.pipelineId as string;

    const result = await pipelineService.createPipelineStage(orgId, pipelineId, req.body);

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

  async updatePipelineStage(req: Request, res: Response): Promise<Response> {
    const orgId = req.organizationId!;
    const pipelineId = req.params.pipelineId as string;
    const stageId = req.params.stageId as string;

    const result = await pipelineService.updatePipelineStage(
      orgId,
      pipelineId,
      stageId,
      req.body,
    );

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

  async deletePipelineStage(req: Request, res: Response): Promise<Response> {
    const orgId = req.organizationId!;
    const pipelineId = req.params.pipelineId as string;
    const stageId = req.params.stageId as string;

    const result = await pipelineService.deletePipelineStage(orgId, pipelineId, stageId);

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

  async reorderPipelineStages(req: Request, res: Response): Promise<Response> {
    const orgId = req.organizationId!;
    const pipelineId = req.params.pipelineId as string;

    const result = await pipelineService.reorderPipelineStages(orgId, pipelineId, req.body);

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

export const pipelineController = new PipelineController();
