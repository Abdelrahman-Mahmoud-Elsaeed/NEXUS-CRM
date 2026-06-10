/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth } from "../store/auth.slice";
import { verifyResetToken, submitPasswordReset } from "../store/auth.actions";
import { resetPasswordSchema, type ResetPasswordValues } from "../validations/auth";

export function useResetPassword() {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  // 1. Core API state variables sourced from Redux
  const { isVerifyingResetToken, isResettingPassword, resetPasswordError } = useSelector(selectAuth);

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" }
  });

  // 2. Continuous token verification guard on mount
  useEffect(() => {
    if (!token) {
      navigate("/link-expired", { replace: true });
      return;
    }

    const checkToken = async () => {
      const result = await dispatch(verifyResetToken(token));
      if (verifyResetToken.rejected.match(result)) {
        navigate("/link-expired", { replace: true });
      }
    };

    checkToken();
  }, [token, dispatch, navigate]);

  // 3. Isolated form submission handler
  const onSubmit = useCallback(async (values: ResetPasswordValues) => {
    if (!token) return;

    const result = await dispatch(
      submitPasswordReset({ password: values.password, token })
    );

    if (submitPasswordReset.fulfilled.match(result)) {
      navigate("/login", { 
        state: { message: "Password reset successful. Please log in." },
        replace: true 
      });
    } else if (result.payload === "PASSWORD_REUSE_NOT_ALLOWED") {
      // Catch specific validation exception to re-attach directly to input field
      form.setError("password", {
        type: "server",
        message: "You cannot reuse your current or recently used passwords. Please choose a new one.",
      });
      form.setValue("confirmPassword", "");
    }
  }, [token, dispatch, navigate, form]);

  return { 
    form, 
    loading: isResettingPassword, 
    isVerifyingLink: isVerifyingResetToken, 
    error: resetPasswordError === "PASSWORD_REUSE_NOT_ALLOWED" ? null : resetPasswordError,
    onSubmit: form.handleSubmit(onSubmit) 
  };
}