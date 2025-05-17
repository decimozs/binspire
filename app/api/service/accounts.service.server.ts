import type { AccountProvider } from "@/lib/types";
import { AccountRepository } from "../repository/accounts.repository.server";
import type { CreateAccount, UpdateAccount } from "@/db";

async function getAccountById(id: string) {
  const data = await AccountRepository.getAccountById(id);
  if (!data) throw Error("Account not found");
  return data;
}

async function getAccountByProviderId(provider: AccountProvider) {
  const data = await AccountRepository.getAccountByProviderId(provider);
  if (!data) throw new Error("Account not found");
  return data;
}

async function getAccountByAccountId(id: string) {
  const data = await AccountRepository.getAccountByAccountId(id);
  if (!data) throw new Error("Account not found");
  return data;
}

async function getAccountByUserId(id: string) {
  const data = await AccountRepository.getAccountByUserId(id);
  if (!data) throw new Error("Account not found");
  return data;
}

async function createAccount(data: CreateAccount) {
  return await AccountRepository.createAccount(data);
}

async function updateAccount(
  provider: AccountProvider,
  accountId: string,
  data: UpdateAccount,
) {
  const account = await getAccountByAccountId(accountId);
  if (!account) throw new Error("Account not found");
  return await AccountRepository.updateAccount(provider, accountId, data);
}

export const AccountService = {
  getAccountById,
  getAccountByProviderId,
  getAccountByAccountId,
  updateAccount,
  createAccount,
  getAccountByUserId,
};
