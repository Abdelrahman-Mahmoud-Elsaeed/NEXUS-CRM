// src/shared/types/auth.types.ts

// ==========================================
// Base API Response Wrapper
// ==========================================
export type ApiResponse<T = void, E = string> = 
  | { success: true; data: T } 
  | { success: false; reason: E };

// ==========================================
// Enums & Constants
// ==========================================
export const Role = {
  OWNER: "OWNER",
  ADMIN: "ADMIN",
  SALES_MANAGER: "SALES_MANAGER",
  SALES_AGENT: "SALES_AGENT",
  SUPPORT_MANAGER: "SUPPORT_MANAGER",
  SUPPORT_AGENT: "SUPPORT_AGENT",
  MARKETING_MANAGER: "MARKETING_MANAGER",
  MARKETING_AGENT: "MARKETING_AGENT",
  HR: "HR",
  ACCOUNTANT: "ACCOUNTANT",
  VIEWER: "VIEWER",
  MEMBER: "MEMBER",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

// ==========================================
// Shared DTOs
// ==========================================
export interface UserProfileDto {
  id: string;
  email: string;
  name: string | null;
  isVerified: boolean;
  isDisabled: boolean;
  isDeleted: boolean;
  organizations: {
    id: string;
    role: Role;
    name: string;
  }[];
  createdAt: Date;
  updatedAt: Date; // Note: You might want to parse this as a string on the frontend depending on your JSON parsing
}

// ==========================================
// Register
// ==========================================
export interface RegisterRequestDto {
  email: string;
  password: string;
  name?: string;
}

export type RegisterResponseDto = ApiResponse<
  { user: UserProfileDto; tokens: { accessToken: string } }, 
  "EMAIL_IS_USED" | "WEAK_PASSWORD"
>;

// ==========================================
// Login
// ==========================================
export interface LoginRequestDto {
  email: string;
  password: string;
}

export type LoginResult = ApiResponse<
  { user: UserProfileDto; tokens: { accessToken: string } }, 
  "INVALID_CREDENTIALS" | "USER_DISABLED"
>;

// ==========================================
// Recovery & Verification
// ==========================================
export type ForgetPasswordResult = ApiResponse<void, "USER_NOT_FOUND">;

export type ResetPasswordResult = ApiResponse<
  void, 
  | "INVALID_TOKEN" 
  | "EXPIRED_TOKEN" 
  | "USER_NOT_FOUND" 
  | "PASSWORD_REUSE_NOT_ALLOWED"
>;

export type VerifyEmailResult = ApiResponse<
  { tokens: { accessToken: string } }, 
  | "INVALID_OTP" 
  | "OTP_EXPIRED" 
  | "USER_ALREADY_VERIFIED"
>;

export type VerifyResetTokenResult = ApiResponse<
  void, 
  "INVALID_TOKEN" | "EXPIRED_TOKEN"
>;
export type RequestOtpResult = ApiResponse<void, "USER_NOT_FOUND">;


export type VerifyAccessTokenResult = ApiResponse<
  {
    user: {
      id: string;
      email: string;
      isVerified: boolean;
      name?: string;
    };
  },
  "UNAUTHORIZED" | "INVALID_TOKEN"
>;

// ==========================================
// Register Invited User
// ==========================================
export interface RegisterInvitedRequestDto {
  token: string;
  name: string;
  password: string;
}

export type RegisterInvitedResult = ApiResponse<
  { user: UserProfileDto; tokens: { accessToken: string } },
  | "INVALID_TOKEN"
  | "EXPIRED_TOKEN"
  | "WEAK_PASSWORD"
  | "USER_ALREADY_REGISTERED"
>;
