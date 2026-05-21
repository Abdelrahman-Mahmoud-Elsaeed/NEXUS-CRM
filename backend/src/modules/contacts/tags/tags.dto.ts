import { ApiResponse } from "@/shared/types/api.types"; 

export interface TagDto {
  id: string;
  name: string;
  colorHex: string;
}

export type TagServiceResult<T> = 
  | { success: true; data: T }
  | { success: false; reason: "TAG_ALREADY_EXISTS" | "DATABASE_ERROR" };

export type GetTagsApiResponse = ApiResponse<TagDto[]>;
export type CreateTagApiResponse = ApiResponse<TagDto, "TAG_ALREADY_EXISTS" | "DATABASE_ERROR">;