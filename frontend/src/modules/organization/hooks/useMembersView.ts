import { useEffect, useMemo, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { selectAuth } from "@/modules/auth/store/authSlice";
import { MembersViewService } from "@/modules/organization/services/membersView.service";
import { memberInviteFormSchema, type MemberInviteFormValues, type MemberRoleOption, type UseMembersViewResult } from "@/modules/organization/types/membersView.types";
import type { OrganizationMember } from "@/modules/organization/types/organization.types";

const ROLE_OPTIONS: MemberRoleOption[] = [
  { label: "Member", value: "MEMBER" },
  { label: "Admin", value: "ADMIN" },
];

const isAxiosErrorLike = (
  error: unknown,
): error is {
  response?: { data?: { message?: string; reason?: string } };
  message?: string;
} => {
  return (
    typeof error === "object" &&
    error !== null &&
    ("response" in error || "message" in error)
  );
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (isAxiosErrorLike(error)) {
    const reason = error.response?.data?.reason;
    const reasonMessage = reason ? getInviteReasonMessage(reason) : undefined;
    return reasonMessage || error.response?.data?.message || error.message || fallback;
  }
  return fallback;
};

const getInviteReasonMessage = (reason?: string) => {
  switch (reason) {
    case "UNAUTHORIZED":
      return "You are not authorized to send invitations.";
    case "ORGANIZATION_MISMATCH":
      return "The selected organization does not match your current session.";
    case "USER_ALREADY_MEMBER":
      return "This user is already a member of the workspace.";
    case "INVITE_ALREADY_PENDING":
      return "An invitation for this user is already pending.";
    case "DATABASE_ERROR":
      return "Unable to send invitation due to a server error. Please try again.";
    default:
      return "Failed to send invitation.";
  }
};

export function useMembersView(): UseMembersViewResult {
  const { currentOrganizationId } = useSelector(selectAuth);
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [membersError, setMembersError] = useState<string | null>(null);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteSubmissionError, setInviteSubmissionError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { register, handleSubmit, reset, formState } = useForm<MemberInviteFormValues>({
    resolver: zodResolver(memberInviteFormSchema),
    defaultValues: {
      email: "",
      role: "MEMBER",
    },
    mode: "onTouched",
  });

  const fetchMembers = useCallback(async () => {
    if (!currentOrganizationId) {
      setMembers([]);
      setMembersError("No active organization selected");
      return;
    }

    setIsLoadingMembers(true);
    setMembersError(null);

    try {
      const response = await MembersViewService.fetchOrganizationMembers(currentOrganizationId);
      if (response.success) {
        setMembers(response.data || []);
      } else {
        setMembersError(response.reason || "Failed to load workspace members");
      }
    } catch (error) {
      setMembersError(getErrorMessage(error, "Failed to load workspace members"));
    } finally {
      setIsLoadingMembers(false);
    }
  }, [currentOrganizationId]);

  useEffect(() => {
    const loadMembers = async () => {
      await fetchMembers();
    };

    void loadMembers();
  }, [fetchMembers]);

  const filteredMembers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return members;

    return members.filter((member) =>
      member.name.toLowerCase().includes(query) ||
      member.email.toLowerCase().includes(query),
    );
  }, [members, searchQuery]);

  const onSubmitInvite = useCallback(
    async (formValues: MemberInviteFormValues) => {
      if (!currentOrganizationId) {
        setInviteSubmissionError("No active organization selected");
        return;
      }

      setInviteSubmissionError(null);
      setIsInviting(true);

      try {
        const response = await MembersViewService.inviteOrganizationMember(
          currentOrganizationId,
          formValues,
        );

        if (!response.success) {
          setInviteSubmissionError(getInviteReasonMessage(response.reason));
          return;
        }

        reset();
        await fetchMembers();
      } catch (error) {
        setInviteSubmissionError(getErrorMessage(error, "Failed to send invitation"));
      } finally {
        setIsInviting(false);
      }
    },
    [currentOrganizationId, fetchMembers, reset],
  );

  return {
    organizationId: currentOrganizationId,
    members,
    filteredMembers,
    totalMembersCount: members.length,
    filteredMembersCount: filteredMembers.length,
    isLoadingMembers,
    membersError,
    inviteSubmissionError,
    isInviting,
    searchQuery,
    setSearchQuery,
    refetchMembers: fetchMembers,
    roleOptions: ROLE_OPTIONS,
    register,
    handleSubmit,
    formState,
    onSubmitInvite,
  };
}
