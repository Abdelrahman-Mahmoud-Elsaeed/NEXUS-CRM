/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"; 
import { AuthService } from "../services/auth.service";
import {
  type LoginRequestDto,
  type RegisterRequestDto,
} from "@/shared/types/auth.types";

interface AuthState {
  isAuthenticated: boolean;
  isVerified: boolean;
  token: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isVerified: false,
  token: null,
  status: "idle",
  error: null,
};

// 1. New Initialization Thunk
export const initializeAuth = createAsyncThunk(
  "auth/initializeAuth",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("access_token");
    if (!token) return rejectWithValue("NO_TOKEN");

    try {
      const response = await AuthService.verifyAccessToken();
      if (response.success) {
        return { token, user: response.data.user };
      } else {
        return rejectWithValue(response.reason);
      }
    } catch (error: any) {
      return rejectWithValue("INVALID_TOKEN");
    }
  }
);

// 2. Signup Thunk
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (credentials: RegisterRequestDto, { rejectWithValue }) => {
    try {
      const response = await AuthService.register(credentials);
      if (response.success) {
        localStorage.setItem("access_token", response.data.tokens.accessToken);
        return response.data;
      } else {
        return rejectWithValue(response.reason);
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.reason || "UNKNOWN_ERROR");
    }
  },
);

// 3. Login Thunk
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: LoginRequestDto, { rejectWithValue }) => {
    try {
      const response = await AuthService.login(credentials);
      if (response.success) {
        localStorage.setItem("access_token", response.data.tokens.accessToken);
        return response.data;
      } else {
        return rejectWithValue(response.reason);
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.reason || "Login failed");
    }
  },
);

// 4. Verify OTP Thunk
export const verifyUserOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (otp: string, { rejectWithValue }) => {
    try {
      const response = await AuthService.verifyEmail(otp);
      if (response.success) {
        if (response.data.tokens?.accessToken) {
          localStorage.setItem("access_token", response.data.tokens.accessToken);
        }
        return response.data;
      } else {
        return rejectWithValue(response.reason);
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.reason || "Verification failed");
    }
  },
);


export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("access_token");
      state.isAuthenticated = false;
      state.isVerified = false;
      state.token = null;
      state.status = "failed";
      state.error = null;
    },
    setUnverified: (state) => {
      state.isVerified = false;
    },
    tokenRefreshed: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    }
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
      .addCase(initializeAuth.rejected, (state) => {
        localStorage.removeItem("access_token");
        state.status = "failed";
        state.isAuthenticated = false;
        state.isVerified = false;
        state.token = null;
      })

      .addCase(signupUser.pending, (state) => {
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.token = action.payload.tokens.accessToken;
        state.isVerified = action.payload.user.isVerified;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(loginUser.pending, (state) => {
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.token = action.payload.tokens.accessToken;
        state.isVerified = action.payload.user.isVerified;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(verifyUserOtp.pending, (state) => {
        state.error = null;
      })
      .addCase(verifyUserOtp.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isVerified = true;
        if (action.payload.tokens?.accessToken) {
          state.token = action.payload.tokens.accessToken;
        }
      })
      .addCase(verifyUserOtp.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { logout, setUnverified, tokenRefreshed } = authSlice.actions; // Export tokenRefreshed
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export default authSlice.reducer;