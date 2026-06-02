import { z } from "zod";
import type { InviteUserRequestDto } from "./organization.types";
import type { UseFormHandleSubmit, UseFormRegister, FormState, SubmitHandler } from "react-hook-form";

export const invitationFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  role: z.enum(["MEMBER", "ADMIN"]),
});

export type InvitationFormValues = z.infer<typeof invitationFormSchema>;

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
