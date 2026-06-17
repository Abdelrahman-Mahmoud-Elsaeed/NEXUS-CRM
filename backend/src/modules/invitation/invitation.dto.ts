import { Role as PrismaRole, Invitation } from "@prisma/client";
import { ApiResponse, ServiceResult } from "@/shared/types/api.types";

export interface InvitationDetailsDto {
  email: string;
  workspaceName: string;
  inviterName: string | null;
  inviterRole: string;
  token: string;
  expiresAt: Date;
  isExistingUser: boolean;
  assignedRole:string;
}

export type GetWorkspaceInvitationsServiceResult = ServiceResult<
  Invitation[],
  "ORGANIZATION_MISMATCH"
>;

export type GetInvitationDetailsByTokenServiceResult = ServiceResult<
  InvitationDetailsDto,
  "INVITATION_NOT_FOUND" | "INVITATION_ALREADY_USED" | "INVITATION_EXPIRED"
>;

export type CreateInviteApiResponse = ApiResponse<
  { invitationId: string; email: string; expiresAt: Date },
  | "UNAUTHORIZED"
  | "INSUFFICIENT_PERMISSIONS"
  | "ORGANIZATION_MISMATCH"
  | "USER_ALREADY_MEMBER"
  | "INVITE_ALREADY_PENDING"
>;

export type CreateWorkspaceInviteServiceResult = ServiceResult<
  Invitation,
  | "ORGANIZATION_MISMATCH"
  | "UNAUTHORIZED_ACTION"
  | "USER_ALREADY_MEMBER"
  | "INVITE_ALREADY_PENDING"
>;

export type GetWorkspaceInviteByTokenServiceResult = ServiceResult<
  Invitation,
  "ORGANIZATION_MISMATCH" | "INVITATION_NOT_FOUND"
>;




export type AcceptInviteApiResponse = ApiResponse<
  { organizationId: string; message: string },
  | "UNAUTHORIZED"
  | "INVALID_INPUT"
  | "INVITE_NOT_FOUND"
  | "EMAIL_MISMATCH"
  | "INVITE_ALREADY_USED"
  | "INVITE_EXPIRED"
>;
export interface AcceptInviteRequestDto {
  token: string;
}

export interface AcceptInviteSuccessData {
  organizationId: string;
  role: PrismaRole;
}

export type AcceptWorkspaceInviteServiceResult = ServiceResult<
  AcceptInviteSuccessData,
  | "INVITE_NOT_FOUND"
  | "EMAIL_MISMATCH"
  | "INVITE_ALREADY_USED"
  | "INVITE_EXPIRED"
>;

export interface CreateInviteRequestDto {
  email: string;
  role: PrismaRole;
}
