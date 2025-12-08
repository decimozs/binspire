import { cors } from "hono/cors";
import { TRUSTED_ORIGINS } from "@/lib/constants";

export const corsMiddleware = cors({
  origin: TRUSTED_ORIGINS,
  credentials: true,
  allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
});
