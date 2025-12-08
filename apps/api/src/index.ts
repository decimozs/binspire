import { logger } from "@binspire/logging";
import { PATH_CONFIG } from "./lib/constants";
import "@binspire/config/load-env";
import app from "./features/app";

logger.info(
  `Server is running on http://localhost:${Bun.env.API_PORT}${PATH_CONFIG.VERSION}${PATH_CONFIG.BASE_PATH}`,
);

export default app;
