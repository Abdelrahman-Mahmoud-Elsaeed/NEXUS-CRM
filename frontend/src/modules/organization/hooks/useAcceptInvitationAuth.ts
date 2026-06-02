import { useCallback, useState } from "react";

export interface InvitationDetails {
  inviterName: string;
  targetCompany: string;
  assignedRole: string;
  userEmail: string;
  userAvatar: string;
}

export function useAcceptInvitationAuth() {
  const [invitation] = useState<InvitationDetails>({
    inviterName: "Alex Rivera",
    targetCompany: "Acme Corp Global",
    assignedRole: "Sales Manager",
    userEmail: "julian@acmecorp.com",
    userAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAgCDmodFOS0GfHhWqXe4gZT8DSrikKSYRgHFiBM__UxfEq_mUiYPpoYP8e-0gqdlri3AqsbpKnZLtAmCUbjaa1HpKYzjsTLDUmoEXZMAmQH7D4TqYNvucHVxmhUcYA0fKNV2T3HDvJOGWgnNs7HNSpS8tQoEsQlhaafoZoZIrKu7W0xpmZHs5hHPGS-mqWQlCcxlQFlZEpuFtftFAM2jGH73vcZT8mBAuVI9UnYN13z75_SgV-aDekOkMuGrfrHunI7LTyOx4xJuBa",
  });

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [actionStatus, setActionStatus] = useState<"pending" | "accepted" | "declined">("pending");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleDecision = useCallback(async (decision: "accept" | "decline") => {
    setIsProcessing(true);
    setFeedbackMessage(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      if (decision === "accept") {
        setActionStatus("accepted");
        setFeedbackMessage("Successfully accepted! Redirecting to setup workspace...");
      } else {
        setActionStatus("declined");
        setFeedbackMessage("Invitation safely declined. You can close this tab.");
      }
    } catch (err) {
      setFeedbackMessage("Network authentication failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return {
    invitation,
    isProcessing,
    actionStatus,
    feedbackMessage,
    handleDecision,
  } as const;
}
