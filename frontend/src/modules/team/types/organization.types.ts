import { z } from "zod";
import type { LucideIcon } from "lucide-react";
import type { UseFormHandleSubmit, UseFormRegister, FormState, SubmitHandler } from "react-hook-form";
import {
  acceptInvitationSchema,
  invitationFormSchema,
  roleUpdateSchema,
} from "../validations/organization.validation";

// ============================================================================
// Core Shared API Entities
// ============================================================================
export interface Organization {
  id: string;
  name: string;
  avatar: string | null;
  role: "OWNER" | "ADMIN" | "MEMBER";
  createdAt: string;
}

export interface InvitationDto {
  id: string;
  email: string;
  token: string;
  role: string;
  isUsed: boolean;
  expiresAt: string;
  createdAt: string;
  acceptedAt: string | null;
  organizationId: string;
}

export interface OrganizationMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  avatar: string | null;
}

export interface InviteUserRequestDto {
  email: string;
  role: "ADMIN" | "MEMBER";
}

export interface AcceptInviteRequestDto {
  token: string;
}



// ============================================================================
// Form Value Evaluators (Inferred from Validation Schemas)
// ============================================================================
export type AcceptInvitationFormData = z.infer<typeof acceptInvitationSchema>;
export type InvitationFormValues = z.infer<typeof invitationFormSchema>;
export type MemberInviteFormValues = z.infer<typeof invitationFormSchema>;
export type RoleUpdateFormValues = z.infer<typeof roleUpdateSchema>;

// ============================================================================
// Feature View Supporting Payloads
// ============================================================================
export interface PasswordStrength {
  label: string;
  colorClass: string;
  filledBars: number;
  barClass: string;
}

export interface RegisterInvitedPayload {
  token: string;
  name: string;
  password: string;
}

export interface InvitationRow {
  id: string;
  email: string;
  role: string;
  sentDateLabel: string;
  expiryLabel: string;
  statusLabel: "PENDING" | "EXPIRED" | "ACCEPTED";
  statusSeverity: "pending" | "expired" | "accepted";
  isExpired: boolean;
  isUsed: boolean;
}

export interface RoleSelectOption {
  label: string;
  value: InviteUserRequestDto["role"];
}

export interface MemberRoleOption {
  label: string;
  value: InviteUserRequestDto["role"];
}

export interface RoleDefinitionDto {
  id: string;
  name: string;
  description: string;
  userCount: number;
  isSystemDefault: boolean;
}

export interface RoleItem extends RoleDefinitionDto {
  icon: LucideIcon;
}

export interface RoleUpdatePayload {
  name: string;
  description: string;
}

// ============================================================================
// Component Hook Interface Results
// ============================================================================
export interface UseInvitationsViewResult {
  organizationId: string | null;
  invitations: InvitationRow[];
  filteredInvitationsCount: number;
  totalInvitationsCount: number;
  isLoadingInvitations: boolean;
  invitationsError: string | null;
  inviteSubmissionError: string | null;
  isInviting: boolean;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  inviteRoleOptions: RoleSelectOption[];
  register: UseFormRegister<InvitationFormValues>;
  handleSubmit: UseFormHandleSubmit<InvitationFormValues>;
  formState: FormState<InvitationFormValues>;
  onSubmitInvite: SubmitHandler<InvitationFormValues>;
}

export interface UseMembersViewResult {
  organizationId: string | null;
  members: OrganizationMember[];
  filteredMembers: OrganizationMember[];
  totalMembersCount: number;
  filteredMembersCount: number;
  isLoadingMembers: boolean;
  membersError: string | null;
  inviteSubmissionError: string | null;
  isInviting: boolean;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  refetchMembers: () => Promise<void>;
  roleOptions: MemberRoleOption[];
  register: UseFormRegister<MemberInviteFormValues>;
  handleSubmit: UseFormHandleSubmit<MemberInviteFormValues>;
  formState: FormState<MemberInviteFormValues>;
  onSubmitInvite: SubmitHandler<MemberInviteFormValues>;
}

export interface UseRolesViewResult {
  selectedRole: string;
  rolesList: RoleItem[];
  isLoadingRoles: boolean;
  rolesError: string | null;
  onSelectRole: (roleId: string) => void;
  refetchRoles: () => Promise<void>;
}