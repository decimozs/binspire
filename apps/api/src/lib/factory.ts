import { createFactory } from "hono/factory";
import type { AppBindings } from "./types";

export const factory = createFactory<AppBindings>();
