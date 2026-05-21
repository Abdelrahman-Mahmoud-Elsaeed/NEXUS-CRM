import { Request, Response } from "express";
import { FilesService } from "./files.service";
import {
  UploadFileApiResponse,
  GetFileApiResponse,
  DeleteFileApiResponse,
} from "./files.dto";

const filesService = new FilesService();

export class FilesController {
  async uploadFile(
    req: Request,
    res: Response,
  ): Promise<Response<UploadFileApiResponse>> {
    const userId = req.user?.userId;

    const organizationId = req.organizationId as string;

    const file = (req as any).file as Express.Multer.File | undefined;

    const uploadFolder = (req as any).uploadFolder || "general";

    if (!userId || !organizationId) {
      return res.status(401).json({ success: false, reason: "UNAUTHORIZED" });
    }

    if (!file) {
      return res
        .status(400)
        .json({ success: false, reason: "NO_FILE_PROVIDED" });
    }

    const result = await filesService.uploadFile(
      userId,
      organizationId,
      uploadFolder,
      file.buffer,
      file.originalname,
      file.mimetype,
      file.size,
    );

    if (!result.success) {
      switch (result.reason) {
        case "INVALID_FILE_TYPE":
          return res
            .status(400)
            .json({ success: false, reason: "INVALID_FILE_TYPE" });
        default:
          return res
            .status(500)
            .json({ success: false, reason: "INTERNAL_SERVER_ERROR" });
      }
    }

    return res.status(201).json({
      success: true,
      data: { file: result.data },
    });
  }

  async getFile(
    req: Request,
    res: Response,
  ): Promise<Response<GetFileApiResponse>> {
    const userId = req.user?.userId;

    const fileId = req.params.id as string;

    if (!userId) {
      return res.status(401).json({ success: false, reason: "UNAUTHORIZED" });
    }

    const result = await filesService.getFileMetadata(fileId);

    if (!result.success) {
      if (result.reason === "FILE_NOT_FOUND") {
        return res
          .status(404)
          .json({ success: false, reason: "FILE_NOT_FOUND" });
      }
      return res.status(403).json({ success: false, reason: "FORBIDDEN" });
    }

    return res.status(200).json({ success: true, data: { file: result.data } });
  }

  async deleteFile(
    req: Request,
    res: Response,
  ): Promise<Response<DeleteFileApiResponse>> {
    const userId = req.user?.userId;
    const fileId = req.params.id as string;

    if (!userId) {
      return res.status(401).json({ success: false, reason: "UNAUTHORIZED" });
    }

    const result = await filesService.deleteFile(fileId);

    if (!result.success) {
      if (result.reason === "FILE_NOT_FOUND") {
        return res
          .status(404)
          .json({ success: false, reason: "FILE_NOT_FOUND" });
      }
      return res
        .status(500)
        .json({ success: false, reason: "INTERNAL_SERVER_ERROR" });
    }

    return res.status(200).json({ success: true, data: null });
  }
}
