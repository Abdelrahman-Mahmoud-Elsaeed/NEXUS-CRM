/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch } from "react-redux";
import type { FinalCompanySubmissionPayload } from "../types/company.types";
import { createNewCompany, uploadCompanyLogoThunk } from "../store/companies.actions";

export function useCreateCompany(onSuccess: () => void) {
  const dispatch = useDispatch<any>();

  const handleCreateCompanySubmit = async (
    submissionPayload: FinalCompanySubmissionPayload & { logoFile?: File | null },
  ) => {
    try {
      let uploadedLogoUrl: string | undefined = undefined;

      if (submissionPayload.logoFile) {
        const uploadResult = await dispatch(
          uploadCompanyLogoThunk(submissionPayload.logoFile),
        ).unwrap();
        uploadedLogoUrl = uploadResult?.file?.url;
      }

      const formattedBackendPayload = {
        name: submissionPayload.name,
        domain: submissionPayload.domain,
        logoUrl: uploadedLogoUrl,
        industry: submissionPayload.industry,
        phone: submissionPayload.phone,
        status: submissionPayload.status,
        employeeCount: submissionPayload.employeeCount,
        annualRevenue: submissionPayload.annualRevenue,
        address: submissionPayload.address,
        source: submissionPayload.source,
        notes: submissionPayload.notes,
        linkedin: submissionPayload.linkedin,
        twitter: submissionPayload.twitter,
        instagram: submissionPayload.instagram,
        whatsapp: submissionPayload.whatsapp,
        email: submissionPayload.email,
        tagIds: submissionPayload.tagIds,
      };

      await dispatch(createNewCompany({ data: formattedBackendPayload as any })).unwrap();
      onSuccess();
      return { success: true };
    } catch (error: any) {
      console.error("Submission failed:", error);
      return {
        success: false,
        msg: typeof error === "string" ? error : error?.msg || error?.message || "Failed to finalize company configuration profile.",
      };
    }
  };

  return { handleCreateCompanySubmit };
}