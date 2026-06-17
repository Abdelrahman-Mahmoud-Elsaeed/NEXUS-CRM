import { ApiResponse, ServiceResult } from "@/shared/types/api.types";

export interface FileDto {
  id: string;
  name: string;
  url: string;
  size: number;
  mimeType: string;
  createdAt: Date;
}

// --- Service Results ---
export type UploadFileServiceResult = ServiceResult<
  FileDto,
  "UPLOAD_FAILED" | "INVALID_FILE_TYPE" | "STORAGE_QUOTA_EXCEEDED"
>;

export type GetFileServiceResult = ServiceResult<
  FileDto,
  "FILE_NOT_FOUND" | "UNAUTHORIZED_ACCESS"
>;

export type DeleteFileServiceResult = ServiceResult<
  null,
  "FILE_NOT_FOUND" | "UNAUTHORIZED_ACCESS" | "DELETE_FAILED"
>;

// --- API Responses ---
export type UploadFileApiResponse = ApiResponse<
  { file: FileDto },
  | "UNAUTHORIZED"
  | "NO_FILE_PROVIDED"
  | "UPLOAD_FAILED"
  | "INVALID_FILE_TYPE"
  | "INTERNAL_SERVER_ERROR"
>;

export type GetFileApiResponse = ApiResponse<
  { file: FileDto },
  "UNAUTHORIZED" | "FILE_NOT_FOUND" | "FORBIDDEN" | "INTERNAL_SERVER_ERROR"
>;

export type DeleteFileApiResponse = ApiResponse<
  null,
  "UNAUTHORIZED" | "FILE_NOT_FOUND" | "FORBIDDEN" | "INTERNAL_SERVER_ERROR"
>;
