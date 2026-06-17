import { Role as PrismaRole, Invitation } from "@prisma/client";
import { ApiResponse, ServiceResult } from "@/shared/types/api.types";

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




// ============================================================================
// Request Inputs Payload Signatures
// ============================================================================


export interface UpdateOrgNameRequestDto {
  name: string;
}

// ============================================================================
// Unified Service Return Type Aliases (No Unexpected Server Errors)
// ============================================================================
export type GetUserOrganizationsServiceResult = ServiceResult<
  OrganizationDto[]
>;





export type UpdateOrganizationNameServiceResult = ServiceResult<
  { id: string; name: string },
  "NOT_A_MEMBER" | "UNAUTHORIZED_ACTION"
>;



// ============================================================================
// Client Facing API Response Wrapper Signatures
// ============================================================================
export type GetUserOrganizationsResponse = ApiResponse<
  { organizations: OrganizationDto[] },
  "UNAUTHORIZED"
>;





export type UpdateOrgNameApiResponse = ApiResponse<
  { id: string; name: string },
  "UNAUTHORIZED" | "FORBIDDEN_ORGANIZATION_ACCESS"
>;
