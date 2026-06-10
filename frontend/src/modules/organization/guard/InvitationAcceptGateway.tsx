/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch, useSelector } from "react-redux";
import { AcceptInvitationNoneAuth } from "../page/AcceptInvitation";
import { AcceptInvitationAuth } from "../page/AcceptInvitationAuth";
import { InvitationLoginPrompt } from "../page/InvitationLoginPrompt";
import type { RootState } from "@/app/store";
import { useEffect, useRef } from "react";
import { useInvitationDetails } from "../hooks/useInvitationDetails";
import { Loader2 } from "lucide-react";
import { initializeAuth } from "@/modules/auth/store/auth.actions";

export function InvitationAcceptGateway() {
  const dispatch = useDispatch<any>();
  const { isAuthenticated, status } = useSelector((state: RootState) => state.auth);
  const { invitation, isLoading, error } = useInvitationDetails();

  const hasAttemptedInit = useRef(false);

  useEffect(() => {
    if (status === "idle" && !hasAttemptedInit.current) {
      hasAttemptedInit.current = true;
      dispatch(initializeAuth());
    }
  }, [status, dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#fcf8ff]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading invitation...</p>
        </div>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#fcf8ff] p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Invalid Invitation</h2>
          <p className="text-sm text-muted-foreground mb-6">
            {error || "This invitation is no longer valid or has expired."}
          </p>
          <a href="/" className="text-primary font-semibold hover:underline">
            Return to Home
          </a>
        </div>
      </div>
    );
  }
  console.log(invitation)
  if (invitation.isExistingUser) {
    if (isAuthenticated) {
      return <AcceptInvitationAuth />;
    } else {
      return (
        <InvitationLoginPrompt
          workspaceName={invitation.workspaceName}
          inviterName={invitation.inviterName}
          inviterRole={invitation.inviterRole}
        />
      );
    }
  } else {
    return <AcceptInvitationNoneAuth />;
  }
}