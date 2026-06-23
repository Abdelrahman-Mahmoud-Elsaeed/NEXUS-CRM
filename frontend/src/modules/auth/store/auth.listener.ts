import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { logout } from "./auth.slice";
import { signupUser, loginUser, initializeAuth } from "./auth.actions";
import { fetchUserOrganizations, configureWorkspace } from "@/modules/team/store/org.actions";
import { setOrganization } from "@/modules/team/store/org.slice";
import type { RootState } from "@/app/store";

export const authListenerMiddleware = createListenerMiddleware();

authListenerMiddleware.startListening({
  matcher: isAnyOf(
    signupUser.fulfilled, 
    loginUser.fulfilled,
    fetchUserOrganizations.fulfilled,
    configureWorkspace.fulfilled,
    setOrganization
  ),
  effect: (_, listenerApi) => {
    const orgState = (listenerApi.getState() as RootState).org;
    
    if (orgState.currentOrganizationId) {
      localStorage.setItem("current_organization_id", orgState.currentOrganizationId);
    }
    if (orgState.organizations.length > 0) {
      localStorage.setItem("user_organizations", JSON.stringify(orgState.organizations));
    }
    if (orgState.hasSetupWorkspace) {
      localStorage.setItem("has_setup_workspace", "true");
    }
  },
});

authListenerMiddleware.startListening({
  matcher: isAnyOf(logout, initializeAuth.rejected),
  effect: () => {
    [
      "access_token", 
      "current_organization_id", 
      "user_organizations", 
      "has_setup_workspace"
    ].forEach((key) => localStorage.removeItem(key));
  },
});