import { defineConfig } from "drizzle-kit";
import env from "@config/env";

export default defineConfig({
  schema: "./app/db/index.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env?.DATABASE_URL as string,
  },
});
