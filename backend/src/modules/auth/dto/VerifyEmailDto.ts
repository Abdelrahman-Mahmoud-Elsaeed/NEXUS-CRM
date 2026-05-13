export type VerifyEmailResult =
  | { success: true }
  | { success: false; reason: "INVALID_OTP" | "OTP_EXPIRED" | "USER_ALREADY_VERIFIED" };

  export type RequestOtpResult =
  | { success: true }
  | { success: false; reason: "USER_NOT_FOUND" };