import { UserProfileDto } from "./user-profile.dto";

export function mapUser(user: any): UserProfileDto {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    isDisabled: user.isDisabled,
    isDeleted: user.isDeleted,
    organizations: user.organizations.map((m: any) => ({
      id: m.organization.id,
      name: m.organization.name,
      role: m.role,
    })),
  };
}
