import { useCallback, useState } from "react";
import { AuthService } from "@/modules/auth/services/auth.service";

export interface PasswordStrength {
  label: string;
  colorClass: string;
  filledBars: number;
  barClass: string;
}

export function useAcceptInvitation() {
  const [token] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search).get("token") || "";
    }
    return "";
  });

  const [apiError, setApiError] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      const verificationToken = new URLSearchParams(window.location.search).get(
        "token",
      );
      return verificationToken
        ? null
        : "Invitation verification token parameter is missing.";
    }
    return null;
  });

  const [fullName, setFullName] = useState<string>("Julian Casablancas");
  const [email] = useState<string>("colleague@acmecorp.com");
  const [workspaceName] = useState<string>("Acme Corp");
  const [inviterName] = useState<string>("Alex Rivera");
  const [inviterRole] = useState<string>("Workspace Admin role");

  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const getPasswordStrength = useCallback((val: string): PasswordStrength => {
    if (val.length === 0)
      return {
        label: "Weak",
        colorClass: "text-destructive",
        filledBars: 1,
        barClass: "bg-destructive",
      };
    if (val.length < 6)
      return {
        label: "Weak",
        colorClass: "text-destructive",
        filledBars: 1,
        barClass: "bg-destructive",
      };
    if (val.length < 10)
      return {
        label: "Fair",
        colorClass: "text-amber-500",
        filledBars: 2,
        barClass: "bg-amber-500",
      };
    if (val.length < 14)
      return {
        label: "Good",
        colorClass: "text-blue-500",
        filledBars: 3,
        barClass: "bg-blue-500",
      };
    return {
      label: "Strong",
      colorClass: "text-emerald-500",
      filledBars: 4,
      barClass: "bg-emerald-500",
    };
  }, []);

  const strength = getPasswordStrength(password);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      setApiError(null);

      if (!token) {
        setApiError("Cannot register without a valid secure token reference.");
        return false;
      }

      setIsSubmitting(true);

      const payload = {
        token,
        name: fullName,
        password,
      };

      try {
        const result = await AuthService.registerInvited(payload);

        if (!result.success) {
          setApiError(
            result.reason || "An error occurred during registration execution.",
          );
          return false;
        }

        window.location.href = "/dashboard";
        return true;
      } catch {
        setApiError(
          "Network error: failed to complete workspace integration vectors.",
        );
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [token, fullName, password],
  );

  return {
    token,
    apiError,
    setApiError,
    fullName,
    setFullName,
    email,
    workspaceName,
    inviterName,
    inviterRole,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    isSubmitting,
    strength,
    handleSubmit,
  } as const;
}
