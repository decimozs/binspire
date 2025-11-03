import { factory } from "@/lib/factory";

export class SessionHandler {
  static getSession = factory.createHandlers(async (c) => {
    const session = c.get("session");
    const user = c.get("user");

    if (!user) return c.body(null, 401);

    return c.json({
      session,
      user,
    });
  });
}
