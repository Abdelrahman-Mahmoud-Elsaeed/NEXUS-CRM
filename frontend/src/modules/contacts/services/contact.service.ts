// src/modules/contacts/services/contact.service.ts
import { api } from "@/lib/axios";
import type {
  GetContactsApiResponse,
  ContactResponseDto,
  CreateContactPayload,
  UploadAvatarResponse,
} from "../types/contact.types";

const CONTACTS_BASE = "/contacts";

export const contactService = {
  getContacts: async (params: {
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<GetContactsApiResponse> => {
    const response = await api.get<GetContactsApiResponse>(`${CONTACTS_BASE}`, {
      params: {
        search: params.search || undefined,
        page: params.page?.toString(),
        limit: params.limit?.toString(),
      },
    });
    return response.data;
  },

  getContact: async (id: string): Promise<ContactResponseDto> => {
    const response = await api.get<ContactResponseDto>(`${CONTACTS_BASE}/${id}`);
    return response.data;
  },

  createContact: async (body: CreateContactPayload): Promise<ContactResponseDto> => {
    const response = await api.post<ContactResponseDto>(`${CONTACTS_BASE}`, body);
    return response.data;
  },

  uploadContactAvatar: async (file: File): Promise<UploadAvatarResponse> => {
    const formData = new FormData();
    formData.append("avatar", file);
    const response = await api.post<UploadAvatarResponse>(`/files/contacts/avatars`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updateContact: async (
    id: string,
    body: Partial<CreateContactPayload>,
  ): Promise<ContactResponseDto> => {
    const response = await api.patch<ContactResponseDto>(`${CONTACTS_BASE}/${id}`, body);
    return response.data;
  },
};
