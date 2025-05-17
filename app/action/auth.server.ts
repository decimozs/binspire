import {
  accountsTable,
  requestAccessTable,
  usersTable,
  verificationsTable,
} from "@/db";
import db from "@/lib/db.server";
import {
  commitSession,
  destroySession,
  getSession,
} from "@/lib/sessions.server";
import {
  googleSignupSchema,
  loginSchema,
  requestAccessSchema,
  resetPasswordSchema,
  signupSchema,
  verificationSchema,
} from "@/lib/validations.server";
import { redirect } from "react-router";
import argon2 from "argon2";
import { hashUrlToken } from "@/lib/utils";
import { nanoid } from "nanoid";
import env from "@config/env.server";
import type { GooglePayload, VerificationType } from "@/lib/types";
import { and, eq } from "drizzle-orm";
import type { Context } from "hono";
import { broadcast } from "@/lib/ws.server";

export async function login(request: Request) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData.entries());
  const validatedData = loginSchema.safeParse(data);

  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
    };
  }

  const email = validatedData.data.email;
  const password = validatedData.data.password;

  const user = await db.query.usersTable.findFirst({
    where: (table, { eq }) => eq(table.email, email),
  });

  if (!user?.email) {
    return {
      errors: "Email not found, Please request access first",
    };
  }

  if (!user.emailVerified) {
    return {
      errors: "Please verify your email first",
    };
  }

  const userId = user.id;
  const account = await db.query.accountsTable.findFirst({
    where: (table, { and, eq }) =>
      and(eq(table.userId, userId), eq(table.providerId, "email")),
  });

  if (!account) {
    return {
      errors: "Account not found. Please request access first",
    };
  }

  const accountPassword = account.password as string;
  const isPasswordValid = await argon2.verify(accountPassword, password);

  if (!isPasswordValid) {
    return {
      errors: "Invalid password",
    };
  }

  const orgId = user.orgId as string;
  const org = await db.query.organizationsTable.findFirst({
    where: (table, { eq }) => eq(table.id, orgId),
  });

  if (!org) {
    return {
      errors: "Organization not found",
    };
  }

  await db
    .update(usersTable)
    .set({
      isOnline: true,
    })
    .where(eq(usersTable.id, userId));

  const ipAddress = request.headers.get("x-forwarded-for");
  const userAgent = request.headers.get("user-agent");
  const session = await getSession(request.headers.get("cookie"));
  session.set("userId", user.id);
  session.set("orgId", user.orgId);
  session.set("ipAddress", ipAddress);
  session.set("userAgent", userAgent);
  session.set("permission", user.permission);

  let transaction;

  if (user.role === "admin") {
    transaction = "admin-login";
  } else {
    transaction = "collector-login";
  }

  broadcast({
    transaction,
  });

  return redirect("/dashboard", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function requestAccess(request: Request) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData.entries());
  const validatedData = requestAccessSchema.safeParse(data);

  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
    };
  }

  const verificationToken = nanoid();
  const token = hashUrlToken(verificationToken, env?.AUTH_SECRET!);
  const [verification] = await db
    .insert(verificationsTable)
    .values({
      identifier: "request-access",
      value: token,
    })
    .returning();

  if (!verification) {
    return {
      errors: "Failed to create your request",
    };
  }

  const verificationId = verification.id;

  const action = await db
    .insert(requestAccessTable)
    .values({
      ...validatedData.data,
      status: "pending",
      verificationId: verificationId,
    })
    .returning();

  if (!action || action.length === 0) {
    return {
      errors: "Failed to request access",
    };
  }

  return {
    success: true,
  };
}

export async function verification(request: Request) {
  const formData = await request.formData();
  const formEmail = formData.get("email");
  const validatedData = verificationSchema.safeParse({
    email: formEmail,
  });

  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
    };
  }

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const type = searchParams.get("type") as VerificationType;
  const email = validatedData.data.email;

  const user = await db.query.usersTable.findFirst({
    where: (table, { eq }) => eq(table.email, email),
  });

  if (!user) {
    return {
      errors: "Email not found. Please request access first!",
    };
  }

  const verificationToken = nanoid();
  const hashToken = hashUrlToken(verificationToken, env?.AUTH_SECRET!);
  const [verification] = await db
    .insert(verificationsTable)
    .values({
      identifier: type,
      value: hashToken,
    })
    .returning({ token: verificationsTable.value });

  if (!verification) {
    return {
      errors: "Failed to create your verification",
    };
  }

  const token = verification.token;

  return {
    email,
    token,
    type,
  };
}

export async function resetPassword(request: Request) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData.entries());
  const validatedData = resetPasswordSchema.safeParse(data);

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const email = searchParams.get("e") as string;
  const token = searchParams.get("t") as string;

  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
    };
  }

  const newPassword = validatedData.data.newPassword;

  const user = await db.query.usersTable.findFirst({
    where: (table, { eq }) => eq(table.email, email),
  });

  const userId = user?.id as string;

  const hashedPassword = await argon2.hash(newPassword);

  const updatePassword = await db
    .update(accountsTable)
    .set({
      password: hashedPassword,
    })
    .where(eq(accountsTable.userId, userId))
    .returning();

  if (!updatePassword || updatePassword.length === 0) {
    return {
      errors: "Failed to update your password",
    };
  }

  const deleteVerification = await db
    .delete(verificationsTable)
    .where(
      and(
        eq(verificationsTable.value, token),
        eq(verificationsTable.identifier, "forgot-password"),
      ),
    )
    .returning();

  if (!deleteVerification || deleteVerification.length === 0) {
    return {
      errors: "Failed to delete your password",
    };
  }

  return {
    success: true,
  };
}

