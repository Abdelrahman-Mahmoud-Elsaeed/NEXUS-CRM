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

export interface AuthState {
  isAuthenticated: boolean;
  isVerified: boolean;
  token: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  isSubmittingInvite: boolean;
  inviteAcceptanceError: string | null;
  isVerifyingOtp: boolean;
  isResendingOtp: boolean;
  isVerifyingResetToken: boolean;
  isResettingPassword: boolean;
  resetPasswordError: string | null;
  error: string | null;
  otpError: string | null;
  isSendingResetLink: boolean;
  forgotPasswordError: string | null;
  isLoggingIn: boolean;
  loginError: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isVerified: false,
  token: null,
  status: "idle",
  isSubmittingInvite: false,
  inviteAcceptanceError: null,
  isVerifyingOtp: false,
  isResendingOtp: false,
  otpError: null,
  error: null,
  isVerifyingResetToken: true,
  isResettingPassword: false,
  resetPasswordError: null,
  isLoggingIn: false,
  loginError: null,
  isSendingResetLink: false,
  forgotPasswordError: null,
};

const setSessionFulfilled = (state: AuthState, action: any) => {
  state.status = "succeeded";
  state.isAuthenticated = true;
  state.token = action.payload.tokens.accessToken;
  state.isVerified = action.payload.user.isVerified;
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: () => {
      localStorage.removeItem("access_token");
      return { ...initialState, status: "failed" as const };
    },
    setUnverified: (state) => {
      state.isVerified = false;
    },
    tokenRefreshed: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.status = "loading";
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.isVerified = action.payload.user.isVerified;
      })
      .addCase(initializeAuth.rejected, () => {
        localStorage.removeItem("access_token");
        return { ...initialState, status: "failed" };
      })
      .addCase(signupUser.pending, (state) => {
        state.error = null;
      })
      .addCase(signupUser.fulfilled, setSessionFulfilled)
      .addCase(signupUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })

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
        switch (action.payload) {
          case "INVALID_CREDENTIALS":
            state.loginError = "Invalid email or password.";
            break;
          case "USER_DISABLED":
            state.loginError = "This account has been disabled.";
            break;
          default:
            state.loginError =
              (action.payload as string) ||
              "An unexpected error occurred. Please try again.";
        }
      })
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
        }
      })
      .addCase(verifyUserOtp.rejected, (state, action) => {
        state.isVerifyingOtp = false;
        state.otpError = action.payload as string;
      })
      .addCase(acceptWorkspaceInvitation.pending, (state) => {
        state.isSubmittingInvite = true;
        state.inviteAcceptanceError = null;
      })
      .addCase(acceptWorkspaceInvitation.fulfilled, (state, action) => {
        state.isSubmittingInvite = false;
        state.isAuthenticated = true;
        if (action.payload?.user) {
          state.isVerified = action.payload.user.isVerified;
        }
      })
      .addCase(acceptWorkspaceInvitation.rejected, (state, action) => {
        state.isSubmittingInvite = false;
        state.inviteAcceptanceError = action.payload as string;
      })
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
      .addCase(verifyResetToken.pending, (state) => {
        state.isVerifyingResetToken = true;
        state.resetPasswordError = null;
      })
      .addCase(verifyResetToken.fulfilled, (state) => {
        state.isVerifyingResetToken = false;
      })
      .addCase(verifyResetToken.rejected, (state) => {
        state.isVerifyingResetToken = false;
        state.resetPasswordError = "INVALID_TOKEN";
      })

      // Submit Password Change Lifecycle
      .addCase(submitPasswordReset.pending, (state) => {
        state.isResettingPassword = true;
        state.resetPasswordError = null;
      })
      .addCase(submitPasswordReset.fulfilled, (state) => {
        state.isResettingPassword = false;
      })
      .addCase(submitPasswordReset.rejected, (state, action) => {
        state.isResettingPassword = false;

        // Normalize generic business errors at the store boundary
        switch (action.payload) {
          case "PASSWORD_REUSE_NOT_ALLOWED":
            state.resetPasswordError = "PASSWORD_REUSE_NOT_ALLOWED"; // Handled in hook field attach
            break;
          case "INVALID_TOKEN":
            state.resetPasswordError =
              "This reset link has expired or has already been used. Please request a new one.";
            break;
          case "USER_NOT_FOUND":
            state.resetPasswordError =
              "We couldn't find an account associated with this request.";
            break;
          default:
            state.resetPasswordError =
              "Something went wrong while resetting your password. Please try again.";
        }
      })
      .addCase(requestPasswordResetLink.pending, (state) => {
        state.isSendingResetLink = true;
        state.forgotPasswordError = null;
      })
      .addCase(requestPasswordResetLink.fulfilled, (state) => {
        state.isSendingResetLink = false;
      })
      .addCase(requestPasswordResetLink.rejected, (state, action) => {
        state.isSendingResetLink = false;

        if (action.payload === "USER_NOT_FOUND") {
          state.forgotPasswordError =
            "We couldn't find an account associated with that email.";
        } else {
          state.forgotPasswordError =
            "An unexpected error occurred. Please try again.";
        }
      });
  },
});

export const { logout, setUnverified, tokenRefreshed } = authSlice.actions;
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export default authSlice.reducer;
