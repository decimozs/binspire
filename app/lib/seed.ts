import { faker } from "@faker-js/faker";
import db from "./db.server";
import {
  accountsTable,
  organizationsTable,
  requestAccessTable,
  usersTable,
  verificationsTable,
} from "@/db";
import env from "@config/env.server";
import { nanoid } from "nanoid";
import { hashUrlToken } from "./utils";

export const seedOrganizations = async () => {
  const organizations = Array.from({ length: 10 }).map(() => {
    const name = faker.company.name();
    const slug = faker.helpers.slugify(name.toLowerCase());
    return {
      id: nanoid(),
      name,
      slug,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  await db.insert(organizationsTable).values(organizations);

  console.log("✅ Seeded organizations");
};

const getOrgId = async () => {
  const org = await db.query.organizationsTable.findFirst();
  return org?.id || null;
};

const getVerificationIds = async () => {
  const result = await db
    .select({ id: verificationsTable.id })
    .from(verificationsTable);
  return result.map((v) => v.id);
};

const verificationToken = nanoid();
const accountId = nanoid();
const token = hashUrlToken(verificationToken, env?.AUTH_SECRET!);

export const seedUsersAndAccounts = async () => {
  const orgId = await getOrgId();
  if (!orgId) {
    console.error(
      "❌ No organization found. Make sure one exists before seeding users.",
    );
    return;
  }

  const users = Array.from({ length: 10 }).map(() => {
    const id = nanoid();
    return {
      id,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      emailVerified: faker.datatype.boolean,
      permission: faker.helpers.arrayElement([
        "viewer",
        "editor",
        "full-access",
      ]),
      image: faker.image.avatar(),
      orgId,
      role: faker.helpers.arrayElement(["user", "admin", "collector"]),
      isOnline: faker.datatype.boolean(),
      createdAt: new Date(),
      updatedAt: new Date(),
      account: {
        id: nanoid(),
        accountId: accountId,
        providerId: faker.helpers.arrayElement(["google", "email"]),
        userId: id,
        accessToken: faker.string.alphanumeric(24),
        refreshToken: faker.string.alphanumeric(24),
        idToken: faker.string.alphanumeric(32),
        accessTokenExpiresAt: faker.date.soon(),
        refreshTokenExpiresAt: faker.date.future(),
        scope: faker.helpers.arrayElement([
          "open-id, granted-scopes, user-google",
          "",
        ]),
        password: faker.internet.password(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };
  });

  await db.insert(usersTable).values(users.map(({ account, ...user }) => user));
  await db.insert(accountsTable).values(users.map((u) => u.account));

  console.log("✅ Seeded users and accounts");
};

export const seedVerifications = async () => {
  const requestData = Array.from({ length: 20 }).map(() => ({
    identifier: "request-access",
    value: token,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  }));

  await db.insert(verificationsTable).values(requestData);

  console.log("✅ Seeded verifications");
};

export const seedRequestAccess = async () => {
  const verificationIds = await getVerificationIds();

  const requestData = Array.from({ length: 20 }).map(() => ({
    email: faker.internet.email(),
    status: faker.helpers.arrayElement(["pending", "approved", "rejected"]),
    verificationId: faker.helpers.arrayElement(verificationIds),
    name: faker.person.fullName(),
    role: faker.helpers.arrayElement(["admin", "collector"]),
    phoneNumber: faker.phone.number(),
    reason: faker.lorem.paragraphs(5),
  }));

  await db.insert(requestAccessTable).values(requestData);

  console.log("✅ Seeded request access");
};

const seed = async () => {
  await seedOrganizations();
  await seedUsersAndAccounts();
  await seedVerifications();
  await seedRequestAccess();
};

seed();
