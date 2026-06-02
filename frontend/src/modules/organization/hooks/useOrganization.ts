import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { selectAuth } from "@/modules/auth/store/authSlice";
import { OrganizationService } from "../service/organization.service";
import type {
  InviteUserRequestDto,
  AcceptInviteRequestDto,
  OrganizationMember,
  InvitationDto,
} from "../types/organization.types";

interface AxiosErrorLike {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

function isAxiosErrorLike(error: unknown): error is AxiosErrorLike {
  return (
    typeof error === "object" &&
    error !== null &&
    ("response" in error || "message" in error)
  );
}

export function useOrganizationData() {
  const { currentOrganizationId } = useSelector(selectAuth);

  // Members state
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [membersError, setMembersError] = useState<string | null>(null);

  // Invitations state
  const [invitations, setInvitations] = useState<InvitationDto[]>([]);
  const [isLoadingInvitations, setIsLoadingInvitations] = useState(false);
  const [invitationsError, setInvitationsError] = useState<string | null>(null);

  // Mutation states (Loading triggers for buttons)
  const [isInviting, setIsInviting] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);

  // 1. Fetching logic for Organization Members
  const fetchMembers = useCallback(
    async (signal?: AbortSignal) => {
      if (!currentOrganizationId) return;

      setIsLoadingMembers(true);
      setMembersError(null);

      try {
        const response = await OrganizationService.getOrganizationMembers(
          currentOrganizationId,
        );
        if (signal?.aborted) return;
        
        if (response.success) {
          console.log(response.data)
          setMembers(response.data || []);
        } else {
          setMembersError(
            response.reason || "Failed to load organization members",
          );
        }
      } catch (err) {
        if (signal?.aborted) return;

        const errorMessage = isAxiosErrorLike(err)
          ? err.message
          : "Unknown error encountered";
        setMembersError(errorMessage || "Failed to load organization members");
      } finally {
        if (!signal?.aborted) {
          setIsLoadingMembers(false);
        }
      }
    },
    [currentOrganizationId],
  );

  // 2. Fetching logic for Workspace Invitations
  const fetchInvitations = useCallback(
    async (signal?: AbortSignal) => {
      if (!currentOrganizationId) return;

      setIsLoadingInvitations(true);
      setInvitationsError(null);

      try {
        const response = await OrganizationService.getWorkspaceInvitations(
          currentOrganizationId,
        );

        if (signal?.aborted) return;

        if (response.success) {
          setInvitations(response.data || []);
        } else {
          setInvitationsError(
            response.reason || "Failed to load organization invitations",
          );
        }
      } catch (err) {
        if (signal?.aborted) return;

        const errorMessage = isAxiosErrorLike(err)
          ? err.message
          : "Unknown error encountered";
        setInvitationsError(errorMessage || "Failed to load organization invitations");
      } finally {
        if (!signal?.aborted) {
          setIsLoadingInvitations(false);
        }
      }
    },
    [currentOrganizationId],
  );

  // Automatically fetch fresh members and invitations list whenever the active organization changes
  useEffect(() => {
    const controller = new AbortController();

    const timerId = setTimeout(() => {
      if (currentOrganizationId) {
        void fetchMembers(controller.signal);
        void fetchInvitations(controller.signal);
      } else {
        setMembers([]);
        setInvitations([]);
      }
    }, 0);

    return () => {
      clearTimeout(timerId);
      controller.abort();
    };
  }, [currentOrganizationId, fetchMembers, fetchInvitations]);

  // 3. Invite User Action Function
  const inviteUser = async (data: InviteUserRequestDto) => {
    if (!currentOrganizationId)
      throw new Error("No active organization selected");

    setIsInviting(true);
    try {
      const response = await OrganizationService.inviteUser(
        currentOrganizationId,
        data,
      );
      // Synchronously trigger clean re-fetches to keep lists uniform
      await Promise.all([fetchMembers(), fetchInvitations()]);
      return response;
    } catch (err) {
      let message = "Failed to send invitation";
      if (isAxiosErrorLike(err)) {
        message = err.response?.data?.message || err.message || message;
      }
      throw new Error(message, { cause: err });
    } finally {
      setIsInviting(false);
    }
  };

  // 4. Accept Invite Action Function
  const acceptInvite = async (data: AcceptInviteRequestDto) => {
    setIsAccepting(true);
    try {
      const response = await OrganizationService.acceptInvite(data);

      if (
        response.success &&
        response.data?.organizationId === currentOrganizationId
      ) {
        await Promise.all([fetchMembers(), fetchInvitations()]);
      }
      return response;
    } catch (err) {
      let message = "Failed to accept invitation";
      if (isAxiosErrorLike(err)) {
        message = err.response?.data?.message || err.message || message;
      }
      throw new Error(message, { cause: err });
    } finally {
      setIsAccepting(false);
    }
  };

  return {
    organizationId: currentOrganizationId,
    // Members variables
    members,
    isLoadingMembers,
    membersError,
    refetchMembers: fetchMembers,
    invitations,
    isLoadingInvitations,
    invitationsError,
    refetchInvitations: fetchInvitations,
    inviteUser,
    isInviting,
    acceptInvite,
    isAccepting,
  };
}