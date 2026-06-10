/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AuthService } from "../services/auth.service";
import type {
  LoginRequestDto,
  RegisterRequestDto,
} from "@/modules/auth/types/auth.types";

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
      return rejectWithValue(response.reason);
    } catch (error: any) {
      return rejectWithValue("INVALID_TOKEN");
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
        // If your backend returns tokens upon successful acceptance, save them here
        if (response.data?.tokens?.accessToken) {
          localStorage.setItem(
            "access_token",
            response.data.tokens.accessToken,
          );
        }
        return response.data;
      }

      // Parse known business reasons safely at the network layer
      const errorMap: Record<string, string> = {
        WEAK_PASSWORD: "Password does not meet complexity rules.",
        INVALID_TOKEN: "Invalid or expired invitation token.",
        EXPIRED_TOKEN: "This invitation has expired.",
        USER_ALREADY_REGISTERED: "This email is already registered.",
      };
      return rejectWithValue(
        errorMap[response.reason || ""] ||
          response.reason ||
          "An unexpected error occurred during registration.",
      );
    } catch (error: any) {
      const reason = error?.response?.data?.reason;
      if (reason) {
        const errorMap: Record<string, string> = {
          WEAK_PASSWORD: "Password does not meet complexity rules.",
          INVALID_TOKEN: "Invalid or expired invitation token.",
          EXPIRED_TOKEN: "This invitation has expired.",
          USER_ALREADY_REGISTERED: "This email is already registered.",
        };
        return rejectWithValue(
          errorMap[reason] ||
            "An unexpected error occurred during registration.",
        );
      }
      return rejectWithValue(
        "Network error: failed to complete workspace integration. Please try again.",
      );
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
      return rejectWithValue(response.reason);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.reason || "UNKNOWN_ERROR");
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
      return rejectWithValue(response.reason);
    } catch (error: any) {
      console.log(error)
      return rejectWithValue(error.response?.data?.reason || "Login failed");
    }
  },
);

export const resendOtpCode = createAsyncThunk(
  "auth/resendOtp",
  async (_, { rejectWithValue }) => {
    try {
      const response = await AuthService.requestOtp();
      if (response.success) return;
      return rejectWithValue(response.reason || "Failed to resend OTP.");
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.reason || "Failed to resend OTP. Please try again.");
    }
  }
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
      return rejectWithValue(response.reason);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.reason || "Verification failed",
      );
    }
  },
);


export const verifyResetToken = createAsyncThunk(
  "auth/verifyResetToken",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await AuthService.verifyResetToken(token);
      if (response.success) return true;
      return rejectWithValue(response.reason || "INVALID_TOKEN");
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.reason || "INVALID_TOKEN");
    }
  }
);

export const requestPasswordResetLink = createAsyncThunk(
  "auth/requestResetLink",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await AuthService.forgotPassword(email);
      if (response.success) return true;
      return rejectWithValue(response.reason || "FAILED");
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.reason || "FAILED");
    }
  }
);

export const submitPasswordReset = createAsyncThunk(
  "auth/submitPasswordReset",
  async ({ password, token }: { password: string; token: string }, { rejectWithValue }) => {
    try {
      const response = await AuthService.resetPassword(password, token);
      if (response.success) return true;
      return rejectWithValue(response.reason || "FAILED");
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.reason || "FAILED");
    }
  }
);