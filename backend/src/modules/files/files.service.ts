import { prisma } from "@/shared/config/db/prisma";
import {
  UploadFileServiceResult,
  GetFileServiceResult,
  DeleteFileServiceResult,
} from "./files.dto";
import { CRM_BUCKET } from "@/shared/config/env";
import { supabase } from "@/shared/config/supabase";
import path from "path";
import crypto from "crypto";
import he from "he";

export class FilesService {
  private getImageCacheControl(mimeType: string): string | undefined {
    return mimeType.startsWith("image/") ? "31536000" : undefined;
  }

  async uploadFile(
    userId: string,
    organizationId: string,
    uploadFolder: string,
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string,
    size: number,
  ): Promise<UploadFileServiceResult> {
    const fileExtension = path.extname(originalName).toLowerCase();
    const secureRandomId = crypto.randomUUID();

    const storagePath = `${organizationId}/${uploadFolder}/${Date.now()}-${secureRandomId}${fileExtension}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(CRM_BUCKET)
      .upload(storagePath, fileBuffer, {
        contentType: mimeType,
        cacheControl: this.getImageCacheControl(mimeType),
        upsert: false,
      });

    if (uploadError || !uploadData) {
      return {
        success: false,
        statusCode: 500,
        reason: "UPLOAD_FAILED",
        msg: "File upload failed. Please try again.",
      };
    }

    const { data: urlData } = supabase.storage
      .from(CRM_BUCKET)
      .getPublicUrl(storagePath);

    const savedFile = await prisma.file.create({
      data: {
        name: originalName,
        url: urlData.publicUrl,
        storageKey: storagePath,
        size,
        mimeType,
        uploadedById: userId,
        organizationId,
      },
    });

    if (uploadFolder === "avatars_organization") {
      await prisma.organization.update({
        where: { id: organizationId },
        data: { avatar: urlData.publicUrl },
      });
    }

    if (uploadFolder === "avatars_user") {
      await prisma.user.update({
        where: { id: userId },
        data: { avatar: urlData.publicUrl },
      });
    }

    return {
      success: true,
      statusCode: 201,
      data: {
        ...savedFile,
        name: he.encode(savedFile.name),
      },
    };
  }

  async getFileMetadata(fileId: string): Promise<GetFileServiceResult> {
    const file = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      return {
        success: false,
        statusCode: 404,
        reason: "FILE_NOT_FOUND",
        msg: "File not found.",
      };
    }

    return {
      success: true,
      statusCode: 200,
      data: {
        ...file,
        name: he.encode(file.name),
      },
    };
  }

  async deleteFile(fileId: string): Promise<DeleteFileServiceResult> {
    const file = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      return {
        success: false,
        statusCode: 404,
        reason: "FILE_NOT_FOUND",
        msg: "File not found.",
      };
    }

    const { error: deleteError } = await supabase.storage
      .from(CRM_BUCKET)
      .remove([file.storageKey]);

    if (deleteError) {
      return {
        success: false,
        statusCode: 500,
        reason: "DELETE_FAILED",
        msg: "Failed to delete file from storage.",
      };
    }

    await prisma.file.delete({
      where: { id: fileId },
    });

    return {
      success: true,
      statusCode: 200,
      data: null,
    };
  }
}
