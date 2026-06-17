import { createSlice } from "@reduxjs/toolkit";
import type { CompanyResponseDto } from "../types/company.types";
import { createNewCompany, fetchCompanies, uploadCompanyLogoThunk } from "./companies.actions";

interface CompaniesState {
  items: CompanyResponseDto[];
  totalRecords: number;
  totalPages: number;
  isLoading: boolean;
  isUploadingLogo: boolean;
  isCreating: boolean;
  error: string | null;
}

const initialState: CompaniesState = {
  items: [],
  totalRecords: 0,
  totalPages: 1,
  isLoading: false,
  isCreating: false,
  isUploadingLogo: false,
  error: null,
};

export const companiesSlice = createSlice({
  name: "companies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.companies;
        state.totalRecords = action.payload.meta.total;
        state.totalPages = action.payload.meta.totalPages;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      .addCase(createNewCompany.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createNewCompany.fulfilled, (state, action) => {
        state.isCreating = false;
        state.items.unshift(action.payload);
        state.totalRecords += 1;
      })
      .addCase(createNewCompany.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload as string;
      })
      
      .addCase(uploadCompanyLogoThunk.pending, (state) => {
        state.isUploadingLogo = true;
        state.error = null;
      })
      .addCase(uploadCompanyLogoThunk.fulfilled, (state) => {
        state.isUploadingLogo = false;
      })
      .addCase(uploadCompanyLogoThunk.rejected, (state, action) => {
        state.isUploadingLogo = false;
        state.error = action.payload as string;
      });
  },
});

export default companiesSlice.reducer;