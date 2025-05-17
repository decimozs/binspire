import type { UpdateUser } from "@/db";
import { UserRepository } from "../repository/users.server";

async function getAllUsers() {
  return await UserRepository.getAllUsers();
}

async function getUserById(id: string) {
  const user = await UserRepository.getUserById(id);
  if (!user) throw new Error("User not found");
  return user;
}

async function getUserByEmail(email: string) {
  const data = await UserRepository.getUserByEmail(email);
  if (!data) throw new Error("User not found");
  return data;
}

async function getAllActivityLogs() {
  return await UserRepository.getAllActivityLogs();
}

async function getAllAccessRequests() {
  return await UserRepository.getAllAccessRequests();
}

async function getAllComments() {
  return await UserRepository.getAllComments();
}

const getActivityLogsBy = {
  Id: async (id: string) => {
    return UserRepository.getActivityLogsById(id);
  },
  UserId: async (id: string) => {
    return UserRepository.getActivityLogsByUserId(id);
  },
};

async function updateUser(id: string, data: UpdateUser) {
  await getUserById(id);
  return UserRepository.updateUser(id, data);
}

export const UserService = {
  getAllUsers,
  getAllActivityLogs,
  getUserById,
  getActivityLogsBy,
  getAllComments,
  getAllAccessRequests,
  updateUser,
  getUserByEmail,
};
