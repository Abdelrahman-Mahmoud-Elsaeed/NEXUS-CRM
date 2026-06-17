/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, type ChangeEvent } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CompanyFormValues, FinalCompanySubmissionPayload } from "../types/company.types";
import { createCompanyFormSchema } from "../validations/Companie.validation";


interface UseCreateCompanyModalFormProps {
  onClose: () => void;
  onSubmit: (
    data: FinalCompanySubmissionPayload & { logoFile?: File | null }
  ) => Promise<{ success: boolean; msg?: string } | void> | void;
}

export function useCreateCompanyModalForm({
  onClose,
  onSubmit,
}: UseCreateCompanyModalFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(createCompanyFormSchema),
    defaultValues: {
      name: "",
      domain: "",
      industry: "",
      phone: "",
      status: "Lead",
      employeeCount: "",
      annualRevenue: "",
      address: "",
      source: "Manual",
      linkedinHandle: "",
      twitterHandle: "",
      notes: "",
      tagIds: [],
    },
    mode: "onTouched",
  });

  const handleClose = () => {
    reset();
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setApiError(null);
    setIsSubmitting(false);
    onClose();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setApiError("Logo image file must be under 2MB.");
      return;
    }

    setSelectedFile(file);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(URL.createObjectURL(file));
  };

  const processValidSubmission: SubmitHandler<CompanyFormValues> = async (formData) => {
    setApiError(null);
    setIsSubmitting(true);
    
    try {
      const submissionPayload: FinalCompanySubmissionPayload & { logoFile?: File | null } = {
        name: formData.name,
        domain: formData.domain || undefined,
        industry: formData.industry || undefined,
        phone: formData.phone || undefined,
        status: formData.status,
        employeeCount: formData.employeeCount ? Number(formData.employeeCount) : undefined,
        annualRevenue: formData.annualRevenue ? Number(formData.annualRevenue) : undefined,
        address: formData.address || undefined,
        source: formData.source || "Manual",
        notes: formData.notes || undefined,
        linkedinHandle: formData.linkedinHandle || undefined,
        twitterHandle: formData.twitterHandle || undefined,
        tagIds: formData.tagIds,
        logoFile: selectedFile,
      };

      const result = await onSubmit(submissionPayload);
      
      if (result && result.success === false) {
        setApiError(result.msg || "Failed to finalize company configuration profile.");
        return;
      }
      
      handleClose();
    } catch (err: any) {
      setApiError(err?.message || "An unexpected system conflict occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    state: {
      errors,
      apiError,
      isSubmitting,
      previewUrl,
    },
    actions: {
      register,
      setValue,
      handleSubmit: handleSubmit(processValidSubmission),
      handleClose,
      handleFileChange,
    },
  };
}