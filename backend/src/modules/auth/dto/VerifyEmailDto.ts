import { ApiResponse } from "@/shared/types/api.types";

export type VerifyEmailResult = ApiResponse<void, 
  | "INVALID_OTP" 
  | "OTP_EXPIRED" 
  | "USER_ALREADY_VERIFIED"
>;
export type RequestOtpResult = ApiResponse<void, "USER_NOT_FOUND">;