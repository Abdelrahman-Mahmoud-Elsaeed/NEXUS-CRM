import { ApiResponse } from "@/shared/types/api.types";

export type ForgetPasswordResult = ApiResponse<void, "USER_NOT_FOUND">;

export type ResetPasswordResult = ApiResponse<void, 
  | "INVALID_TOKEN" 
  | "EXPIRED_TOKEN" 
  | "USER_NOT_FOUND" 
  | "PASSWORD_REUSE_NOT_ALLOWED"
>;