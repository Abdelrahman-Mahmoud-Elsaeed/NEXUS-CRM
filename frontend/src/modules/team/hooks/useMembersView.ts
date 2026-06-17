/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { selectOrg } from "../store/org.slice";
import { selectMembersState, setSearchQuery as setSearchQueryAction } from "../store/members.slice";
import {
  fetchOrganizationMembers,
} from "../store/members.actions";
import { memberInviteFormSchema } from "../validations/organization.validation";
import type {
  MemberInviteFormValues,
  MemberRoleOption,
} from "../types/organization.types";
import { selectInvitations } from "@/modules/invitation/store/invitations.slice";
import { createWorkspaceInvitation } from "@/modules/invitation/store/invitations.actions";

const ROLE_OPTIONS: MemberRoleOption[] = [
  { label: "Member", value: "MEMBER" },
  { label: "Admin", value: "ADMIN" },
];

export function useMembersView() {
  const dispatch = useDispatch<any>();
  const { currentOrganizationId } = useSelector(selectOrg);
  
  // 1. Key to force a clean DOM remount on success
  const [formKey, setFormKey] = useState(0); 

  const {
    items,
    searchQuery,
    isLoadingMembers,
    membersError,
  } = useSelector(selectMembersState);

  const {
    isInviting,
    inviteSubmissionError
  } = useSelector(selectInvitations);


  const members = useMemo(() => (Array.isArray(items) ? items : []), [items]);

  const { register, handleSubmit, reset, formState } =
    useForm<MemberInviteFormValues>({
      resolver: zodResolver(memberInviteFormSchema),
      defaultValues: { email: "", role: "MEMBER" },
      mode: "onTouched", 
    });

  useEffect(() => {
    if (currentOrganizationId) {
      dispatch(fetchOrganizationMembers(currentOrganizationId));
    }
  }, [currentOrganizationId, dispatch]);

  const filteredMembers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return members;
    
    return members.filter(
      (member) =>
        member.name?.toLowerCase().includes(query) ||
        member.email?.toLowerCase().includes(query)
    );
  }, [members, searchQuery]);

  const onSubmitInvite = useCallback(
    async (formValues: MemberInviteFormValues) => {
      if (!currentOrganizationId) return;

      const result = await dispatch(
        createWorkspaceInvitation({ orgId: currentOrganizationId, ...formValues })
      );

      if (createWorkspaceInvitation.fulfilled.match(result)) {
        reset({
          email: "",
          role: "MEMBER",
        });

        setFormKey((prev) => prev + 1);

        dispatch(fetchOrganizationMembers(currentOrganizationId));
      }
    },
    [currentOrganizationId, dispatch, reset]
  );

  const handleUpdateSearchQuery = useCallback((query: string) => {
    dispatch(setSearchQueryAction(query));
  }, [dispatch]);

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
    setSearchQuery: handleUpdateSearchQuery,
    roleOptions: ROLE_OPTIONS,
    register,
    handleSubmit,
    formState,
    onSubmitInvite,
    formKey,
  };
}