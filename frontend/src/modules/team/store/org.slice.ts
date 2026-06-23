/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  fetchUserOrganizations,
  configureWorkspace,
  type CachedOrganization,
} from "./org.actions";
import {
  signupUser,
  loginUser,
  initializeAuth,
} from "@/modules/auth/store/auth.actions";
import { logout } from "@/modules/auth/store/auth.slice";

export interface OrgState {
  hasSetupWorkspace: boolean;
  isConfiguringWorkspace: boolean;
  currentOrganizationId: string | null;
  organizations: CachedOrganization[];
  status: "idle" | "loading" | "succeeded" | "failed";
  workspaceConfigError: string | null;
  error: string | null;
}

const loadCachedOrgs = (): CachedOrganization[] => {
  try {
    const cached = localStorage.getItem("user_organizations");
    return cached ? JSON.parse(cached) : [];
  } catch {
    return [];
  }
};

const initialState: OrgState = {
  hasSetupWorkspace: localStorage.getItem("has_setup_workspace") === "true",
  isConfiguringWorkspace: false,
  currentOrganizationId: localStorage.getItem("current_organization_id"),
  organizations: [],
  status: "idle",
  workspaceConfigError: null,
  error: null,
};

const clearWorkspacePersistence = () => {
  [
    "current_organization_id",
    "user_organizations",
    "has_setup_workspace",
  ].forEach((k) => localStorage.removeItem(k));
};

const handleIncomingOrgs = (
  state: OrgState,
  organizations: any[],
  defaultRole: "Owner" | "Member" = "Member",
) => {
  state.organizations = organizations.map((org: any) => ({
    id: org.id,
    name: org.name,
    role: org.role || defaultRole,
    avatar: org.avatar ?? null,
  }));
  localStorage.setItem(
    "user_organizations",
    JSON.stringify(state.organizations),
  );

  if (state.organizations.length > 0 && !state.currentOrganizationId) {
    state.currentOrganizationId = state.organizations[0].id;
    localStorage.setItem("current_organization_id", state.organizations[0].id);
  }
};

export const orgSlice = createSlice({
  name: "org",
  initialState,
  reducers: {
    setOrganization: (state, action: PayloadAction<string>) => {
      state.currentOrganizationId = action.payload;
      localStorage.setItem("current_organization_id", action.payload);
    },
    clearOrgCache: () => {
      clearWorkspacePersistence();
      return {
        ...initialState,
        organizations: [],
        currentOrganizationId: null,
        status: "failed" as const,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Multi-Tenant Organizations
      .addCase(fetchUserOrganizations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserOrganizations.fulfilled, (state, action) => {
        state.status = "succeeded";

        const payloadData = action.payload || { organizations: [] };
        handleIncomingOrgs(state, payloadData.organizations, "Member");
      })
      .addCase(fetchUserOrganizations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Configure Active Settings Profiling
      .addCase(configureWorkspace.pending, (state) => {
        state.isConfiguringWorkspace = true;
        state.workspaceConfigError = null;
      })
      .addCase(configureWorkspace.fulfilled, (state, action) => {
        state.isConfiguringWorkspace = false;
        const updated = action.payload;
        const targetOrg = state.organizations.find((o) => o.id === updated.id);
        if (targetOrg) {
          targetOrg.name = updated.name;
          if (updated.avatar !== null) {
            targetOrg.avatar = updated.avatar;
          }
        }
        localStorage.setItem(
          "user_organizations",
          JSON.stringify(state.organizations),
        );
      })
      .addCase(configureWorkspace.rejected, (state, action) => {
        state.isConfiguringWorkspace = false;
        state.workspaceConfigError =
          (action.payload as string) ||
          "Failed to configure workspace profiles.";
      })

      // Cross-Slice App Lifecycle Auth Integrations
      .addCase(signupUser.fulfilled, (state, action) => {
        handleIncomingOrgs(
          state,
          action.payload.user.organizations || [],
          "Owner",
        );
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        handleIncomingOrgs(
          state,
          action.payload.user.organizations || [],
          "Member",
        );
      })
      .addCase(initializeAuth.fulfilled, (state) => {
        state.currentOrganizationId ||= localStorage.getItem(
          "current_organization_id",
        );
        if (state.organizations.length === 0)
          state.organizations = loadCachedOrgs();
      })

      .addCase(logout, () => {
        clearWorkspacePersistence();
        return {
          ...initialState,
          organizations: [],
          currentOrganizationId: null,
        };
      });
  },
});

export const { setOrganization, clearOrgCache } = orgSlice.actions;
export const selectOrg = (state: { org: OrgState }) => state.org;
export default orgSlice.reducer;
