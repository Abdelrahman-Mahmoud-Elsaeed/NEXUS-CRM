import { ServiceResult } from "@/shared/types/api.types";
import { Role as PrismaRole } from "@prisma/client";

// ============================================================================
// 1. The Service Return Contract
// ============================================================================


export type RegisterServiceResult = ServiceResult<
  UserProfileDto, 
  "EMAIL_IS_USED" | "WEAK_PASSWORD"
>;

export type RegisterInvitedServiceResult = ServiceResult<
  UserProfileDto,
  "INVITATION_NOT_FOUND" | "INVITATION_ALREADY_USED" | "INVITATION_EXPIRED"
>;


export type LoginServiceResult =
  | ServiceResult<UserProfileDto, "INVALID_CREDENTIALS">
  
  | {
      success: false;
      statusCode: number;
      reason: "EMAIL_NOT_VERIFIED";
      data:UserProfileDto; 
    };

export type RequestPasswordResetResult = ServiceResult<void, "USER_NOT_FOUND">;


export type ResetPasswordServiceResult = ServiceResult<
  void, 
  "INVALID_TOKEN" | "USER_NOT_FOUND" | "PASSWORD_REUSE_NOT_ALLOWED"
>;

export type VerifyEmailServiceResult = ServiceResult<
  void, 
  "INVALID_OTP" | "OTP_EXPIRED" | "USER_ALREADY_VERIFIED"
>;

export type RequestEmailOtpServiceResult = ServiceResult<void>;


export type VerifyPasswordResetTokenResult = ServiceResult<void, "INVALID_TOKEN">;

// ============================================================================
// 2. Core Domain Data Transfer Objects (DTOs) & Query Mappers
// ============================================================================
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
    organizations: (user.organizations || []).map((m: any) => ({
      id: m.organization.id,
      name: m.organization.name,
      role: m.role,
    })),
  };
}

// ============================================================================
// 3. Request Payloads (Input DTOs)
// ============================================================================
export interface RegisterRequestDto {
  email: string;
  password: string;
  name?: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface RegisterInvitedRequestDto {
  token: string;
  name: string;
  password: string;
}
