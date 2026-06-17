import { ApiResponse, ServiceResult } from "@/shared/types/api.types";
import { UserProfileDto } from "../auth/auth.dto";
import { Role as PrismaRole, Invitation } from "@prisma/client";



export interface OrgMemberDto {
  id: string;
  name: string | null;
  email: string;
  role: PrismaRole;
  joinedAt: Date;
}


// ============================================================================
// 1. The Service Return Contract
// ============================================================================




export type GetOrganizationMembersServiceResult = ServiceResult<
  OrgMemberDto[],
  "NOT_A_MEMBER"
>;



export type GetOrgMembersApiResponse = ApiResponse<
  { members: OrgMemberDto[] },
  "UNAUTHORIZED" | "FORBIDDEN_ORGANIZATION_ACCESS"
>;



