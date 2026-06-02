import { ApiResponse } from "@/shared/types/api.types";
import { Role as PrismaRole } from "@prisma/client";

export type VerifyEmailResult = ApiResponse<
  void,
  "INVALID_OTP" | "OTP_EXPIRED" | "USER_ALREADY_VERIFIED"
>;
export type RequestOtpResult = ApiResponse<void, "USER_NOT_FOUND">;

export function mapUser(user: any): UserProfileDto {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    isDisabled: user.isDisabled,
    isDeleted: user.isDeleted,
    organizations: user.organizations.map((m: any) => ({
      id: m.organization.id,
      name: m.organization.name,
      role: m.role,
    })),
  };
}

export interface UserProfileDto {
  id: string;
  email: string;
  name: string | null;
  isVerified: boolean;
  isDisabled: boolean;
  isDeleted: boolean;
  organizations: {
    id: string;
    role: PrismaRole;
    name: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterRequistDto {
  email: string;
  password: string;
  name?: string;
}

export type LoginRequestDto = {
  email: string;
  password: string;
};
export type LoginServiceResult = ApiResponse<
  UserProfileDto,
  "INVALID_CREDENTIALS" | "USER_DISABLED"
>;

export type LoginResult = ApiResponse<
  { user: UserProfileDto; tokens: { accessToken: string } },
  "INVALID_CREDENTIALS" | "USER_DISABLED"
>;
export type RegisterServiceResult = ApiResponse<
  UserProfileDto,
  "EMAIL_IS_USED"
>;
export type RegisterResult = ApiResponse<
  { user: UserProfileDto; tokens: { accessToken: string } },
  "EMAIL_IS_USED" | "WEAK_PASSWORD"
>;
export type RegisterInvitedServiceResult = ApiResponse<
  UserProfileDto,
  "INVITATION_NOT_FOUND" | "INVITATION_ALREADY_USED" | "INVITATION_EXPIRED"
>;

export type RegisterInvitedResult = ApiResponse<
  { user: UserProfileDto },
  "INVITATION_NOT_FOUND" | "INVITATION_ALREADY_USED" | "INVITATION_EXPIRED"
>;
export interface RegisterInvitedRequestDto {
  token: string;
  name: string;
  password: string;
}

export type ForgetPasswordResult = ApiResponse<void, "USER_NOT_FOUND">;

export type ResetPasswordResult = ApiResponse<
  void,
  | "INVALID_TOKEN"
  | "EXPIRED_TOKEN"
  | "USER_NOT_FOUND"
  | "PASSWORD_REUSE_NOT_ALLOWED"
>;
