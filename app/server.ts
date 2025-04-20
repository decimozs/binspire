import { redirect } from "react-router";
import { createHonoServer } from "react-router-hono-server/node";
import { getSession } from "./lib/sessions.server";
import { loginWithGoogle, signUpWithGoogle } from "./action/auth.server";
import type { GooglePayload } from "./lib/types";
import type { WSContext } from "hono/ws";
import { googleLoginAuth, googleSignupAuth } from "./lib/auth.server";

const clients = new Set<WSContext>();

export default await createHonoServer({
  useWebSocket: true,
  configure: (server, { upgradeWebSocket }) => {
    server.use("/auth/google/login", googleLoginAuth);

    server.use("/auth/google/signup", googleSignupAuth);

    server.get("/auth/google/signup", async (c) => {
      const token = c.get("token");
      const grantedScopes = c.get("granted-scopes");
      const userGoogle = c.get("user-google");

      const payload = {
        email: userGoogle?.email,
        name: userGoogle?.name,
        image: userGoogle?.picture,
        emailStatus: userGoogle?.verified_email,
        accountId: userGoogle?.id,
        token: token?.token,
        scopes: grantedScopes?.join(", "),
        expiresIn: token?.expires_in,
      } as GooglePayload;

      return await signUpWithGoogle(c, payload);
    });

    server.get("/auth/google/login", async (c) => {
      const token = c.get("token");
      const grantedScopes = c.get("granted-scopes");
      const userGoogle = c.get("user-google");

      const payload = {
        email: userGoogle?.email,
        name: userGoogle?.name,
        image: userGoogle?.picture,
        emailStatus: userGoogle?.verified_email,
        accountId: userGoogle?.id,
        token: token?.token,
        scopes: grantedScopes?.join(", "),
        expiresIn: token?.expires_in,
      } as GooglePayload;

      return await loginWithGoogle(c, payload);
    });

    server.get(
      "/ws",
      upgradeWebSocket((c) => ({
        // https://hono.dev/helpers/websocket
        onOpen(_, ws) {
          console.log("New connection ⬆️");
          clients.add(ws);
        },
        onMessage(event, ws) {
          console.log("Context", c.req.header("Cookie"));
          console.log("Event", event);
          console.log(`Message from client: ${event.data}`);
          // Broadcast to all clients except sender
          clients.forEach((client) => {
            if (client.readyState === 1) {
              client.send(`${event.data}`);
            }
          });
        },
        onClose(_, ws) {
          console.log("Connection closed");
          clients.delete(ws);
        },
      })),
    );
  },

  beforeAll: (app) => {
    app.use(async (c, next) => {
      const session = await getSession(c.req.header("cookie"));
      if (c.req.path.includes("/dashboard")) {
        if (!session.has("userId")) {
          return redirect("/login");
        }
      }

      return next();
    });
  },
});
