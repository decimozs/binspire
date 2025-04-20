import env from "@config/env.server";
import { googleAuth } from "@hono/oauth-providers/google";

export const googleLoginAuth = googleAuth({
  client_id: env?.GOOGLE_CLIENT_ID,
  client_secret: env?.GOOGLE_CLIENT_SECRET,
  scope: ["openid", "email", "profile"],
  prompt: "select_account",
  access_type: "offline",
  redirect_uri: "http://localhost:5173/auth/google/login",
});

export const googleSignupAuth = googleAuth({
  client_id: env?.GOOGLE_CLIENT_ID,
  client_secret: env?.GOOGLE_CLIENT_SECRET,
  scope: ["openid", "email", "profile"],
  prompt: "select_account",
  access_type: "offline",
  redirect_uri: "http://localhost:5173/auth/google/signup",
});
