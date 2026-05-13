import { Server } from "http";
import app from "./src/app";
import { prisma } from "@config/db/prisma";
import { PORT } from "@config/env";

async function connectDatabase() {
  await prisma.$connect();
  console.log("Database connected successfully");
}


function handleGracefulShutdown(server: Server) {
  const shutdown = async (signal: string) => {
    console.log(`\nReceived ${signal}. Starting graceful shutdown...`);

    server.close(async () => {
      try {
        await prisma.$disconnect();
        console.log("Database disconnected. Server closed.");
        process.exit(0);
      } catch (err) {
        console.error("Error during database disconnection:", err);
        process.exit(1);
      }
    });
    setTimeout(() => {
      console.error("Could not close connections in time, forcefully shutting down");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}


async function bootstrap() {
  try {
    await connectDatabase();

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    handleGracefulShutdown(server);

  } catch (error) {
    console.error("Critical failure during bootstrap:");
    console.error(error);
    process.exit(1);
  }
}

bootstrap();