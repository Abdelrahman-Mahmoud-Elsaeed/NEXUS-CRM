// --- Register ---
export interface RegisterRequestDto {
  email: string;
  password: string;
  name?: string;
}

export type RegisterResponseDto =
  | {
      success: true;
      data: {
        id: string;
        email: string;
        name: string | null;
        isVerified: boolean;
        organizations: { id: string; role: Role; name: string }[];
        createdAt: Date;
      };
      tokens: {
        accessToken: string;
      };
    }


// --- Login ---
export type LoginRequestDto = { email: string; password: string };

export type LoginResponseDto = {
  success: true;
  data: {
    id: string;
    email: string;
    name: string | null;
    isVerified: boolean;
    organizations: { id: string; role: Role; name: string }[];
    createdAt: Date;
  };
  tokens: {
    accessToken: string;
  };
};

export type LoginResult =
  | LoginResponseDto
  | { success: false; reason: "INVALID_CREDENTIALS" };

// --- Recovery & Verification ---
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
        | "PASSWORD_REUSE_NOT_ALLOWED";
    };

export type VerifyEmailResult =
  | { success: true }
  | {
      success: false;
      reason: "INVALID_TOKEN" | "EXPIRED_TOKEN" | "ALREADY_VERIFIED";
    };

export type RequestOtpResult =
  | { success: true }
  | { success: false; reason: "USER_NOT_FOUND" };

const Role = {
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
