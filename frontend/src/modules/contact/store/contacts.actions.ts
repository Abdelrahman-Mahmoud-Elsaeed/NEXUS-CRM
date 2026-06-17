/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { contactService } from "../services/contact.service";
import type { CreateContactPayload } from "../types/contact.types";

export const fetchContacts = createAsyncThunk(
  "contacts/fetchContacts",
  async (
    payload: { search?: string; page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      return await contactService.getContacts(payload);
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch contacts");
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
      return await contactService.createContact(payload.data);
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create contact");
    }
  }
);

export const uploadContactAvatarThunk = createAsyncThunk(
  "contacts/uploadAvatar",
  async (file: File, { rejectWithValue }) => {
    try {
      const response = await contactService.uploadContactAvatar(file);
      return response.data || response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.msg || error.message || "Failed to upload avatar"
      );
    }
  }
);