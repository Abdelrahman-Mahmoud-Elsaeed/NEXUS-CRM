/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { AuthService } from "../services/auth.service";
import {
  type LoginRequestDto,
  type RegisterRequestDto,
} from "@/modules/auth/types/auth.types";
import { OrganizationService } from "@/modules/organization/service/organization.service";

interface CachedOrganization {
  id: string;
  name: string;
  role: string;
  avatar?: string | null;
}

interface AuthState {
  isAuthenticated: boolean;
  isVerified: boolean;
  hasSetupWorkspace: boolean;
  isConfiguringWorkspace: boolean;
  token: string | null;
  currentOrganizationId: string | null;
  organizations: CachedOrganization[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

interface UserPayload {
  id: string;
  email: string;
  isVerified: boolean;
  name?: string;
  organizations?: CachedOrganization[];
}

const loadCachedOrgs = (): CachedOrganization[] => {
  try {
    const cached = localStorage.getItem("user_organizations");
    return cached ? JSON.parse(cached) : [];
  } catch {
    return [];
  }
};

const initialState: AuthState = {
  isAuthenticated: false,
  isVerified: false,
  hasSetupWorkspace: localStorage.getItem("has_setup_workspace") === "true",
  isConfiguringWorkspace: false,
  token: null,
  currentOrganizationId: localStorage.getItem("current_organization_id"),
  organizations: loadCachedOrgs(),
  status: "idle",
  error: null,
};

export const fetchUserOrganizations = createAsyncThunk(
  "auth/fetchOrganizations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await OrganizationService.getUserOrganizations();
      if (response.success) {
        return response.data; 
      }
      return rejectWithValue(response.reason || "Failed to fetch organizations");
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.reason || "UNKNOWN_ERROR");
    }
  }
);

export const configureWorkspace = createAsyncThunk(
  "auth/configureWorkspace",
  async (
    payload: { orgId: string; name: string; avatarFile: File | null },
    { rejectWithValue },
  ) => {
    try {
      await OrganizationService.updateOrganizationName(
        payload.orgId,
        payload.name,
      );

      let detectedAvatarUrl: string | null = null;

      if (payload.avatarFile) {
        const uploadResponse = await OrganizationService.uploadAvatar(
          payload.avatarFile,
        );
        if (uploadResponse.success && uploadResponse.data?.file?.url) {
          detectedAvatarUrl = uploadResponse.data.file.url;
        }
      }

      return { name: payload.name, avatar: detectedAvatarUrl };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.reason || "Workspace configuration failed.",
      );
    }
  },
);

