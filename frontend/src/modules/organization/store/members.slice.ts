/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchOrganizationMembers } from "./members.actions";
import type { OrganizationMember } from "../types/organization.types";
import { logout } from "@/modules/auth/store/auth.slice";

export interface MembersState {
  items: OrganizationMember[];
  searchQuery: string;
  isLoadingMembers: boolean;
  membersError: string | null;
}

const initialState: MembersState = {
  items: [],
  searchQuery: "",
  isLoadingMembers: false,
  membersError: null,
};

export const membersSlice = createSlice({
  name: "members",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Active Directory Queries
      .addCase(fetchOrganizationMembers.pending, (state) => {
        state.isLoadingMembers = true;
        state.membersError = null;
      })
      .addCase(fetchOrganizationMembers.fulfilled, (state, action) => {
        state.isLoadingMembers = false;
        state.items = action.payload;
      })
      .addCase(fetchOrganizationMembers.rejected, (state, action) => {
        state.isLoadingMembers = false;
        state.membersError = action.payload as string;
      })

      // Global logout tie-in
      .addCase(logout, () => initialState);
  },
});

export const { setSearchQuery } = membersSlice.actions;
export const selectMembersState = (state: { members: MembersState }) => state.members;
export default membersSlice.reducer;