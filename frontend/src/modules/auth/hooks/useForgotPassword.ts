/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { AuthService } from "@/modules/auth/services/auth.service";
import { forgotPasswordSchema, type ForgotPasswordValues } from "../validations/auth";

export function useForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    setLoading(true);
    setError(null);

    try {
      console.log(values.email)
      await AuthService.forgotPassword(values.email);
      navigate("/check-email", { state: { email: values.email } });
    } catch (err: any) {
      const reason = err.response?.data?.reason;
      
      if (reason === "USER_NOT_FOUND") {
        setError("We couldn't find an account associated with that email.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    error,
    onSubmit: form.handleSubmit(onSubmit),
  };
}