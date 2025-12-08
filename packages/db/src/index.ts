import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema/index";

const client = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client, schema });

export { eq };
