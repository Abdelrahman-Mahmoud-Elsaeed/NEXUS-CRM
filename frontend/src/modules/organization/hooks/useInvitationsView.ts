import { useMemo, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOrganizationData } from "./useOrganization";
import {
  invitationFormSchema,
  type InvitationFormValues,
  type InvitationRow,
  type RoleSelectOption,
  type UseInvitationsViewResult,
} from "@/modules/organization/types/invitationsView.types";
import type { InvitationDto } from "@/modules/organization/types/organization.types";

const ROLE_OPTIONS: RoleSelectOption[] = [
  { label: "Member", value: "MEMBER" },
  { label: "Admin", value: "ADMIN" },
];

const getInvitationStatus = (invitation: InvitationDto) => {
  if (invitation.isUsed) {
    return {
      label: "ACCEPTED" as const,
      severity: "accepted" as const,
    };
  }

  const isExpired = new Date(invitation.expiresAt) < new Date();
  if (isExpired) {
    return {
      label: "EXPIRED" as const,
      severity: "expired" as const,
    };
  }

  return {
    label: "PENDING" as const,
    severity: "pending" as const,
  };
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const formatExpiryLabel = (invitation: InvitationDto) => {
  if (invitation.isUsed) {
    return "Claimed";
  }

  if (new Date(invitation.expiresAt) < new Date()) {
    return "Expired";
  }

  return "Active Link";
};

const mapInvitationToRow = (invitation: InvitationDto): InvitationRow => {
  const status = getInvitationStatus(invitation);

  return {
    id: invitation.id,
    email: invitation.email,
    role: invitation.role,
    sentDateLabel: formatDate(invitation.createdAt),
    expiryLabel: formatExpiryLabel(invitation),
    statusLabel: status.label,
    statusSeverity: status.severity,
    isExpired: status.severity === "expired",
    isUsed: invitation.isUsed,
  };
};

export function useInvitationsView(): UseInvitationsViewResult {
  const {
    organizationId,
    invitations: invitationsRaw,
    isLoadingInvitations,
    invitationsError,
    inviteUser,
    isInviting,
  } = useOrganizationData();

  const [searchQuery, setSearchQuery] = useState("");

  const [inviteSubmissionError, setInviteSubmissionError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState } = useForm<InvitationFormValues>({
    resolver: zodResolver(invitationFormSchema),
    defaultValues: {
      email: "",
      role: "MEMBER",
    },
    mode: "onTouched",
  });

  const filteredInvitations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return invitationsRaw;

    return invitationsRaw.filter((invitation) =>
      invitation.email.toLowerCase().includes(query),
    );
  }, [invitationsRaw, searchQuery]);

  const invitations = useMemo(
    () => filteredInvitations.map(mapInvitationToRow),
    [filteredInvitations],
  );

  const onSubmitInvite = useCallback(
    async (formValues: InvitationFormValues) => {
      if (!organizationId) {
        throw new Error("No active organization selected");
      }

      setInviteSubmissionError(null);

      const response = await inviteUser(formValues);
      if (!response.success) {
        console.log("run")
        setInviteSubmissionError(response.reason || "Failed to send invitation");
        return;
      }

      reset();
    },
    [inviteUser, organizationId, reset],
  );

  return {
    organizationId,
    invitations,
    filteredInvitationsCount: invitations.length,
    totalInvitationsCount: invitationsRaw.length,
    isLoadingInvitations,
    invitationsError,
    inviteSubmissionError,
    isInviting,
    searchQuery,
    setSearchQuery,
    inviteRoleOptions: ROLE_OPTIONS,
    register,
    handleSubmit,
    formState,
    onSubmitInvite,
  };
}
