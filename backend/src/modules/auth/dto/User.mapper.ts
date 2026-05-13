import { LoginResponseDto } from "./LoginDto";

export function mapUser(user: any): LoginResponseDto {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,

    organizations: user.organizations.map((m: any) => ({
      id: m.organization.id,
      name: m.organization.name,
      role: m.role,
    })),
  };
}