export const initializeAuth = createAsyncThunk(
  "auth/initializeAuth",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("access_token");
    if (!token) return rejectWithValue("NO_TOKEN");
    try {
      const response = await AuthService.verifyAccessToken();
      if (response.success) {
        return { token, user: response.data.user as UserPayload };
      } else {
        return rejectWithValue(response.reason);
      }
    } catch (error: any) {
      return rejectWithValue("INVALID_TOKEN");
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
      } else {
        return rejectWithValue(response.reason);
      }
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
      } else {
        return rejectWithValue(response.reason);
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.reason || "Verification failed",
      );
    }
  },
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("current_organization_id");
      localStorage.removeItem("user_organizations");
      localStorage.removeItem("has_setup_workspace");
      state.isAuthenticated = false;
      state.isVerified = false;
      state.hasSetupWorkspace = false;
      state.token = null;
      state.currentOrganizationId = null;
      state.organizations = [];
      state.status = "failed";
      state.error = null;
    },
    setUnverified: (state) => {
      state.isVerified = false;
    },
    tokenRefreshed: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
    setOrganization: (state, action: PayloadAction<string>) => {
      state.currentOrganizationId = action.payload;
      localStorage.setItem("current_organization_id", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // --- FETCH ORGANIZATIONS CASES ---
      .addCase(fetchUserOrganizations.fulfilled, (state, action) => {
        const rawOrgs = action.payload || [];
        const normalizedOrgs = rawOrgs.organizations.map((org: any) => ({
          id: org.id,
          name: org.name,
          role: org.role || "MEMBER", 
          avatar: org.avatar ?? null,
        }));

        state.organizations = normalizedOrgs;
        localStorage.setItem("user_organizations", JSON.stringify(normalizedOrgs));

        if (normalizedOrgs.length > 0 && !state.currentOrganizationId) {
          state.currentOrganizationId = normalizedOrgs[0].id;
          localStorage.setItem("current_organization_id", normalizedOrgs[0].id);
        }
      })

      // --- WORKSPACE CONFIGURATION CASES ---
      .addCase(configureWorkspace.pending, (state) => {
        state.isConfiguringWorkspace = true;
        state.error = null;
      })
      .addCase(configureWorkspace.fulfilled, (state, action) => {
        state.isConfiguringWorkspace = false;
        state.hasSetupWorkspace = true;
        localStorage.setItem("has_setup_workspace", "true");

        state.organizations = state.organizations.map((org) =>
          org.id === state.currentOrganizationId
            ? {
                ...org,
                name: action.payload.name,
                avatar:
                  action.payload.avatar !== null
                    ? action.payload.avatar
                    : org.avatar,
              }
            : org,
        );

        localStorage.setItem(
          "user_organizations",
          JSON.stringify(state.organizations),
        );
      })
      .addCase(configureWorkspace.rejected, (state, action) => {
        state.isConfiguringWorkspace = false;
        state.error = action.payload as string;
      })

      // --- INITIALIZE AUTH CASES ---
      .addCase(initializeAuth.pending, (state) => {
        state.status = "loading";
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.isVerified = action.payload.user.isVerified;

        if (!state.currentOrganizationId) {
          state.currentOrganizationId = localStorage.getItem(
            "current_organization_id",
          );
        }
        if (state.organizations.length === 0) {
          state.organizations = loadCachedOrgs();
        }
      })
      .addCase(initializeAuth.rejected, (state) => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("current_organization_id");
        localStorage.removeItem("user_organizations");
        localStorage.removeItem("has_setup_workspace");
        state.status = "failed";
        state.isAuthenticated = false;
        state.isVerified = false;
        state.hasSetupWorkspace = false;
        state.token = null;
        state.currentOrganizationId = null;
        state.organizations = [];
      })

      // --- SIGNUP CASES ---
      .addCase(signupUser.pending, (state) => {
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.token = action.payload.tokens.accessToken;
        state.isVerified = action.payload.user.isVerified;
        
        const rawOrgs = action.payload.user.organizations || [];
        const normalizedOrgs = rawOrgs.map((org: any) => ({
          id: org.id,
          name: org.name,
          role: org.role || "OWNER", // Default to owner on signup if omitted
          avatar: org.avatar ?? null,
        }));

        state.organizations = normalizedOrgs;
        localStorage.setItem(
          "user_organizations",
          JSON.stringify(normalizedOrgs),
        );

        if (normalizedOrgs.length > 0) {
          state.currentOrganizationId = normalizedOrgs[0].id;
          localStorage.setItem("current_organization_id", normalizedOrgs[0].id);
        }
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      
      // --- LOGIN CASES ---
      .addCase(loginUser.pending, (state) => {
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.token = action.payload.tokens.accessToken;
        state.isVerified = action.payload.user.isVerified;
        
        const rawOrgs = action.payload.user.organizations || [];
        const normalizedOrgs = rawOrgs.map((org: any) => ({
          id: org.id,
          name: org.name,
          role: org.role || "MEMBER",
          avatar: org.avatar ?? null,
        }));

        state.organizations = normalizedOrgs;
        localStorage.setItem(
          "user_organizations",
          JSON.stringify(normalizedOrgs),
        );

        if (normalizedOrgs.length > 0) {
          state.currentOrganizationId = normalizedOrgs[0].id;
          localStorage.setItem("current_organization_id", normalizedOrgs[0].id);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // --- VERIFY OTP CASES ---
      .addCase(verifyUserOtp.pending, (state) => {
        state.error = null;
      })
      .addCase(verifyUserOtp.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isVerified = true;
        if (action.payload.tokens?.accessToken) {
          state.token = action.payload.tokens.accessToken;
        }
        if (!state.currentOrganizationId) {
          state.currentOrganizationId = localStorage.getItem(
            "current_organization_id",
          );
        }
      })
      .addCase(verifyUserOtp.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { logout, setUnverified, tokenRefreshed, setOrganization } =
  authSlice.actions;
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export default authSlice.reducer;