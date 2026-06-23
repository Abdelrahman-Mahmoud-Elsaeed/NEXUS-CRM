/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { selectOrg } from "../store/org.slice";
import type {
  InvitationDto,
  InvitationFormValues,
  InvitationRow,
  RoleSelectOption,
  UseInvitationsViewResult,
} from "../types/organization.types";
import { invitationFormSchema } from "../validations/organization.validation";
import { createWorkspaceInvitation } from "@/modules/invitation/store/invitations.actions";
import { selectInvitations } from "@/modules/invitation/store/invitations.slice";


const ROLE_OPTIONS: RoleSelectOption[] = [
  { label: "Member", value: "Member" },
  { label: "Admin", value: "Admin" },
];

const getInvitationStatus = (invitation: InvitationDto) => {
  if (invitation.isUsed) {
    return { label: "ACCEPTED" as const, severity: "accepted" as const };
  }

  const isExpired = new Date(invitation.expiresAt).getTime() < Date.now();
  if (isExpired) {
    return { label: "EXPIRED" as const, severity: "expired" as const };
  }

  return { label: "PENDING" as const, severity: "pending" as const };
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const formatExpiryLabel = (invitation: InvitationDto) => {
  if (invitation.isUsed) return "Claimed";
  if (new Date(invitation.expiresAt).getTime() < Date.now()) return "Expired";
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
  const dispatch = useDispatch<any>();

  const {
    invitations: invitationsRaw,
    isLoadingInvitations,
    invitationsError,
    isInviting,
    inviteSubmissionError,
  } = useSelector(selectInvitations);
  
  const { currentOrganizationId } = useSelector(selectOrg);

  const [searchQuery, setSearchQuery] = useState("");

  const { register, handleSubmit, reset, formState } =
    useForm<InvitationFormValues>({
      resolver: zodResolver(invitationFormSchema),
      defaultValues: {
        email: "",
        role: "Member",
      },
      mode: "onTouched",
    });

  const filteredInvitations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return invitationsRaw;

    return invitationsRaw.filter((invitation: { email: string; }) =>
      invitation.email.toLowerCase().includes(query),
    );
  }, [invitationsRaw, searchQuery]);

  const invitations = useMemo(
    () => filteredInvitations.map(mapInvitationToRow),
    [filteredInvitations],
  );

  const onSubmitInvite = useCallback(
    async (formValues: InvitationFormValues) => {
      if (!currentOrganizationId) return;

      const result = await dispatch(
        createWorkspaceInvitation({
          orgId: currentOrganizationId,
          email: formValues.email,
          role: formValues.role,
        }),
      );

      if (createWorkspaceInvitation.fulfilled.match(result)) {
        reset();
      }
    },
    [currentOrganizationId, dispatch, reset],
  );

  return {
    organizationId: currentOrganizationId,
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
