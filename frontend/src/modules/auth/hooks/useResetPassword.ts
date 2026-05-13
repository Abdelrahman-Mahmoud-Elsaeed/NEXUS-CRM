/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { AuthService } from "@services/auth.service";
import { resetPasswordSchema, type ResetPasswordValues } from "../validations/auth";




export function useResetPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" }
  });

  const onSubmit = async (values: ResetPasswordValues) => {
    if (!token) {
      setError("Reset token is missing or invalid.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await AuthService.resetPassword(
        values.password,
        token
      );
      navigate("/login", { state: { message: "Password reset successful. Please log in." } });
    } catch (err: any) {
      const reason = err.response?.data?.reason;
      setError(reason === "INVALID_TOKEN" ? "The link has expired or is invalid." : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return { form, loading, error, onSubmit: form.handleSubmit(onSubmit) };
}