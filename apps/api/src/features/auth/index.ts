import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@binspire/db";
import * as schema from "@binspire/db/schema";
import { openAPI } from "better-auth/plugins";
import { TRUSTED_ORIGINS } from "@/lib/constants";
import { EmailService } from "@/services";
import { rewriteURL } from "@/lib/utils";

const emailService = new EmailService();

export const auth = betterAuth({
  baseURL: Bun.env.SERVER_BASE_URL,
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      await emailService.sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${rewriteURL(url)}`,
        html: `<p>Click <a href="${rewriteURL(url)}">here</a> to reset your password.</p>`,
      });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      await emailService.sendEmail({
        to: user.email,
        subject: "Verify your email",
        text: `Click the link to verify your email: ${url}`,
        html: `<p>Click <a href="${rewriteURL(url)}">here</a> to verify your email. ${url}</p>`,
      });
    },
  },
  user: {
    additionalFields: {
      orgId: {
        type: "string",
        required: true,
        description: "Organization ID",
      },
    },
  },
  account: {
    additionalFields: {
      deviceToken: {
        type: "string",
        required: true,
        description: "Device Token",
      },
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
      user: schema.usersTable,
      account: schema.accountsTable,
      session: schema.sessionsTable,
      verification: schema.verificationsTable,
    },
  }),
  trustedOrigins: TRUSTED_ORIGINS,
  plugins: [openAPI()],
});
