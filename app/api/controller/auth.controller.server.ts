import { errorResponse, factory } from "@/lib/utils";
import { AuthService } from "../service/auth.service.server";
import type { GoogleGrantedScopes, GoogleToken, GoogleUser } from "@/lib/types";
import { redirect } from "react-router";
import { commitSession, setUserSession } from "@/lib/sessions.server";
import { zValidator } from "@hono/zod-validator";
import { loginSchema } from "@/lib/validations.server";

const loginWithGoogle = factory.createHandlers(async (c) => {
  try {
    const token = c.get("token") as GoogleToken;
    const grantedScopes = c.get("granted-scopes") as GoogleGrantedScopes;
    const googleUser = c.get("user-google") as GoogleUser;
    const data = await AuthService.loginWithGoogle(
      token,
      grantedScopes,
      googleUser,
    );
    const session = await setUserSession(c, data);

    return redirect("/dashboard", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error) {
    console.log(error);
    return errorResponse(c, error);
  }
});

const loginWithEmailAndPassword = factory.createHandlers(
  zValidator("json", loginSchema),
  async (c) => {
    try {
      const response = c.req.valid("json");
      const data = await AuthService.loginWithEmailAndPassword(response);
      const session = await setUserSession(c, data);

      return redirect("/dashboard", {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    } catch (error) {
      return errorResponse(c, error);
    }
  },
);

export const AuthController = {
  loginWithGoogle,
  loginWithEmailAndPassword,
};
