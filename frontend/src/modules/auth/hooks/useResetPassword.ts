/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/modules/auth/hooks/useResetPassword.ts
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { AuthService } from "@/modules/auth/services/auth.service";
import { resetPasswordSchema, type ResetPasswordValues } from "../validations/auth";

export function useResetPassword() {
  const [loading, setLoading] = useState(false);
  const [isVerifyingLink, setIsVerifyingLink] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" }
  });

  // Verify token on mount
  useEffect(() => {
    const checkTokenValidity = async () => {
      if (!token) {
        navigate("/link-expired");
        return;
      }

      try {
        await AuthService.verifyResetToken(token);
        
        // If successful, stop loading and allow user to see the form
        setIsVerifyingLink(false);
      } catch (err) {
        // If interceptor catches an error (INVALID_TOKEN), redirect
        navigate("/link-expired");
      }
    };

    checkTokenValidity();
  }, [token, navigate]);

  const onSubmit = async (values: ResetPasswordValues) => {
    if (!token) return;

    setLoading(true);
    setError(null); // Clear generic errors before new request
    
    try {
      await AuthService.resetPassword(values.password, token);
      navigate("/login", { state: { message: "Password reset successful. Please log in." } });
    } catch (err: any) {
      // Safely extract the reason from your backend response
      const reason = err.response?.data?.reason;
      switch (reason) {
        case "PASSWORD_REUSE_NOT_ALLOWED":
          // Attach this error directly to the password input field!
          form.setError("password", {
            type: "server",
            message: "You cannot reuse your current or recently used passwords. Please choose a new one.",
          });
          // Clear the confirm password field to force them to re-type
          form.setValue("confirmPassword", ""); 
          break;

        case "INVALID_TOKEN":
          setError("This reset link has expired or has already been used. Please request a new one.");
          break;

        case "USER_NOT_FOUND":
          setError("We couldn't find an account associated with this request.");
          break;

        default:
          setError("Something went wrong while resetting your password. Please try again.");
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  return { 
    form, 
    loading, 
    isVerifyingLink, 
    error, // This handles top-level generic errors
    onSubmit: form.handleSubmit(onSubmit) 
  };
}