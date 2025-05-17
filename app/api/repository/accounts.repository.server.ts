import { accountsTable, type CreateAccount, type UpdateAccount } from "@/db";
import db from "@/lib/db.server";
import type { AccountProvider } from "@/lib/types";
import { and, eq } from "drizzle-orm";

function getAccountById(id: string) {
  return db.query.accountsTable.findFirst({
    where: (table, { eq }) => eq(table.id, id),
  });
}

function getAccountByProviderId(provider: AccountProvider) {
  return db.query.accountsTable.findFirst({
    where: (table, { eq }) => eq(table.providerId, provider),
  });
}

function getAccountByAccountId(id: string) {
  return db.query.accountsTable.findFirst({
    where: (table, { eq }) => eq(table.accountId, id),
  });
}

function getAccountByUserId(id: string) {
  return db.query.accountsTable.findFirst({
    where: (table, { eq }) => eq(table.userId, id),
  });
}

function createAccount(data: CreateAccount) {
  return db.insert(accountsTable).values(data).returning();
}

function updateAccount(
  providerId: AccountProvider,
  accountId: string,
  data: UpdateAccount,
) {
  return db
    .update(accountsTable)
    .set(data)
    .where(
      and(
        eq(accountsTable.providerId, providerId),
        eq(accountsTable.accountId, accountId),
      ),
    )
    .returning();
}

export const AccountRepository = {
  getAccountByProviderId,
  getAccountByAccountId,
  getAccountById,
  updateAccount,
  createAccount,
  getAccountByUserId,
};
