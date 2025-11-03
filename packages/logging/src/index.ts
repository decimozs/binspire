import "@binspire/config/load-env";
import { pinoLogger } from "hono-pino";
import pino from "pino";
import pretty from "pino-pretty";

export function logging() {
  return pinoLogger({
    pino: pino(
      {
        level: "info",
      },
      Bun.env.NODE_ENV === "production" ? undefined : pretty(),
    ),
  });
}

export const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
});
