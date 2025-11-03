import { logger } from "@binspire/logging";
import { PATH_CONFIG } from "./lib/constants";
import "@binspire/config/load-env";
import app from "./features/app";

function main() {
  try {
    Bun.serve({
      idleTimeout: 255,
      port: Bun.env.API_PORT,
      fetch: app.fetch,
    });
    logger.info(
      `Server is running on http://localhost:${Bun.env.API_PORT}${PATH_CONFIG.VERSION}${PATH_CONFIG.BASE_PATH}`,
    );
  } catch (error) {
    const err = error as Error;
    logger.error(`Error starting server: ${err.message}`);
    process.exit(1);
  }
}

main();
