import { SessionHandler } from "@/handlers";
import { factory } from "@/lib/factory";

export const sessionRoutes = factory
  .createApp()
  .get("/", ...SessionHandler.getSession);
