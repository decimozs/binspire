import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { reactRouterHonoServer } from "react-router-hono-server/dev";

export default defineConfig({
  plugins: [
    reactRouterHonoServer({
      runtime: "node",
    }),
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
  ],
});
