/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useInvitationDetails } from "./useInvitationDetails";
import { selectInvitations } from "../store/invitations.slice";
import { respondToWorkspaceInvitation } from "../store/invitations.actions";

export interface ProcessedInvitationDetails {
  inviterName: string;
  targetCompany: string;
  assignedRole: string;
  userEmail: string;
  userAvatar: string;
}

export function useAcceptInvitationAuth() {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const { invitation, token } = useInvitationDetails();

  const { isProcessingInviteAction, inviteActionStatus, inviteActionFeedback } =
    useSelector(selectInvitations);

  const processedInvitation: ProcessedInvitationDetails | undefined = invitation
    ? {
        inviterName: invitation.inviterName,
        targetCompany: invitation.workspaceName,
        assignedRole: invitation.inviterRole,
        userEmail: invitation.email,
        userAvatar: "",
      }
    : undefined;

  const handleDecision = useCallback(
    async (decision: "accept" | "decline") => {
      if (!token) return;

      const result = await dispatch(
        respondToWorkspaceInvitation({ token, decision }),
      );

      if (
        respondToWorkspaceInvitation.fulfilled.match(result) &&
        decision === "accept"
      ) {
        navigate("/", { replace: true });
      }
    },
    [token, dispatch, navigate],
  );

  return {
    invitation: processedInvitation,
    isProcessing: isProcessingInviteAction,
    actionStatus: inviteActionStatus,
    feedbackMessage: inviteActionFeedback,
    handleDecision,
  } as const;
}
