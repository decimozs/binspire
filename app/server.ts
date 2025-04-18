import { redirect } from "react-router";
import { createHonoServer } from "react-router-hono-server/node";
import { commitSession, getSession } from "./lib/sessions.server";
import { googleAuth } from "@hono/oauth-providers/google";
import env from "@config/env.server";
import db from "./lib/db.server";
import { accountsTable, usersTable } from "./db";
import { eq, and } from "drizzle-orm";

export default await createHonoServer({
  configure: (server) => {
    server.use(
      "/auth/callback/google",
      googleAuth({
        client_id: env?.GOOGLE_CLIENT_ID,
        client_secret: env?.GOOGLE_CLIENT_SECRET,
        scope: ["openid", "email", "profile"],
      }),
    );
    server.get("/auth/callback/google", async (c) => {
      const token = c.get("token");
      const grantedScopes = c.get("granted-scopes");
      const userGoogle = c.get("user-google");
      const accountId = userGoogle?.id as string;
      const userEmail = userGoogle?.email as string;
      const userFullname = userGoogle?.name as string;
      const userEmailStatus = userGoogle?.verified_email as boolean;
      const userImage = userGoogle?.picture as string;
      const scopes = grantedScopes?.join(", ");

      const user = await db.query.usersTable.findFirst({
        where: (table, { eq }) => eq(table.email, userEmail),
      });

      let currentUser = user;

      if (!user) {
        const [newUser] = await db
          .insert(usersTable)
          .values({
            name: userFullname,
            email: userEmail,
            emailVerified: userEmailStatus,
            image: userImage,
            permission: "viewer",
          })
          .returning();

        currentUser = newUser;
      } else {
        await db
          .update(usersTable)
          .set({
            name: userFullname,
            image: userImage,
            emailVerified: userEmailStatus,
          })
          .where(eq(usersTable.id, user.id));
      }

      const [account] = await db
        .select()
        .from(accountsTable)
        .where(
          and(
            eq(accountsTable.providerId, "google"),
            eq(accountsTable.accountId, accountId),
          ),
        );

      const userId = currentUser?.id as string;
      const accessToken = token?.token as string;
      const tokenExpiresIn = token?.expires_in as number;

      if (!account) {
        await db.insert(accountsTable).values({
          accountId: accountId,
          providerId: "google",
          userId: userId,
          scope: scopes,
          accessToken: accessToken,
          accessTokenExpiresAt: new Date(Date.now() + tokenExpiresIn * 1000),
        });
      } else {
        await db
          .update(accountsTable)
          .set({
            accessToken: accessToken,
            accessTokenExpiresAt: new Date(Date.now() + tokenExpiresIn * 1000),
            scope: scopes,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(accountsTable.providerId, "google"),
              eq(accountsTable.accountId, accountId),
            ),
          );
      }

      const orgId = currentUser?.orgId as string;
      const permission = currentUser?.permission as string;
      const ipAddress = c.req.header("x-forwarded-for");
      const userAgent = c.req.header("user-agent");
      const session = await getSession(c.req.header("cookie"));
      session.set("userId", userId);
      session.set("orgId", orgId);
      session.set("ipAddress", ipAddress);
      session.set("userAgent", userAgent);
      session.set("permission", permission);
      console.log("session: ", session.data);

      return redirect("/dashboard", {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    });
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
