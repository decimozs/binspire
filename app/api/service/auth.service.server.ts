import type { GoogleGrantedScopes, GoogleToken, GoogleUser } from "@/lib/types";
import { UserService } from "./users.service.server";
import type { UpdateAccount, UpdateUser } from "@/db";
import { AccountService } from "./accounts.service.server";
import { broadcast } from "@/lib/ws.server";
import argon2 from "argon2";

async function loginWithGoogle(
  token: GoogleToken,
  grantedScopes: GoogleGrantedScopes,
  googleUser: GoogleUser,
) {
  const user = await UserService.getUserByEmail(googleUser.email);
  const updatedUserData: UpdateUser = {
    name: googleUser.name,
    image: googleUser.picture,
    emailVerified: googleUser.verified_email,
    isOnline: true,
  };

  await UserService.updateUser(user.id, updatedUserData);
  await AccountService.getAccountByAccountId(googleUser.id);
  await AccountService.getAccountByProviderId("google");

  const updatedAccountData: UpdateAccount = {
    accessToken: token.token,
    accessTokenExpiresAt: new Date(Date.now() + token.expires_in * 1000),
    scope: grantedScopes.join(", "),
  };

  await AccountService.updateAccount(
    "google",
    googleUser.id,
    updatedAccountData,
  );

  const trasnsaction =
    user.role === "admin" ? "admin-login" : "collector-login";

  broadcast({ trasnsaction });

  return user;
}

interface LoginWithEmailAndPassword {
  email: string;
  password: string;
}

async function loginWithEmailAndPassword(data: LoginWithEmailAndPassword) {
  const { email, password } = data;
  const user = await UserService.getUserByEmail(email);
  const account = await AccountService.getAccountByUserId(user.id);
  const isPasswordValid = await argon2.verify(
    account.password as string,
    password,
  );
  if (!isPasswordValid) throw new Error("Invalid Password");

  await UserService.updateUser(user.id, {
    isOnline: true,
  });

  const trasnsaction =
    user.role === "admin" ? "admin-login" : "collector-login";

  broadcast({ trasnsaction });

  return user;
}

export const AuthService = {
  loginWithGoogle,
  loginWithEmailAndPassword,
};
