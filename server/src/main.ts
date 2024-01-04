import { FastifyInstance } from "fastify";
import createServer from "./utils/createServer";
import logger from "./utils/logger";
import { disconnectFromDb } from "./utils/db";

function gracefulShutdown(signal: string, app: FastifyInstance) {
  process.on(signal, async () => {
    logger.info(`Received ${signal}. Shutting down...`);

    await app.close();
    await disconnectFromDb();

    logger.info("My work here is done. Goodbye!");
    process.exit(0);
  });
}

async function main() {
  const app = createServer();

  try {
    const url = await app.listen({ port: 4000, host: "0.0.0.0" });
    logger.info(`Server is ready at ${url}`);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }

  const signals = ["SIGINT", "SIGTERM", "SIGQUIT"];

  for (const signal of signals) {
    gracefulShutdown(signal, app);
  }
}

main();
