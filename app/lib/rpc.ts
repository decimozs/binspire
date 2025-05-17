import { hc } from "hono/client";
import type { AppRouter } from "@/server";

export const rpc = hc<AppRouter>("http://localhost:5173/api");
