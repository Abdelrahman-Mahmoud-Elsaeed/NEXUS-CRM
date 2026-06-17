/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectOrg } from "../store/org.slice";

import type {
  InviteUserRequestDto,
  AcceptInviteRequestDto,
} from "../types/organization.types";
import { fetchOrganizationMembers } from "../store/members.actions";
import { selectMembersState } from "../store/members.slice";
import { selectInvitations } from "@/modules/invitation/store/invitations.slice";
import { acceptWorkspaceInvitation, createWorkspaceInvitation, fetchWorkspaceInvitations } from "@/modules/invitation/store/invitations.actions";

export function useOrganization() {
  const dispatch = useDispatch<any>();

  const { currentOrganizationId } = useSelector(selectOrg);

  const {
    invitations,
    isLoadingInvitations,
    invitationsError,
    isInviting,
    isAccepting,
  } = useSelector(selectInvitations);

  const {
    items: members,
    isLoadingMembers,
    membersError,
  } = useSelector(selectMembersState);

  // Re-fetch utilities wrapped in stable compiler callbacks
  const refetchMembers = useCallback(() => {
    if (currentOrganizationId) {
      dispatch(fetchOrganizationMembers(currentOrganizationId));
    }
  }, [currentOrganizationId, dispatch]);

  const refetchInvitations = useCallback(() => {
    if (currentOrganizationId) {
      dispatch(fetchWorkspaceInvitations(currentOrganizationId));
    }
  }, [currentOrganizationId, dispatch]);

  // 3. Centralized profile synchronization side effect engine
  useEffect(() => {
    if (!currentOrganizationId) return;

    // Redux Toolkit handles abort signals under the hood automatically on unmounts
    const membersPromise = dispatch(
      fetchOrganizationMembers(currentOrganizationId),
    );
    const invitationsPromise = dispatch(
      fetchWorkspaceInvitations(currentOrganizationId),
    );

    return () => {
      membersPromise.abort();
      invitationsPromise.abort();
    };
  }, [currentOrganizationId, dispatch]);

  const inviteUser = useCallback(
    async (data: InviteUserRequestDto) => {
      if (!currentOrganizationId)
        throw new Error("No active organization selected");

      return dispatch(
        createWorkspaceInvitation({
          orgId: currentOrganizationId,
          ...data,
        }),
      ).unwrap();
    },
    [currentOrganizationId, dispatch],
  );

  const acceptInvite = useCallback(
    async (data: AcceptInviteRequestDto) => {
      return dispatch(
        acceptWorkspaceInvitation({
          currentOrgId: currentOrganizationId,
          data,
        }),
      ).unwrap();
    },
    [currentOrganizationId, dispatch],
  );

  return {
    organizationId: currentOrganizationId,
    members,
    isLoadingMembers,
    membersError,
    refetchMembers,
    invitations,
    isLoadingInvitations,
    invitationsError,
    refetchInvitations,
    inviteUser,
    isInviting,
    acceptInvite,
    isAccepting,
  };
}
