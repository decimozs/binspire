import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../db/index";
import env from "@config/env.server";

function createDb(url: string | undefined = env?.DATABASE_URL) {
  if (!url) {
    throw new Error("URL is not provided");
  }

  const client = postgres(url);

  return drizzle(client, { schema });
}

const db = createDb();

export default db;
