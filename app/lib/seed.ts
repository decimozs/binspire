import { faker } from "@faker-js/faker";
import db from "./db.server";
import {
  accountsTable,
  organizationsTable,
  requestAccessTable,
  trashbinsCollectionTable,
  trashbinsIssueTable,
  trashbinsTable,
  userActivityTable,
  usersTable,
  verificationsTable,
} from "@/db";
import env from "@config/env.server";
import { nanoid } from "nanoid";
import { hashUrlToken } from "./utils";
import type { Action, Status, Title } from "./types";
import { fromTitle } from "./constants";

function randomDate(start: Date, end: Date) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

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

  const users = Array.from({ length: 200 }).map(() => {
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
      role: faker.helpers.arrayElement(["admin", "collector"]),
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

export const seedUserActivities = async () => {
  const users = await db
    .select({ id: usersTable.id, name: usersTable.name })
    .from(usersTable);
  const verificationIds = await getVerificationIds();

  if (users.length === 0 || verificationIds.length === 0) {
    console.error("❌ No users or verifications found.");
    return;
  }

  const activities = Array.from({ length: 30 }).map(() => {
    const user = faker.helpers.arrayElement(users);
    const title: Title = faker.helpers.arrayElement(
      Object.keys(fromTitle) as Title[],
    );
    const status: Status = faker.helpers.arrayElement([
      "active",
      "pending",
      "blocked",
      "failed",
      "success",
      "approved",
      "rejected",
    ]);
    const action: Action = faker.helpers.arrayElement([
      "create",
      "delete",
      "update",
      "archive",
      "login",
      "sign-up",
      "logout",
    ]);

    return {
      id: nanoid(),
      userId: user.id,
      title,
      status,
      action,
      description: faker.lorem.sentence(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  await db.insert(userActivityTable).values(activities);
  console.log("✅ Seeded user activity");
};

const latLngs = [
  [14.578342384001559, 121.07463193405027],
  [14.577886702006609, 121.07578212263957],
  [14.578656811854344, 121.07458067915695],
  [14.579800722724215, 121.07757877798196],
  [14.579748249763696, 121.07765407870465],
  [14.579461020204079, 121.07629044892656],
  [14.577254332143326, 121.07655351515689],
  [14.577095410235756, 121.07518614779536],
  [14.576657940971273, 121.07622208365427],
  [14.578375640697189, 121.07673515228237],
];

const wasteLevels = ["empty", "moderate", "almost-full", "full", "overflowing"];
const weightLevels = ["light", "heavy", "overweight", "hazardous"];
const batteryLevels = ["high", "medium", "low", "critical"];

export const seedTrashbins = async () => {
  const trashbins = Array.from({ length: 10 }).map((_, i) => {
    const id = nanoid();
    const wasteLevel = faker.helpers.arrayElement(wasteLevels);
    const weightLevel = faker.helpers.arrayElement(weightLevels);
    const batteryLevel = faker.helpers.arrayElement(batteryLevels);
    const randomLevel = () => Math.floor(Math.random() * 105) + 1;

    // cycle latLngs so all 100 trashbins have a lat/lng
    const [lat, lng] = latLngs[i % latLngs.length];

    // generate random dates between Jan 1, 2024 and now
    const createdAt = randomDate(new Date("2024-01-01"), new Date());
    // updatedAt should be >= createdAt, so random between createdAt and now
    const updatedAt = randomDate(createdAt, new Date());

    return {
      id,
      name: `Trash Bin ${i + 1}`,
      isActive: faker.datatype.boolean(),
      isCollected: false,
      latitude: lat.toString(),
      longitude: lng.toString(),
      wasteStatus: wasteLevel,
      weightStatus: weightLevel,
      batteryStatus: batteryLevel,
      wasteLevel: randomLevel().toString(),
      weightLevel: randomLevel().toString(),
      batteryLevel: randomLevel().toString(),
      createdAt,
      updatedAt,
    };
  });

  await db.insert(trashbinsTable).values(trashbins);
  console.log("✅ Seeded 100 trashbins with random dates");
};

export const seedTrashbinCollections = async () => {
  const users = await db.select({ id: usersTable.id }).from(usersTable);
  const trashbins = await db
    .select({ id: trashbinsTable.id })
    .from(trashbinsTable);

  if (users.length === 0 || trashbins.length === 0) {
    console.error("❌ No users or trashbins found to seed collections");
    return;
  }

  const statusOptions = ["pending", "collected", "missed", "cancelled"];

  const startDate = new Date("2024-01-01");
  const endDate = new Date();

  const collections = Array.from({ length: 500 }).map(() => {
    const createdAt = randomDate(startDate, endDate);
    const updatedAt = randomDate(createdAt, endDate); // updatedAt should be >= createdAt

    return {
      id: nanoid(),
      userId: faker.helpers.arrayElement(users).id,
      trashbinId: faker.helpers.arrayElement(trashbins).id,
      status: faker.helpers.arrayElement(statusOptions),
      createdAt,
      updatedAt,
    };
  });

  await db.insert(trashbinsCollectionTable).values(collections);
  console.log(`✅ Seeded ${collections.length} trashbin collections`);
};

export const seedTrashbinIssues = async () => {
  const users = await db.select({ id: usersTable.id }).from(usersTable);
  const trashbins = await db
    .select({ id: trashbinsTable.id })
    .from(trashbinsTable);

  if (users.length === 0 || trashbins.length === 0) {
    console.error("❌ No users or trashbins found to seed issues");
    return;
  }

  const issueTypes = [
    "Damaged bin",
    "Overflowing waste",
    "Bad odor",
    "Missing bin",
    "Animal intrusion",
    "Mechanical issue",
    "Other",
  ];

  const startDate = new Date("2024-01-01");
  const endDate = new Date();

  const issues = Array.from({ length: 300 }).map(() => {
    const createdAt = randomDate(startDate, endDate);
    const updatedAt = randomDate(createdAt, endDate); // updatedAt should be >= createdAt

    return {
      id: nanoid(),
      userId: faker.helpers.arrayElement(users).id,
      trashbinId: faker.helpers.arrayElement(trashbins).id,
      name: faker.helpers.arrayElement(issueTypes),
      description: faker.lorem.paragraph(),
      status: faker.helpers.arrayElement(["ongoing", "resolved", "reported"]),
      createdAt,
      updatedAt,
    };
  });

  await db.insert(trashbinsIssueTable).values(issues);
  console.log(`✅ Seeded ${issues.length} trashbin issues`);
};

export const seedAll = async () => {
  await seedOrganizations();
  await seedUsersAndAccounts();
  await seedVerifications();
  await seedRequestAccess();
  await seedUserActivities();
  await seedTrashbins();
  await seedTrashbinCollections();
  await seedTrashbinIssues();
};

seedTrashbinCollections();
seedTrashbinIssues();
