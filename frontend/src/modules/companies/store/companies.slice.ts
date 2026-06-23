// src/modules/companies/store/companies.slice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { CompanyData } from "../types/company.types";
import { createNewCompany, fetchCompanies, fetchCompany, updateExistingCompany, uploadCompanyLogoThunk } from "./companies.actions";

interface CompaniesState {
  items: CompanyData[];
  totalRecords: number;
  totalPages: number;
  isLoading: boolean;
  isLoadingDetail: boolean;
  companyDetail: CompanyData | null;
  isUploadingLogo: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  error: string | null;
}

const initialState: CompaniesState = {
  items: [],
  totalRecords: 0,
  totalPages: 1,
  isLoading: false,
  isLoadingDetail: false,
  companyDetail: null,
  isCreating: false,
  isUploadingLogo: false,
  isUpdating: false,
  error: null,
};

export const companiesSlice = createSlice({
  name: "companies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Companies List
      .addCase(fetchCompanies.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.items = action.payload.data.companies;
          state.totalRecords = action.payload.data.meta.total;
          state.totalPages = action.payload.data.meta.totalPages;
        }
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Single Company
      .addCase(fetchCompany.pending, (state) => {
        state.isLoadingDetail = true;
        state.error = null;
      })
      .addCase(fetchCompany.fulfilled, (state, action) => {
        state.isLoadingDetail = false;
        if (action.payload.success) {
          state.companyDetail = action.payload.data;
        }
      })
      .addCase(fetchCompany.rejected, (state, action) => {
        state.isLoadingDetail = false;
        state.error = action.payload as string;
      })
      
      // Create Company
      .addCase(createNewCompany.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createNewCompany.fulfilled, (state, action) => {
        state.isCreating = false;
        if (action.payload.success) {
          state.items.unshift(action.payload.data);
          state.totalRecords += 1;
        }
      })
      .addCase(createNewCompany.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload as string;
      })
      
      // Update Company
      .addCase(updateExistingCompany.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateExistingCompany.fulfilled, (state, action) => {
        state.isUpdating = false;
        if (action.payload.success) {
          const updatedCompany = action.payload.data;

          // Update detail view if open
          if (state.companyDetail && state.companyDetail.id === updatedCompany.id) {
            state.companyDetail = updatedCompany;
          }

          // Update list item inline
          const index = state.items.findIndex(item => item.id === updatedCompany.id);
          if (index !== -1) {
            state.items[index] = updatedCompany;
          }
        }
      })
      .addCase(updateExistingCompany.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })
      
      // Upload Logo
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