import { RegisterRequestDto } from "@/modules/auth/auth.dto";
import { Prisma } from "@/shared/generated/client/client";

export const createUserQuery = (
  data: RegisterRequestDto,
  hashed: string,
): Prisma.UserCreateArgs => {
  return {
    data: {
      email: data.email,
      password: hashed,
      name: data.name,
      organizations: {
        create: {
          role: "OWNER",
          organization: {
            create: {
              name: `${data.name}'s Organization`,
            },
          },
        },
      },
      passwordHistory: {
        create: {
          password: hashed,
        },
      },
    },
    include: {
      organizations: {
        include: {
          organization: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  };
};
