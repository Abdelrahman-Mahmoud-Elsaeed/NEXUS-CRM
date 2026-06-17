/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { CreateCompanyPayload } from "../types/company.types";
import { companyService } from "../services/companie.service";

export const fetchCompanies = createAsyncThunk(
  "companies/fetchCompanies",
  async (
    payload: { search?: string; page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      return await companyService.getCompanies(payload);
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch companies");
    }
  }
);

export const createNewCompany = createAsyncThunk(
  "companies/createCompany",
  async (
    payload: { data: CreateCompanyPayload },
    { rejectWithValue }
  ) => {
    try {
      return await companyService.createCompany(payload.data);
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create company");
    }
  }
);

export const uploadCompanyLogoThunk = createAsyncThunk(
  "companies/uploadLogo",
  async (file: File, { rejectWithValue }) => {
    try {
      const response = await companyService.uploadCompanyLogo(file);
      // Handles both direct nested object parsing structures smoothly
      return response.data || response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.msg || error.message || "Failed to upload corporate logo"
      );
    }
  }
);