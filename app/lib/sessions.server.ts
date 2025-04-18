import env from "@config/env.server";
import { createSessionStorage } from "react-router";
import { nanoid } from "nanoid";
import { sessionsTable } from "@/db";
import db from "./db.server";
import { eq } from "drizzle-orm";
import type { SessionData } from "@/lib/types";

type SessionErrorData = {
  error: string;
};

const sessionStorage = createSessionStorage<SessionData, SessionErrorData>({
  cookie: {
    name: "__session",
    secrets: [env?.AUTH_SECRET!],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    maxAge: 604800,
    secure: process.env.NODE_ENV === "production",
  },

  async createData(data, expires) {
    const sessionId = nanoid();
    const token = nanoid();
    await db.insert(sessionsTable).values({
      id: sessionId,
      token,
      userId: data.userId!,
      orgId: data.orgId,
      expiresAt: expires!,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
    });
    return sessionId;
  },

  async readData(id) {
    const session = await db.query.sessionsTable.findFirst({
      where: (table, { eq }) => eq(table.id, id),
    });

    if (!session || new Date(session.expiresAt) < new Date()) {
      return null;
    }

    return session;
  },

  async updateData(id, data, expires) {
    await db
      .update(sessionsTable)
      .set({
        ...data,
        expiresAt: expires,
      })
      .where(eq(sessionsTable.id, id));
  },

  async deleteData(id) {
    await db.delete(sessionsTable).where(eq(sessionsTable.id, id));
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;
