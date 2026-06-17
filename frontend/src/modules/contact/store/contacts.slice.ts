import { createSlice } from "@reduxjs/toolkit";
import { fetchContacts, createNewContact, uploadContactAvatarThunk } from "./contacts.actions";
import type { ContactResponseDto } from "../types/contact.types";

interface ContactsState {
  items: ContactResponseDto[];
  totalRecords: number;
  totalPages: number;
  isLoading: boolean;
  isUploadingAvatar: boolean;
  isCreating: boolean;
  error: string | null;
}

const initialState: ContactsState = {
  items: [],
  totalRecords: 0,
  totalPages: 1,
  isLoading: false,
  isCreating: false,
  isUploadingAvatar: false,
  error: null,
};

export const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.contacts;
        state.totalRecords = action.payload.meta.total;
        state.totalPages = action.payload.meta.totalPages;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      .addCase(createNewContact.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createNewContact.fulfilled, (state, action) => {
        state.isCreating = false;
        state.items.unshift(action.payload);
        state.totalRecords += 1;
      })
      .addCase(createNewContact.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload as string;
      })
      .addCase(uploadContactAvatarThunk.pending, (state) => {
        state.isUploadingAvatar = true;
        state.error = null;
      })
      .addCase(uploadContactAvatarThunk.fulfilled, (state) => {
        state.isUploadingAvatar = false;
      })
      .addCase(uploadContactAvatarThunk.rejected, (state, action) => {
        state.isUploadingAvatar = false;
        state.error = action.payload as string;
      });
  },
});

export default contactsSlice.reducer;