import { config } from "dotenv";
import { z } from "zod";

config({
  path: "../.env",
});

const envSchema = z.object({
  DATABASE_URL: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GMAIL_HOST: z.string(),
  GMAIL_USER: z.string(),
  GMAIL_PASS: z.string(),
  AUTH_SECRET: z.string(),
  MAP_TILER_KEY: z.string(),
  API_URL: z.string(),
  PORT: z.coerce.number().default(8080),
});

/* eslint-disable node/no-process-env */
const { data: env, error } = envSchema.safeParse(process.env);

if (error) {
  console.error("Invalid environment variables");
  console.error(JSON.stringify(error.flatten().fieldErrors, null, 2));
  process.exit(1);
}

export default env;
