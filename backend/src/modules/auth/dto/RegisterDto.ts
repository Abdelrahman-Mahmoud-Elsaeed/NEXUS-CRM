import { Role as PrismaRole } from "@prisma-client";

export interface RegisterRequistDto {
  email: string;
  password: string;
  name?: string;
}

export type RegisterResponseDto =
  | {
      success: true;
      data: {
        id: string;
        email: string;
        name: string | null;
        isVerified: boolean;

        organizations: {
          id: string;
          role: PrismaRole;
          name: string;
        }[];

        createdAt: Date;
      };
    }
  | {
      success: false;
      reason: "EMAIL_IS_USED";
    };