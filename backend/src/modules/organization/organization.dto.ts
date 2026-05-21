import { ApiResponse } from "@/shared/types/api.types";
import { Role as PrismaRole } from "@prisma/client";
import { Invitation } from "@prisma/client";

export interface AcceptInviteRequestDto {
  token: string;
}

export interface AcceptInviteSuccessData {
  organizationId: string;
  role: string;
}

export type AcceptInviteServiceResult = ApiResponse<
  AcceptInviteSuccessData,
  | "INVITE_NOT_FOUND"
  | "INVITE_EXPIRED"
  | "INVITE_ALREADY_USED"
  | "DATABASE_ERROR"
>;

export type AcceptInviteApiResponse = ApiResponse<
  {
    organizationId: string;
    message: string;
  },
  | "UNAUTHORIZED"
  | "INVALID_INPUT"
  | "INVITE_NOT_FOUND"
  | "INVITE_EXPIRED"
  | "INVITE_ALREADY_USED"
  | "INTERNAL_SERVER_ERROR"
>;

export interface CreateInviteRequestDto {
  email: string;
  role: PrismaRole;
}

export type CreateInviteServiceResult = ApiResponse<
  Invitation,
  | "ORGANIZATION_MISMATCH"
  | "USER_ALREADY_MEMBER"
  | "INVITE_ALREADY_PENDING"
  | "DATABASE_ERROR"
>;

export type CreateInviteApiResponse = ApiResponse<
  {
    invitationId: string;
    email: string;
    expiresAt: Date;
  },
  | "UNAUTHORIZED"
  | "INSUFFICIENT_PERMISSIONS"
  | "INVALID_INPUT"
  | "ORGANIZATION_MISMATCH"
  | "USER_ALREADY_MEMBER"
  | "INVITE_ALREADY_PENDING"
  | "INTERNAL_SERVER_ERROR"
>;


export interface OrgMemberDto {
  id: string;
  name: string | null;
  email: string;
  role: PrismaRole;
  joinedAt: Date;
}

export type GetOrgMembersServiceResult =
  | { success: true; data: OrgMemberDto[] }
  | {
      success: false;
      reason: "NOT_A_MEMBER" | "ORGANIZATION_MISMATCH" | "DATABASE_ERROR";
    };

export interface GetOrgMembersApiResponse {
  success: boolean;
  data?: {
    members: OrgMemberDto[];
  };
  reason?: string;
}

export type GetUserOrganizationsServiceResult = ApiResponse<
  OrganizationDto[],
  "USER_NOT_FOUND" | "DATABASE_ERROR"
>;

export type GetUserOrganizationsResponse = ApiResponse<
  {
    organizations: OrganizationDto[];
  },
  "UNAUTHORIZED" | "USER_NOT_FOUND" | "INTERNAL_SERVER_ERROR"
>;
export type GetOrganizationsResponse = ApiResponse<
  {
    organizations: OrganizationDto[];
  },
  "UNAUTHORIZED" | "USER_NOT_FOUND" | "INTERNAL_SERVER_ERROR"
>;

export interface OrganizationDto {
  id: string;
  name: string;
  billingPlan: string;
  createdAt: Date;
  avatar:string
}


export interface UpdateOrgNameRequestDto {
  name: string;
}

export type UpdateOrgNameServiceResult =
  | { success: true; data: { id: string; name: string } }
  | { success: false; reason: "NOT_A_MEMBER" | "ORGANIZATION_NOT_FOUND" };


export type UpdateOrgNameApiResponse = ApiResponse<
  { id: string; name: string },                               // Success Payload Type (T)
  "UNAUTHORIZED" | "FORBIDDEN_ORGANIZATION_ACCESS" | "ORGANIZATION_NOT_FOUND" | "INTERNAL_SERVER_ERROR" // Error Reasons (E)
>;