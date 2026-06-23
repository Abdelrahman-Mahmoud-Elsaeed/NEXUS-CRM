/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, type ChangeEvent } from "react";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type {
  ChannelType,
  ContactFormValues,
  FinalSubmissionPayload,
  ContactChannelDto,
} from "../types/contact.types";
import { createContactFormSchema } from "../validations/contact.validation";
import { formatUrlFieldForStorage } from "@/shared/utils/urlFieldUtils";

interface UseCreateContactModalFormProps {
  onClose: () => void;
  onSubmit: (
    data: FinalSubmissionPayload & { avatarFile?: File | null }
  ) => Promise<{ success: boolean; msg?: string } | void> | void;
}

export function useCreateContactModalForm({
  onClose,
  onSubmit,
}: UseCreateContactModalFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(createContactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      jobTitle: "",
      companyName: "",
      companyId: "",
      website: "",
      pipelineStageId: "",
      source: "Manual",
      initials: "",
      status: "Prospect",
      priority: "Medium",
      activeChannels: [],
      alternativeEmailValue: "",
      whatsappValue: "",
      linkedinValue: "",
      instagramValue: "",
      twitterValue: "",
      notes: "",
      tagIds: [],
    },
    mode: "onTouched",
  });

  const selectedChannels = useWatch({ control, name: "activeChannels" }) ?? [];

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
      setApiError("Image file must be under 2MB.");
      return;
    }

    setSelectedFile(file);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleChannelToggle = (channel: ChannelType) => {
    const updatedChannels = selectedChannels.includes(channel)
      ? selectedChannels.filter((c) => c !== channel)
      : [...selectedChannels, channel];

    setValue("activeChannels", updatedChannels, { shouldValidate: true });
  };

  const processValidSubmission: SubmitHandler<ContactFormValues> = async (formData) => {
    setApiError(null);
    setIsSubmitting(true);

    try {
      // Build channels array from active channels + their values
      const channels: ContactChannelDto[] = [];

      const alternativeEmail = formData.alternativeEmailValue.trim() || null;
      const whatsapp = formatUrlFieldForStorage("whatsapp", formData.whatsappValue);
      const linkedin = formatUrlFieldForStorage("linkedinProfile", formData.linkedinValue);
      const instagram = formatUrlFieldForStorage("instagram", formData.instagramValue);
      const twitter = formatUrlFieldForStorage("twitter", formData.twitterValue);

      if (formData.activeChannels.includes("AlternativeEmail") && alternativeEmail) {
        channels.push({ type: "AlternativeEmail", value: alternativeEmail });
      }
      if (formData.activeChannels.includes("WhatsApp") && whatsapp) {
        channels.push({ type: "WhatsApp", value: whatsapp });
      }
      if (formData.activeChannels.includes("LinkedIn") && linkedin) {
        channels.push({ type: "LinkedIn", value: linkedin });
      }
      if (formData.activeChannels.includes("Instagram") && instagram) {
        channels.push({ type: "Instagram", value: instagram });
      }
      if (formData.activeChannels.includes("Twitter") && twitter) {
        channels.push({ type: "Twitter", value: twitter });
      }

      const submissionPayload: any = {
        name: formData.name,
        email: formData.email,
        source: formData.source || "Manual",
        phone: formData.phone || undefined,
        jobTitle: formData.jobTitle || undefined,
        companyName: formData.companyName || undefined,
        companyId: formData.companyId || undefined,
        website: formatUrlFieldForStorage("website", formData.website) || undefined,
        pipelineStageId: formData.pipelineStageId || undefined,
        status: formData.status,
        priority: formData.priority,
        channels: channels.length > 0 ? channels : undefined,
        initials: formData.initials || formData.name.slice(0, 3).toUpperCase(),
        notes: formData.notes || null,
        avatarFile: selectedFile,
      };

      const result = await onSubmit(submissionPayload);

      if (result && result.success === false) {
        setApiError(result.msg || "Failed to create contact.");
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
      channels: selectedChannels,
      previewUrl,
    },
    actions: {
      register,
      setValue,
      handleSubmit: handleSubmit(processValidSubmission),
      handleChannelToggle,
      handleClose,
      handleFileChange,
    },
  };
}
