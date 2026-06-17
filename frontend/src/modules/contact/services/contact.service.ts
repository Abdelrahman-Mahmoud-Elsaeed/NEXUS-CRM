import { api } from "@/lib/axios";
import type {
  GetContactsApiResponse,
  ContactResponseDto,
  CreateContactPayload,
} from "../types/contact.types";

export const contactService = {
  getContacts: async (params: {
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<GetContactsApiResponse["data"]> => {
    const response = await api.get<GetContactsApiResponse>(`/contacts`, {
      params: {
        search: params.search || undefined,
        page: params.page?.toString(),
        limit: params.limit?.toString(),
      },
    });
    return response.data.data;
  },

  createContact: async (
    body: CreateContactPayload,
  ): Promise<ContactResponseDto> => {
    const response = await api.post(`/contacts`, body);
    return response.data;
  },

  uploadContactAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);
    const response = await api.post(`/files/contacts/avatars`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};