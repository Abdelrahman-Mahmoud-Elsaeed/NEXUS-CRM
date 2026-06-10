/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth } from "../store/auth.slice";
import { requestPasswordResetLink } from "../store/auth.actions";
import { forgotPasswordSchema, type ForgotPasswordValues } from "../validations/auth";

export function useForgotPassword() {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const { isSendingResetLink, forgotPasswordError } = useSelector(selectAuth);

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = useCallback(async (values: ForgotPasswordValues) => {
    const result = await dispatch(requestPasswordResetLink(values.email));

    if (requestPasswordResetLink.fulfilled.match(result)) {
      navigate("/check-email", { 
        state: { email: values.email },
        replace: true 
      });
    }
  }, [dispatch, navigate]);

  return {
    form,
    loading: isSendingResetLink,
    error: forgotPasswordError,
    onSubmit: form.handleSubmit(onSubmit),
  };
}