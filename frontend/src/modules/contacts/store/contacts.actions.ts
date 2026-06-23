// src/modules/contacts/store/contacts.actions.ts
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { contactService } from "../services/contact.service";
import type { CreateContactPayload } from "../types/contact.types";

const getErrorMsg = (error: any) => {
  return (
    error?.response?.data?.msg ||
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong."
  );
};

export const fetchContacts = createAsyncThunk(
  "contacts/fetchContacts",
  async (
    payload: { search?: string; page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await contactService.getContacts(payload);
      if (response.success) {
        return response;
      }
      return rejectWithValue(response.msg);
    } catch (error: any) {
      return rejectWithValue(getErrorMsg(error));
    }
  }
);

export const fetchContact = createAsyncThunk(
  "contacts/fetchContact",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await contactService.getContact(id);
      if (response.success) {
        return response;
      }
      return rejectWithValue(response.msg);
    } catch (error: any) {
      return rejectWithValue(getErrorMsg(error));
    }
  }
);

export const createNewContact = createAsyncThunk(
  "contacts/createContact",
  async (
    payload: { data: CreateContactPayload },
    { rejectWithValue }
  ) => {
    try {
      const response = await contactService.createContact(payload.data);
      if (response.success) {
        return response;
      }
      return rejectWithValue(response.msg);
    } catch (error: any) {
      return rejectWithValue(getErrorMsg(error));
    }
  }
);

export const uploadContactAvatarThunk = createAsyncThunk(
  "contacts/uploadAvatar",
  async (file: File, { rejectWithValue }) => {
    try {
      const response = await contactService.uploadContactAvatar(file);
      if (response.success) {
        return response;
      }
      return rejectWithValue(response.msg);
    } catch (error: any) {
      return rejectWithValue(getErrorMsg(error));
    }
  }
);

export const updateExistingContact = createAsyncThunk(
  "contacts/updateContact",
  async (
    payload: { id: string; data: Partial<CreateContactPayload> },
    { rejectWithValue }
  ) => {
    try {
      const response = await contactService.updateContact(payload.id, payload.data);
      if (response.success) {
        return response;
      }
      return rejectWithValue(response.msg);
    } catch (error: any) {
      return rejectWithValue(getErrorMsg(error));
    }
  }
);