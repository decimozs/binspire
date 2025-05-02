import { redirect } from "react-router";
import { createHonoServer } from "react-router-hono-server/node";
import { getSession } from "./lib/sessions.server";
import { loginWithGoogle, signUpWithGoogle } from "./action/auth.server";
import type { Broadcast, GooglePayload } from "./lib/types";
import type { WSContext } from "hono/ws";
import { googleLoginAuth, googleSignupAuth } from "./lib/auth.server";
import db from "./lib/db.server";
import { usersTable, verificationsTable } from "./db";

import { and, eq } from "drizzle-orm";
import { closeWindow } from "./lib/utils";

const clients = new Set<WSContext>();

export const broadcast = (message: object) => {
  const data = JSON.stringify(message);
  clients.forEach((client) => {
    if (client.readyState === 1) client.send(data);
  });
};

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

    server.get("/onboarding", async (c) => {
      const { email, token, type } = c.req.query();

      if (!token) return redirect(`/verification?type=${type}`);

      const validatedToken = await db.query.verificationsTable.findFirst({
        where: (table, { and, eq }) =>
          and(eq(table.value, token), eq(table.identifier, type)),
      });

      if (!validatedToken) {
        broadcast({
          transaction: "verification-status",
          type,
          status: false,
          reason: "Invalid token",
        });

        return c.html(closeWindow);
      }

      const verificationId = validatedToken?.id as string;
      const tokenExpiresTime = new Date(validatedToken?.expiresAt as Date);

      if (tokenExpiresTime < new Date()) {
        await db
          .delete(verificationsTable)
          .where(eq(verificationsTable.id, verificationId));

        broadcast({
          transaction: "verification-status",
          type,
          status: true,
          reason: "Expired token",
        });

        return c.html(closeWindow);
      }

      if (type === "email-verification") {
        await db
          .delete(verificationsTable)
          .where(
            and(
              eq(verificationsTable.value, token),
              eq(verificationsTable.identifier, type),
            ),
          );

        await db
          .update(usersTable)
          .set({ emailVerified: true })
          .where(eq(usersTable.email, email));
      }

      broadcast({
        transaction: "verification",
        status: true,
        type,
        email,
        token,
      });

      return c.html(closeWindow);
    });

    server.get(
      "/ws",
      upgradeWebSocket((c) => ({
        onOpen(_, ws) {
          console.log("New connection ⬆️");
          clients.add(ws);
        },
        onMessage(event, ws) {
          clients.forEach((client) => {
            if (client.readyState === 1) {
              client.send(`${event.data}`);
            }
          });
        },
        onClose(_, ws) {
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
