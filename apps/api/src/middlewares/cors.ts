import { TRUSTED_ORIGINS } from "@/lib/constants";
import { cors } from "hono/cors";

export const corsMiddleware = cors({
  origin: TRUSTED_ORIGINS,
  credentials: true,
  allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
});
