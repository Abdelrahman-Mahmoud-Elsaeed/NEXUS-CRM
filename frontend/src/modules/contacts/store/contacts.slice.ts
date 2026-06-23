// src/modules/contacts/store/contacts.slice.ts
import { createSlice } from "@reduxjs/toolkit";
import { 
  fetchContacts, 
  fetchContact, 
  createNewContact, 
  uploadContactAvatarThunk,
  updateExistingContact
} from "./contacts.actions";
import type { ContactData } from "../types/contact.types";

interface ContactsState {
  items: ContactData[];
  totalRecords: number;
  totalPages: number;
  isLoading: boolean;
  isLoadingDetail: boolean;
  contactDetail: ContactData | null;
  isUploadingAvatar: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  error: string | null;
}

const initialState: ContactsState = {
  items: [],
  totalRecords: 0,
  totalPages: 1,
  isLoading: false,
  isLoadingDetail: false,
  contactDetail: null,
  isCreating: false,
  isUpdating: false,
  isUploadingAvatar: false,
  error: null,
};

export const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Contacts
      .addCase(fetchContacts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.items = action.payload.data.contacts;
          state.totalRecords = action.payload.data.meta.total;
          state.totalPages = action.payload.data.meta.totalPages;
        }
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      .addCase(fetchContact.pending, (state) => {
        state.isLoadingDetail = true;
        state.error = null;
      })
      .addCase(fetchContact.fulfilled, (state, action) => {
        state.isLoadingDetail = false;
        if (action.payload.success) {
          state.contactDetail = action.payload.data;
        }
      })
      .addCase(fetchContact.rejected, (state, action) => {

        state.isLoadingDetail = false;
        state.error = action.payload as string;
      })
      
      .addCase(createNewContact.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createNewContact.fulfilled, (state, action) => {
        state.isCreating = false;
        if (action.payload.success) {
          state.items.unshift(action.payload.data);
          state.totalRecords += 1;
        }
      })
      .addCase(createNewContact.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload as string;
      })

      // Update Contact
      .addCase(updateExistingContact.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateExistingContact.fulfilled, (state, action) => {
        state.isUpdating = false;
        
        if (action.payload.success) {
          const updatedContact = action.payload.data;

          // Update details inside active detail selection view
          if (state.contactDetail && state.contactDetail.id === updatedContact.id) {
            state.contactDetail = updatedContact;
          }
          
          // Map and update inline inside item rows array
          const index = state.items.findIndex(item => item.id === updatedContact.id);
          if (index !== -1) {
            state.items[index] = updatedContact;
          }
        }
      })
      .addCase(updateExistingContact.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })
      
      // Upload Avatar
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