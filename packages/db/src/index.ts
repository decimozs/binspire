import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema/index";
import { eq } from "drizzle-orm";

const client = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client, schema });

export { eq };
