/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useInvitationDetails } from "@/modules/organization/hooks/useInvitationDetails";
import { selectAuth } from "@/modules/auth/store/auth.slice";
import { acceptWorkspaceInvitation } from "@/modules/auth/store/auth.actions";
import type { AcceptInvitationFormData } from "../types/organization.types";
import { acceptInvitationSchema } from "../validations/organization.validation";

export function useAcceptInvitation() {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  
  const { token, invitation, isLoading: isLoadingInvitation, error: invitationError } = useInvitationDetails();
  const { isSubmittingInvite, inviteAcceptanceError } = useSelector(selectAuth);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid }, // 🧠 Added isValid here
  } = useForm<AcceptInvitationFormData>({
    resolver: zodResolver(acceptInvitationSchema),
    defaultValues: { fullName: "", password: "" },
    mode: "onTouched",
  });

  // Watch the password field in real-time natively
  const currentPassword = useWatch({
    control,
    name: "password",
  }) || "";

  // Compute live checkbox validation metrics
  const validationRules = useMemo(() => {
    return [
      { label: "At least 8 characters", met: currentPassword.length >= 8 },
      { label: "One uppercase letter (A-Z)", met: /[A-Z]/.test(currentPassword) },
      { label: "One lowercase letter (a-z)", met: /[a-z]/.test(currentPassword) },
      { label: "One special symbol (@, $, !, etc.)", met: /[^A-Za-z0-9]/.test(currentPassword) },
    ];
  }, [currentPassword]);

  // Determine if all criteria are fully satisfied
  const isPasswordValid = useMemo(() => {
    return validationRules.every((rule) => rule.met);
  }, [validationRules]);

  // Calculate strength segments dynamically based on rules met
  const strength = useMemo(() => {
    if (!currentPassword) {
      return { label: "None", colorClass: "text-slate-400", filledBars: 0, barClass: "bg-slate-200" };
    }
    
    const metCount = validationRules.filter((r) => r.met).length;
    
    switch (metCount) {
      case 1:
        return { label: "Weak", colorClass: "text-destructive", filledBars: 1, barClass: "bg-destructive" };
      case 2:
        return { label: "Fair", colorClass: "text-amber-500", filledBars: 2, barClass: "bg-amber-500" };
      case 3:
        return { label: "Good", colorClass: "text-blue-500", filledBars: 3, barClass: "bg-blue-500" };
      case 4:
        return { label: "Strong", colorClass: "text-emerald-500", filledBars: 4, barClass: "bg-emerald-500" };
      default:
        return { label: "Weak", colorClass: "text-destructive", filledBars: 1, barClass: "bg-destructive" };
    }
  }, [currentPassword, validationRules]);

  const onSubmit = async (data: AcceptInvitationFormData) => {
    if (!token) return;

    const result = await dispatch(
      acceptWorkspaceInvitation({
        token,
        name: data.fullName,
        password: data.password,
      })
    );

    if (acceptWorkspaceInvitation.fulfilled.match(result)) {
      navigate("/", { replace: true }); 
    }
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return {
    invitationData: invitation ? {
      email: invitation.email,
      workspaceName: invitation.workspaceName,
      inviterName: invitation.inviterName,
      inviterRole: invitation.inviterRole,
    } : null,
    
    token,
    apiError: inviteAcceptanceError || invitationError,
    isLoadingInvitation,
    isSubmitting: isSubmittingInvite,
    
    showPassword,
    togglePasswordVisibility,
    strength,
    validationRules,
    isPasswordValid,
    isValid,
    formErrors: errors,
    registerField: register,
    onSubmit: handleSubmit(onSubmit),
  };
}