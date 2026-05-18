/* eslint-disable @typescript-eslint/no-explicit-any */
// src/modules/auth/hooks/useLogin.ts

import { useState } from "react";
import { loginUser } from "../store/authSlice";
import { loginSchema, type LoginValues } from "../validations/auth";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/app/store/hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

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
      const result = await dispatch(loginUser({
        email: values.email,
        password: values.password,
      })).unwrap();

      if (result.user.isVerified) {
        navigate("/");
      } else {
        navigate("/verify-email");
      }
    } catch (reason: any) {
      if (reason === "INVALID_CREDENTIALS") {
        setError("Invalid email or password.");
      } else if (reason === "USER_DISABLED") {
        setError("This account has been disabled.");
      } else {
        setError(reason || "An unexpected error occurred. Please try again.");
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