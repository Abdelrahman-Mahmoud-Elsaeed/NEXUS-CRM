/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AuthService } from "../services/auth.service";
import type {
  LoginRequestDto,
  RegisterRequestDto,
} from "@/modules/auth/types/auth.types";

const getErrorMsg = (error: any) => {
  return (
    error?.response?.data?.msg ||
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong."
  );
};

export const initializeAuth = createAsyncThunk(
  "auth/initializeAuth",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("access_token");
    if (!token) return rejectWithValue("NO_TOKEN");
    try {
      const response = await AuthService.verifyAccessToken();
      if (response.success) {
        return { token, user: response.data.user };
      }
      return rejectWithValue(response.msg);
    } catch (error: any) {
      return rejectWithValue(getErrorMsg(error));
    }
  },
);

export const acceptWorkspaceInvitation = createAsyncThunk(
  "auth/acceptInvitation",
  async (
    payload: { token: string; name: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await AuthService.registerInvited(payload);

      if (response.success) {
        if (response.data?.tokens?.accessToken) {
          localStorage.setItem(
            "access_token",
            response.data.tokens.accessToken,
          );
        }
        return response.data;
      }

      return rejectWithValue(response.msg);
    } catch (error: any) {
      return rejectWithValue(getErrorMsg(error));
    }
  },
);

export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (credentials: RegisterRequestDto, { rejectWithValue }) => {
    try {
      const response = await AuthService.register(credentials);
      if (response.success) {
        localStorage.setItem("access_token", response.data.tokens.accessToken);
        return response.data;
      }
      return rejectWithValue(response.msg);
    } catch (error: any) {
      return rejectWithValue(getErrorMsg(error));
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: LoginRequestDto, { rejectWithValue }) => {
    try {
      const response = await AuthService.login(credentials);
      if (response.success || response.reason == "EMAIL_NOT_VERIFIED") {
        localStorage.setItem("access_token", response.data.tokens.accessToken);
        return response.data;
      }
      return rejectWithValue(response.msg);
    } catch (error: any) {
      return rejectWithValue(getErrorMsg(error));
    }
  },
);

export const resendOtpCode = createAsyncThunk(
  "auth/resendOtp",
  async (_, { rejectWithValue }) => {
    try {
      const response = await AuthService.requestOtp();
      if (response.success) return;
      return rejectWithValue(response.msg);
    } catch (error: any) {
      return rejectWithValue(getErrorMsg(error));
    }
  },
);

export const verifyUserOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (otp: string, { rejectWithValue }) => {
    try {
      const response = await AuthService.verifyEmail(otp);
      if (response.success) {
        if (response.data.tokens?.accessToken) {
          localStorage.setItem(
            "access_token",
            response.data.tokens.accessToken,
          );
        }
        return response.data;
      }
      return rejectWithValue(response.msg);
    } catch (error: any) {
      return rejectWithValue(getErrorMsg(error));
    }
  },
);

export const verifyResetToken = createAsyncThunk(
  "auth/verifyResetToken",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await AuthService.verifyResetToken(token);
      if (response.success) return true;
      return rejectWithValue(response.msg);
    } catch (error: any) {
      return rejectWithValue(getErrorMsg(error));
    }
  },
);

export const requestPasswordResetLink = createAsyncThunk(
  "auth/requestResetLink",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await AuthService.forgotPassword(email);
      if (response.success) return true;
      return rejectWithValue(response.msg);
    } catch (error: any) {
      return rejectWithValue(getErrorMsg(error));
    }
  },
);

export const submitPasswordReset = createAsyncThunk(
  "auth/submitPasswordReset",
  async (
    { password, token }: { password: string; token: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await AuthService.resetPassword(password, token);
      if (response.success) return true;
      return rejectWithValue(response.msg);
    } catch (error: any) {
      return rejectWithValue(getErrorMsg(error));
    }
  },
);
