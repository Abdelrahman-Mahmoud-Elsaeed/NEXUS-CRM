import { Request, Response } from "express";
import { TagService } from "./tags.service";
import { GetTagsApiResponse, CreateTagApiResponse } from "./tags.dto";

const tagService = new TagService();

export class TagController {
  async getTags(req: Request, res: Response): Promise<Response<GetTagsApiResponse>> {
    const orgId = req.organizationId!;
    const result = await tagService.getTags(orgId);
    if (!result.success) {
      return res.status(500).json({ 
        success: false, 
        reason: "DATABASE_ERROR" 
      });
    }

    return res.status(200).json({ 
      success: true, 
      data: result.data 
    });
  }

  async createTag(req: Request, res: Response): Promise<Response<CreateTagApiResponse>> {
    const orgId = req.organizationId!;
    const { name, colorHex } = req.body;

    const result = await tagService.createTag(orgId, name, colorHex);

    if (!result.success) {
      const status = result.reason === "TAG_ALREADY_EXISTS" ? 409 : 500;
      return res.status(status).json({ 
        success: false, 
        reason: result.reason 
      });
    }

    return res.status(201).json({ 
      success: true, 
      data: result.data 
    });
  }
}