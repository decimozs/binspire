import { getSession } from "@/lib/sessions.server";
import { factory } from "@/lib/utils";
import { redirect } from "react-router";

export const isUserSessionExist = factory.createMiddleware(async (c, next) => {
  const session = await getSession(c.req.header("cookie"));
  if (c.req.path.includes("/dashboard")) {
    if (!session.has("userId")) {
      return redirect("/login");
    }
  }
  return next();
});
