import { broadcast, clients } from "./lib/ws.server";
import { createHonoServer } from "react-router-hono-server/node";
import { isUserSessionExist } from "./api/middleware.server";
import notificationRoutes from "@/api/route/notifications.server";
import trashbinRoutes from "@/api/route/trashbins.server";
import userRoutes from "@/api/route/users.server";
import accountRoutes from "@/api/route/accounts.route.server";
import authRoutes from "@/api/route/auth.routes.server";
import orsRoutes from "@/api/route/ors.route.server";
import { googleSignupAuth } from "./lib/auth.server";
import type { GooglePayload } from "./lib/types";
import { signUpWithGoogle } from "./action/auth.server";
import { redirect } from "react-router";
import db from "./lib/db.server";
import { closeWindow } from "./lib/utils";
import { usersTable, verificationsTable } from "./db";
import { and, eq } from "drizzle-orm";

const routes = [
  userRoutes,
  accountRoutes,
  trashbinRoutes,
  notificationRoutes,
  orsRoutes,
  authRoutes,
] as const;

export default await createHonoServer({
  useWebSocket: true,
  configure(app, { upgradeWebSocket }) {
    app.use("/api/auth/google/signup", googleSignupAuth);
    app.get("/api/auth/google/signup", async (c) => {
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
    app.get("/onboarding", async (c) => {
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
    app.get(
      "/ws",
      upgradeWebSocket(() => ({
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

    routes.forEach((r) => {
      app.route("/api", r);
    });
  },

  beforeAll(app) {
    app.use(isUserSessionExist);
  },
});

export type AppRouter = (typeof routes)[number];
