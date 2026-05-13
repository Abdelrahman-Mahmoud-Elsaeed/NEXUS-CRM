/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { AuthService } from "@services/auth.service";
import { loginSchema, type LoginValues } from "../validations/auth";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = async (values: LoginValues) => {
    setLoading(true);
    setError(null);

    try {
      const result = await AuthService.login({
        email: values.email,
        password: values.password,
      });

      // Check the verification status from the response data
      if (result.success) {
        if (result.data.isVerified) {
          navigate("/dashboard");
        } else {
          navigate("/verify-email");
        }
      }
    } catch (err: any) {
      const reason = err.response?.data?.reason;

      if (reason === "INVALID_CREDENTIALS") {
        setError("Invalid email or password.");
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
