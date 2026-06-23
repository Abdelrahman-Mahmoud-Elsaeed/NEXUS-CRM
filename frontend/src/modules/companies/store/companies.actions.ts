// src/modules/companies/store/companies.actions.ts
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { companyService } from "../services/companie.service";
import type { CreateCompanyPayload } from "../types/company.types";

const getErrorMsg = (error: any) => {
  return (
    error?.response?.data?.msg ||
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong."
  );
};

export const fetchCompanies = createAsyncThunk(
  "companies/fetchCompanies",
  async (
    payload: { search?: string; page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await companyService.getCompanies(payload);
      if (response.success) {
        return response;
      }
      return rejectWithValue(response.msg);
    } catch (error: any) {
      return rejectWithValue(getErrorMsg(error));
    }
  }
);

export const fetchCompany = createAsyncThunk(
  "companies/fetchCompany",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await companyService.getCompany(id);
      if (response.success) {
        return response;
      }
      return rejectWithValue(response.msg);
    } catch (error: any) {
      return rejectWithValue(getErrorMsg(error));
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
      const response = await companyService.createCompany(payload.data);
      if (response.success) {
        return response;
      }
      return rejectWithValue(response.msg);
    } catch (error: any) {
      return rejectWithValue(getErrorMsg(error));
    }
  }
);

export const updateExistingCompany = createAsyncThunk(
  "companies/updateCompany",
  async (
    payload: { id: string; data: Partial<CreateCompanyPayload> },
    { rejectWithValue }
  ) => {
    try {
      const response = await companyService.updateCompany(payload.id, payload.data);
      if (response.success) {
        return response;
      }
      return rejectWithValue(response.msg);
    } catch (error: any) {
      return rejectWithValue(getErrorMsg(error));
    }
  }
);

export const uploadCompanyLogoThunk = createAsyncThunk(
  "companies/uploadLogo",
  async (file: File, { rejectWithValue }) => {
    try {
      const response = await companyService.uploadCompanyLogo(file);
      if (response.success) {
        return response;
      }
      return rejectWithValue(response.msg);
    } catch (error: any) {
      return rejectWithValue(getErrorMsg(error));
    }
  }
);