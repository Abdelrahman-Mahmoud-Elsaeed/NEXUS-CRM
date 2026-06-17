/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth } from "../store/auth.slice";
import { loginUser } from "../store/auth.actions";
import { loginSchema, type LoginValues } from "../validations/auth";

export function useLogin() {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const { isLoggingIn, loginError } = useSelector(selectAuth);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = useCallback(async (values: LoginValues) => {
    const result = await dispatch(
      loginUser({
        email: values.email,
        password: values.password,
      })
    );

    if (loginUser.fulfilled.match(result)) {
      const user = result.payload?.user;
      if (user?.isVerified) {
        navigate("/", { replace: true });
      } else {
        navigate("/verify-email", { replace: true });
      }
    }
  }, [dispatch, navigate]);

  return {
    form,
    loading: isLoggingIn,
    error: loginError,
    onSubmit: form.handleSubmit(onSubmit),
  };
}