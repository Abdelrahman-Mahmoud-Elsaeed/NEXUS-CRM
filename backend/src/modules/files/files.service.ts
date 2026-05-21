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
    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(CRM_BUCKET)
        .upload(storagePath, fileBuffer, {
          contentType: mimeType,
          upsert: false,
        });

      if (uploadError || !uploadData) {
        console.log(uploadError, uploadData);

        return { success: false, reason: "UPLOAD_FAILED" };
      }

      const { data: urlData } = supabase.storage
        .from(CRM_BUCKET)
        .getPublicUrl(storagePath);

      const savedFile = await prisma.file.create({
        data: {
          name: originalName,
          url: urlData.publicUrl,
          storageKey: storagePath,
          size: size,
          mimeType: mimeType,
          uploadedById: userId,
          organizationId: organizationId,
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
        data: {
          ...savedFile,
          name: he.encode(savedFile.name),
        },
      };
    } catch (error) {
      return { success: false, reason: "UPLOAD_FAILED" };
    }
  }

  async getFileMetadata(fileId: string): Promise<GetFileServiceResult> {
    const file = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      return { success: false, reason: "FILE_NOT_FOUND" };
    }

    return {
      success: true,
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
      return { success: false, reason: "FILE_NOT_FOUND" };
    }

    try {
      const { error: deleteError } = await supabase.storage
        .from(CRM_BUCKET)
        .remove([file.storageKey]);

      if (deleteError) {
        return { success: false, reason: "DELETE_FAILED" };
      }

      await prisma.file.delete({
        where: { id: fileId },
      });

      return { success: true, data: null };
    } catch (error) {
      return { success: false, reason: "DELETE_FAILED" };
    }
  }
}
