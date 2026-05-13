export type ForgetPasswordResult =
  | { success: true }
  | { success: false; reason: "USER_NOT_FOUND" };

export type ResetPasswordResult =
  | { success: true }
  | {
      success: false;
      reason:
        | "INVALID_TOKEN"
        | "EXPIRED_TOKEN"
        | "USER_NOT_FOUND"
        | "PASSWORD_REUSE_NOT_ALLOWED"
        | "PASSWORD_REUSE_NOT_ALLOWED";
    };
