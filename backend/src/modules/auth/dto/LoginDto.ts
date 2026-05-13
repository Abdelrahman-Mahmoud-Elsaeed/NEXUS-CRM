import { Role as PrismaRole } from "@prisma-client";

export type LoginRequestDto = {
  email: string;
  password: string;
};

export type LoginResponseDto = {
  id: string;
  email: string;
  name: string | null;
  isVerified: boolean;
  updatedAt: Date;

  organizations: {
    id: string;
    role: PrismaRole;
    name: string;
  }[];

  createdAt: Date;
};

export type LoginResult =
  | { success: true; data: LoginResponseDto  }
  | { success: false; reason: "INVALID_CREDENTIALS" };
