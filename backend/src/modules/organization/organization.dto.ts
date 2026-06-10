import { Role as PrismaRole, Invitation } from "@prisma/client";
import { ServiceResult } from "@/shared/types/api.types";

// ============================================================================
// Core Domain DTO Data Transfer Objects
// ============================================================================
export interface OrganizationDto {
  id: string;
  name: string;
  billingPlan: string;
  createdAt: Date;
  avatar: string | null;
}

export interface OrgMemberDto {
  id: string;
  name: string | null;
  email: string;
  role: PrismaRole;
  joinedAt: Date;
}

export interface InvitationDetailsDto {
  email: string;
  workspaceName: string;
  inviterName: string | null;
  inviterRole: string;
  token: string;
  expiresAt: Date;
}

export interface AcceptInviteSuccessData {
  organizationId: string;
  role: PrismaRole;
}

// ============================================================================
// Request Inputs Payload Signatures
// ============================================================================
export interface AcceptInviteRequestDto {
  token: string;
}

export interface CreateInviteRequestDto {
  email: string;
  role: PrismaRole;
}

export interface UpdateOrgNameRequestDto {
  name: string;
}

// ============================================================================
// Unified Service Return Type Aliases (No Unexpected Server Errors)
// ============================================================================
export type GetUserOrganizationsServiceResult = ServiceResult<
  OrganizationDto[]
>;

export type CreateWorkspaceInviteServiceResult = ServiceResult<
  Invitation,
  | "ORGANIZATION_MISMATCH"
  | "UNAUTHORIZED_ACTION"
  | "USER_ALREADY_MEMBER"
  | "INVITE_ALREADY_PENDING"
>;

export type GetWorkspaceInvitationsServiceResult = ServiceResult<
  Invitation[],
  "ORGANIZATION_MISMATCH"
>;

export type AcceptWorkspaceInviteServiceResult = ServiceResult<
  AcceptInviteSuccessData,
  | "INVITE_NOT_FOUND"
  | "EMAIL_MISMATCH"
  | "INVITE_ALREADY_USED"
  | "INVITE_EXPIRED"
>;

export type GetOrganizationMembersServiceResult = ServiceResult<
  OrgMemberDto[],
  "NOT_A_MEMBER"
>;

export type UpdateOrganizationNameServiceResult = ServiceResult<
  { id: string; name: string },
  "NOT_A_MEMBER" | "UNAUTHORIZED_ACTION"
>;

export type GetWorkspaceInviteByTokenServiceResult = ServiceResult<
  Invitation,
  "ORGANIZATION_MISMATCH" | "INVITATION_NOT_FOUND"
>;

export type GetInvitationDetailsByTokenServiceResult = ServiceResult<
  InvitationDetailsDto,
  "INVITATION_NOT_FOUND" | "INVITATION_ALREADY_USED" | "INVITATION_EXPIRED"
>;

// ============================================================================
// Client Facing API Response Wrapper Signatures
// ============================================================================
export type GetUserOrganizationsResponse = ServiceResult<
  { organizations: OrganizationDto[] },
  "UNAUTHORIZED"
>;

export type CreateInviteApiResponse = ServiceResult<
  { invitationId: string; email: string; expiresAt: Date },
  | "UNAUTHORIZED"
  | "INSUFFICIENT_PERMISSIONS"
  | "ORGANIZATION_MISMATCH"
  | "USER_ALREADY_MEMBER"
  | "INVITE_ALREADY_PENDING"
>;

export type AcceptInviteApiResponse = ServiceResult<
  { organizationId: string; message: string },
  | "UNAUTHORIZED"
  | "INVALID_INPUT"
  | "INVITE_NOT_FOUND"
  | "EMAIL_MISMATCH"
  | "INVITE_ALREADY_USED"
  | "INVITE_EXPIRED"
>;

export type GetOrgMembersApiResponse = ServiceResult<
  { members: OrgMemberDto[] },
  "UNAUTHORIZED" | "FORBIDDEN_ORGANIZATION_ACCESS"
>;

export type UpdateOrgNameApiResponse = ServiceResult<
  { id: string; name: string },
  "UNAUTHORIZED" | "FORBIDDEN_ORGANIZATION_ACCESS"
>;
