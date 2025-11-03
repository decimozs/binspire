import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

config({ path: "../../.env" });

export default defineConfig({
  schema: "./src/schema/index.ts",
  out: "./src/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
