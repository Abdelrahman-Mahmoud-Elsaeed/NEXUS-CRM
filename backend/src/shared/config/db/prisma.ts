import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma-client";
import { DATABASE_URL , NODE_ENV} from "@config/env";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const connectionString = DATABASE_URL;

const prismaClientSingleton = () => {
  const adapter = new PrismaPg({
    connectionString,
  });

  return new PrismaClient({
    adapter,
    log:
      NODE_ENV === "development"
        ? ["warn", "error"]
        : ["error"],
  });
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
