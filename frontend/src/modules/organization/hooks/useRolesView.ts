import { useCallback, useEffect, useState } from "react";
import { ShieldCheck, Users, TrendingUp, Eye } from "lucide-react";
import { useSelector } from "react-redux";
import { selectAuth } from "@/modules/auth/store/authSlice";
import { RolesViewService } from "@/modules/organization/services/rolesView.service";
import {
  type RoleDefinitionDto,
  type RoleItem,
  type UseRolesViewResult,
} from "@/modules/organization/types/rolesView.types";

const DEFAULT_ROLES: RoleItem[] = [
  {
    id: "role-1",
    name: "Workspace Admin",
    description: "Full access to all settings, billing, and member management.",
    userCount: 2,
    isSystemDefault: true,
    icon: ShieldCheck,
  },
  {
    id: "role-2",
    name: "Sales Manager",
    description: "Manage deals, pipelines, and view sales team analytics.",
    userCount: 5,
    isSystemDefault: false,
    icon: TrendingUp,
  },
  {
    id: "role-3",
    name: "Standard User",
    description: "Regular access to contacts and deals they are assigned to.",
    userCount: 18,
    isSystemDefault: false,
    icon: Users,
  },
  {
    id: "role-4",
    name: "Guest",
    description: "Read-only access to shared resources for external collaborators.",
    userCount: 4,
    isSystemDefault: false,
    icon: Eye,
  },
];

const ROLE_ICON_MAP: Record<string, RoleItem["icon"]> = {
  "role-1": ShieldCheck,
  "role-2": TrendingUp,
  "role-3": Users,
  "role-4": Eye,
};

const isAxiosErrorLike = (
  error: unknown,
): error is {
  response?: { data?: { message?: string } };
  message?: string;
} => {
  return (
    typeof error === "object" &&
    error !== null &&
    ("response" in error || "message" in error)
  );
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (isAxiosErrorLike(error)) {
    return error.response?.data?.message || error.message || fallback;
  }
  return fallback;
};

const mapRoleDefinitionToItem = (role: RoleDefinitionDto): RoleItem => ({
  ...role,
  icon: ROLE_ICON_MAP[role.id] ?? Users,
});

export function useRolesView(): UseRolesViewResult {
  const { currentOrganizationId } = useSelector(selectAuth);
  const [rolesList, setRolesList] = useState<RoleItem[]>(DEFAULT_ROLES);
  const [selectedRole, setSelectedRole] = useState<string>(DEFAULT_ROLES[0].id);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [rolesError, setRolesError] = useState<string | null>(null);

  const fetchRoles = useCallback(async () => {
    if (!currentOrganizationId) {
      setRolesError("No active organization selected");
      setRolesList(DEFAULT_ROLES);
      return;
    }

    setIsLoadingRoles(true);
    setRolesError(null);

    try {
      const response = await RolesViewService.fetchWorkspaceRoles(currentOrganizationId);
      if (response.success) {
        setRolesList(response.data.map(mapRoleDefinitionToItem));
      } else {
        setRolesError(response.reason || "Failed to load workspace roles");
        setRolesList(DEFAULT_ROLES);
      }
    } catch (error) {
      setRolesError(getErrorMessage(error, "Failed to load workspace roles"));
      setRolesList(DEFAULT_ROLES);
    } finally {
      setIsLoadingRoles(false);
    }
  }, [currentOrganizationId]);

  useEffect(() => {
    void fetchRoles();
  }, [fetchRoles]);

  const onSelectRole = useCallback((roleId: string) => {
    setSelectedRole(roleId);
  }, []);

  return {
    selectedRole,
    rolesList,
    isLoadingRoles,
    rolesError,
    onSelectRole,
    refetchRoles: fetchRoles,
  };
}