export async function signUp(request: Request) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData.entries());
  const validatedData = signupSchema.safeParse(data);
  const googleValidatedData = googleSignupSchema.safeParse(data);
  const intent = formData.get("intent");

  if (intent === "email") {
    if (!validatedData.success) {
      return {
        errors: validatedData.error.flatten().fieldErrors,
      };
    }

    const { password, confirmPassword, ...userData } = validatedData.data;

    const [user] = await db
      .insert(usersTable)
      .values({
        ...userData,
        emailVerified: true,
      })
      .returning();

    if (!user) {
      return {
        errors: "Failed to create user",
      };
    }

    const accountId = nanoid();
    const userId = user.id;
    const hashedPassword = await argon2.hash(password);

    const [account] = await db
      .insert(accountsTable)
      .values({
        accountId: accountId,
        providerId: "email",
        userId: userId,
        password: hashedPassword,
      })
      .returning();

    if (!account) {
      return {
        errors: "Failed to create account",
      };
    }

    await db
      .update(usersTable)
      .set({
        isOnline: true,
      })
      .where(eq(usersTable.id, userId));

    const ipAddress = request.headers.get("x-forwarded-for");
    const userAgent = request.headers.get("user-agent");
    const session = await getSession(request.headers.get("cookie"));
    session.set("userId", user.id);
    session.set("orgId", user.orgId);
    session.set("ipAddress", ipAddress);
    session.set("userAgent", userAgent);
    session.set("permission", user.permission);

    let transaction;

    if (user.role === "admin") {
      transaction = "admin-login";
    } else {
      transaction = "collector-login";
    }

    broadcast({
      transaction,
    });

    return redirect("/dashboard", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  if (intent === "google") {
    if (!googleValidatedData.success) {
      return {
        errors: googleValidatedData.error.flatten().fieldErrors,
      };
    }

    const [user] = await db
      .insert(usersTable)
      .values({
        ...googleValidatedData.data,
        emailVerified: true,
      })
      .returning();

    if (!user) {
      return {
        errors: "Failed to create user",
      };
    }

    const accountId = nanoid();
    const userId = user.id;

    const [account] = await db
      .insert(accountsTable)
      .values({
        accountId: accountId,
        providerId: "google",
        userId: userId,
      })
      .returning();

    if (!account) {
      return {
        errors: "Failed to create account",
      };
    }

    return redirect("/callback");
  }
}

export async function loginWithGoogle(c: Context, payload: GooglePayload) {
  const {
    email,
    name,
    image,
    emailStatus,
    accountId,
    token,
    scopes,
    expiresIn,
  } = payload;
  const user = await db.query.usersTable.findFirst({
    where: (table, { eq }) => eq(table.email, email),
  });

  let currentUser = user;

  if (!user) {
    return redirect("/login?e=account-not-found");
  } else {
    await db
      .update(usersTable)
      .set({
        name: name,
        image: image,
        emailVerified: emailStatus,
        isOnline: true,
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
  const accessToken = token as string;
  const tokenExpiresIn = expiresIn as number;

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

  let transaction;

  if (user.role === "admin") {
    transaction = "admin-login";
  } else {
    transaction = "collector-login";
  }

  broadcast({
    transaction,
  });

  return redirect("/dashboard", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function signUpWithGoogle(c: Context, payload: GooglePayload) {
  const {
    email,
    name,
    image,
    emailStatus,
    accountId,
    token,
    scopes,
    expiresIn,
  } = payload;
  const userRequest = await db.query.requestAccessTable.findFirst({
    where: (table, { eq }) => eq(table.email, email),
  });

  if (!userRequest) {
    return redirect("/login?e=request-account-not-found");
  }

  const user = await db.query.usersTable.findFirst({
    where: (table, { eq }) => eq(table.email, email),
  });

  if (!user) {
    return redirect("/login?e=request-account-not-found");
  }

  await db
    .update(usersTable)
    .set({
      name: name,
      image: image,
      emailVerified: emailStatus,
      isOnline: true,
    })
    .where(eq(usersTable.id, user.id));

  const userId = user.id as string;
  const accessToken = token as string;
  const tokenExpiresIn = expiresIn as number;

  await db
    .update(accountsTable)
    .set({
      accountId: accountId,
      providerId: "google",
      userId: userId,
      scope: scopes,
      accessToken: accessToken,
      accessTokenExpiresAt: new Date(Date.now() + tokenExpiresIn * 1000),
    })
    .where(eq(accountsTable.userId, userId));

  const orgId = user?.orgId as string;
  const permission = user?.permission as string;
  const ipAddress = c.req.header("x-forwarded-for");
  const userAgent = c.req.header("user-agent");
  const session = await getSession(c.req.header("cookie"));
  session.set("userId", userId);
  session.set("orgId", orgId);
  session.set("ipAddress", ipAddress);
  session.set("userAgent", userAgent);
  session.set("permission", permission);

  let transaction;

  if (user.role === "admin") {
    transaction = "admin-login";
  } else {
    transaction = "collector-login";
  }

  broadcast({
    transaction,
  });

  return redirect("/dashboard", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function logout(request: Request) {
  const session = await getSession(request.headers.get("cookie"));
  const userId = session.get("userId");

  if (!userId) {
    return {
      errors: "Failed to get current session",
    };
  }

  const [response] = await db
    .update(usersTable)
    .set({
      isOnline: false,
    })
    .where(eq(usersTable.id, userId))
    .returning();

  if (!response) {
    return {
      errors: "Failed to update user",
    };
  }

  let transaction;

  if (response.role === "admin") {
    transaction = "admin-logout";
  } else {
    transaction = "collector-logout";
  }

  broadcast({
    transaction,
  });

  return redirect("/logout", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}
