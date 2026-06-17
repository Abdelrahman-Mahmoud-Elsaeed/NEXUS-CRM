/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  initializeAuth,
  signupUser,
  loginUser,
  verifyUserOtp,
  acceptWorkspaceInvitation,
  resendOtpCode,
  submitPasswordReset,
  verifyResetToken,
  requestPasswordResetLink,
} from "./auth.actions";

// (Adjust this path if your Role enum/type lives somewhere else)
import type { Role } from "../types/auth.types"; 

export interface UserProfileDto {
  id: string;
  email: string;
  name: string | null;
  isVerified: boolean;
  isDisabled: boolean;
  isDeleted: boolean;
  organizations: {
    id: string;
    role: Role; 
    name: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: UserProfileDto | null;
  isAuthenticated: boolean;
  isVerified: boolean;
  token: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";

  isSubmittingInvite: boolean;
  inviteAcceptanceError: string | null;

  isVerifyingOtp: boolean;
  isResendingOtp: boolean;
  otpError: string | null;

  isVerifyingResetToken: boolean;
  isResettingPassword: boolean;
  resetPasswordError: string | null;

  isSendingResetLink: boolean;
  forgotPasswordError: string | null;

  isLoggingIn: boolean;
  loginError: string | null;

  acceptInvitation: boolean;
  error: string | null;
}

// Helper to safely parse the cached user from localStorage
const getCachedUser = (): UserProfileDto | null => {
  try {
    const cached = localStorage.getItem("auth_user");
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.error("Failed to parse cached user", error);
    return null;
  }
};

const initialState: AuthState = {
  user: getCachedUser(),
  isAuthenticated: !!localStorage.getItem("access_token"),
  isVerified: false,
  token: localStorage.getItem("access_token") || null,
  status: "idle",

  isSubmittingInvite: false,
  inviteAcceptanceError: null,

  isVerifyingOtp: false,
  isResendingOtp: false,
  otpError: null,

  isVerifyingResetToken: true,
  isResettingPassword: false,
  resetPasswordError: null,

  isSendingResetLink: false,
  forgotPasswordError: null,

  isLoggingIn: false,
  loginError: null,

  acceptInvitation: localStorage.getItem("accept_invitation") === "true",
  error: null,
};

const setSessionFulfilled = (state: AuthState, action: any) => {
  state.status = "succeeded";
  state.isAuthenticated = true;
  state.token = action.payload.tokens?.accessToken || action.payload.token;
  state.isVerified = action.payload.user.isVerified;
  
  // Cast to UserProfileDto to fix Error 1 (missing organizations in payload type)
  state.user = action.payload.user as UserProfileDto; 
  
  if (state.token) localStorage.setItem("access_token", state.token);
  localStorage.setItem("auth_user", JSON.stringify(action.payload.user)); 
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: () => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("auth_user");
      return { ...initialState, status: "failed" as const, user: null, token: null, isAuthenticated: false };
    },
    setUnverified: (state) => {
      state.isVerified = false;
      if (state.user) {
        state.user.isVerified = false;
        localStorage.setItem("auth_user", JSON.stringify(state.user));
      }
    },
    tokenRefreshed: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("access_token", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder

      // ================= INIT =================
      .addCase(initializeAuth.pending, (state) => {
        state.status = "loading";
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.isVerified = action.payload.user.isVerified;
        state.user = action.payload.user as UserProfileDto;
        localStorage.setItem("auth_user", JSON.stringify(action.payload.user));
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("auth_user");
        state.status = "failed";
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })

      // ================= SIGNUP =================
      .addCase(signupUser.pending, (state) => {
        state.error = null;
      })
      .addCase(signupUser.fulfilled, setSessionFulfilled)
      .addCase(signupUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // ================= LOGIN =================
      .addCase(loginUser.pending, (state) => {
        state.isLoggingIn = true;
        state.loginError = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoggingIn = false;
        setSessionFulfilled(state, action);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoggingIn = false;
        state.loginError = action.payload as string;
      })

      // ================= OTP =================
      .addCase(verifyUserOtp.pending, (state) => {
        state.isVerifyingOtp = true;
        state.otpError = null;
      })
      .addCase(verifyUserOtp.fulfilled, (state, action) => {
        state.isVerifyingOtp = false;
        state.status = "succeeded";
        state.isVerified = true;

        if (action.payload.tokens?.accessToken) {
          state.token = action.payload.tokens.accessToken;
          localStorage.setItem("access_token", state.token);
        }

        // Safely check if 'user' exists in payload to fix Errors 2, 3, 4
        const payloadData = action.payload as any;
        
        if (payloadData.user) {
          state.user = payloadData.user as UserProfileDto;
          localStorage.setItem("auth_user", JSON.stringify(payloadData.user));
        } else if (state.user) {
          // If the OTP just returns tokens, we simply update the local cached user to be verified
          state.user.isVerified = true;
          localStorage.setItem("auth_user", JSON.stringify(state.user));
        }
      })
      .addCase(verifyUserOtp.rejected, (state, action) => {
        state.isVerifyingOtp = false;
        state.otpError = action.payload as string;
      })

      // ================= INVITE =================
      .addCase(acceptWorkspaceInvitation.pending, (state) => {
        state.isSubmittingInvite = true;
        state.inviteAcceptanceError = null;
      })
      .addCase(acceptWorkspaceInvitation.fulfilled, (state, action) => {
        state.isSubmittingInvite = false;
        state.isAuthenticated = true;

        const payloadData = action.payload as any;
        if (payloadData?.user) {
          state.isVerified = payloadData.user.isVerified;
          state.user = payloadData.user as UserProfileDto;
          localStorage.setItem("auth_user", JSON.stringify(payloadData.user));
        }
      })
      .addCase(acceptWorkspaceInvitation.rejected, (state, action) => {
        state.isSubmittingInvite = false;
        state.inviteAcceptanceError = action.payload as string;
      })

      // ================= RESEND OTP =================
      .addCase(resendOtpCode.pending, (state) => {
        state.isResendingOtp = true;
        state.otpError = null;
      })
      .addCase(resendOtpCode.fulfilled, (state) => {
        state.isResendingOtp = false;
      })
      .addCase(resendOtpCode.rejected, (state, action) => {
        state.isResendingOtp = false;
        state.otpError = action.payload as string;
      })

      // ================= RESET TOKEN =================
      .addCase(verifyResetToken.pending, (state) => {
        state.isVerifyingResetToken = true;
        state.resetPasswordError = null;
      })
      .addCase(verifyResetToken.fulfilled, (state) => {
        state.isVerifyingResetToken = false;
      })
      .addCase(verifyResetToken.rejected, (state, action) => {
        state.isVerifyingResetToken = false;
        state.resetPasswordError = action.payload as string;
      })

      // ================= RESET PASSWORD =================
      .addCase(submitPasswordReset.pending, (state) => {
        state.isResettingPassword = true;
        state.resetPasswordError = null;
      })
      .addCase(submitPasswordReset.fulfilled, (state) => {
        state.isResettingPassword = false;
      })
      .addCase(submitPasswordReset.rejected, (state, action) => {
        state.isResettingPassword = false;
        state.resetPasswordError = action.payload as string;
      })

      // ================= FORGOT PASSWORD =================
      .addCase(requestPasswordResetLink.pending, (state) => {
        state.isSendingResetLink = true;
        state.forgotPasswordError = null;
      })
      .addCase(requestPasswordResetLink.fulfilled, (state) => {
        state.isSendingResetLink = false;
      })
      .addCase(requestPasswordResetLink.rejected, (state, action) => {
        state.isSendingResetLink = false;
        state.forgotPasswordError = action.payload as string;
      });
  },
});

export const { logout, setUnverified, tokenRefreshed } = authSlice.actions;
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export default authSlice.reducer;