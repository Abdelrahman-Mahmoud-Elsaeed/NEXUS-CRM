import { z } from "zod";
import type { LucideIcon } from "lucide-react";

export const roleUpdateSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1, "Role name is required"),
  description: z.string().trim().min(1, "Role description is required"),
});

export type RoleUpdateFormValues = z.infer<typeof roleUpdateSchema>;

export interface RoleDefinitionDto {
  id: string;
  name: string;
  description: string;
  userCount: number;
  isSystemDefault: boolean;
}

export interface RoleItem extends RoleDefinitionDto {
  icon: LucideIcon;
}

export interface RoleUpdatePayload {
  name: string;
  description: string;
}

export interface UseRolesViewResult {
  selectedRole: string;
  rolesList: RoleItem[];
  isLoadingRoles: boolean;
  rolesError: string | null;
  onSelectRole: (roleId: string) => void;
  refetchRoles: () => Promise<void>;
}
