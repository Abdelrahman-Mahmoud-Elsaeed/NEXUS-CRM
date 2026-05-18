/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm, type DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/app/store/hooks";
import { signupUser } from "@/modules/auth/store/authSlice";
import { signupSchema, type SignupValues } from "@modules/auth/validations/auth";

export function useSignup() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { 
      name: "", 
      email: "", 
      password: "" 
    } satisfies DefaultValues<SignupValues>,
  });

  const onSubmit = async (values: SignupValues) => {
    try {
      await dispatch(
        signupUser({
          name: values.name,
          email: values.email,
          password: values.password,
        })
      ).unwrap();

      navigate("/verify-email", { state: { email: values.email } });
    } catch (reason: any) {
      if (reason === "EMAIL_IS_USED" || reason === "EMAIL_ALREADY_EXISTS") {
        form.setError("email", { 
          type: "server",
          message: "This email is already in use." 
        });
      } else if (reason === "WEAK_PASSWORD") {
        form.setError("password", {
          type: "server",
          message: "Password does not meet complexity rules."
        });
      } else {
        form.setError("root", { 
          type: "server",
          message: "An unexpected error occurred. Please try again." 
        });
      }
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
  };
}