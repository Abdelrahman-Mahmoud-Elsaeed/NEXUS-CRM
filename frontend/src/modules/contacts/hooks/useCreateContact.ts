/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch } from "react-redux";
import type { FinalSubmissionPayload } from "../types/contact.types";
import { createNewContact, uploadContactAvatarThunk } from "../store/contacts.actions";

export function useCreateContact(onSuccess: () => void) {
  const dispatch = useDispatch<any>();

  const handleCreateContactSubmit = async (
    submissionPayload: FinalSubmissionPayload & { avatarFile?: File | null },
  ) => {
    try {
      let uploadedAvatarUrl: string | undefined = undefined;

      if (submissionPayload.avatarFile) {
        const uploadResult = await dispatch(
          uploadContactAvatarThunk(submissionPayload.avatarFile),
        ).unwrap();
        uploadedAvatarUrl = uploadResult?.file?.url || uploadResult?.url || uploadResult;
      }

      const formattedBackendPayload = {
        name: submissionPayload.name,
        email: submissionPayload.email,
        phone: submissionPayload.phone,
        jobTitle: submissionPayload.jobTitle,
        companyName: submissionPayload.companyName,
        website: submissionPayload.website,
        pipelineStageId: submissionPayload.pipelineStageId,
        source: submissionPayload.source,
        notes: submissionPayload.notes,
        avatarUrl: uploadedAvatarUrl,
        channels: submissionPayload.channels,
      };

      await dispatch(createNewContact({ data: formattedBackendPayload as any })).unwrap();
      onSuccess();
      return { success: true };
    } catch (error: any) {
      console.error("Submission failed:", error);
      return {
        success: false,
        msg: typeof error === "string" ? error : error?.msg || error?.message || "Failed to finalize contact profile.",
      };
    }
  };

  return { handleCreateContactSubmit };
}
