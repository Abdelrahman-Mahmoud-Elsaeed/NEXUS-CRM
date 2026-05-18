import { Role as PrismaRole } from "@prisma-client";

export interface UserProfileDto {
  id: string;
  email: string;
  name: string | null;
  isVerified: boolean;
  isDisabled: boolean ;
  isDeleted: boolean;
  organizations: {
    id: string;
    role: PrismaRole;
    name: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}