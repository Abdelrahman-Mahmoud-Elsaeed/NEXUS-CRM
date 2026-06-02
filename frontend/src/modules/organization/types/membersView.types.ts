import { z } from "zod";
import type { OrganizationMember, InviteUserRequestDto } from "./organization.types";
import type {
  UseFormHandleSubmit,
  UseFormRegister,
  FormState,
  SubmitHandler,
} from "react-hook-form";

export const memberInviteFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  role: z.enum(["MEMBER", "ADMIN"]),
});

export type MemberInviteFormValues = z.infer<typeof memberInviteFormSchema>;

export interface MemberRoleOption {
  label: string;
  value: InviteUserRequestDto["role"];
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
