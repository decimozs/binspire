import { rpc } from "@/lib/rpc";
import type { User, AccessRequests, ActivityLogs, Comment } from "@/lib/types";
import { parsedJSON } from "@/lib/utils";

async function management() {
  const response = await rpc.users.$get();

  if (!response.ok) {
    return [] as User[];
  }

  const { data } = await response.json();
  const users = parsedJSON<User[]>(data);
  return users;
}

async function rolesAndPermissions() {
  return await management();
}

async function accessRequests() {
  const response = await rpc.users["access-requests"].$get();

  if (!response.ok) {
    return [] as AccessRequests[];
  }

  const { data } = await response.json();
  const usersAccessRequests = parsedJSON<AccessRequests[]>(data);
  return usersAccessRequests;
}

async function activityLogs() {
  const response = await rpc.users["activity-logs"].$get();

  if (!response.ok) {
    return [] as ActivityLogs[];
  }

  const { data } = await response.json();
  const activityLogs = parsedJSON<ActivityLogs[]>(data);
  return activityLogs;
}

async function comments() {
  const response = await rpc.users["comments"].$get();

  if (!response.ok) {
    return [] as Comment[];
  }

  const { data } = await response.json();
  const usersAccessRequests = parsedJSON<Comment[]>(data);
  return usersAccessRequests;
}

async function profile(id: string) {
  const userDataResponse = await rpc.users[":id"].$get({
    param: {
      id: id,
    },
  });

  if (!userDataResponse.ok) throw new Error("Failed to fetch user profile");

  const { data: userData } = await userDataResponse.json();
  const user = parsedJSON<User>(userData);

  const activityLogDataResponse = await rpc.users["activity-logs"]["by-user"][
    ":id"
  ].$get({
    param: {
      id: id,
    },
  });

  if (!activityLogDataResponse.ok)
    throw new Error("Failed to get user activity");

  const { data: activityLogDataData } = await activityLogDataResponse.json();
  const activityLogs = parsedJSON<ActivityLogs>(activityLogDataData);

  return {
    user: user,
    activityLogs: activityLogs,
  };
}

export const UserLoader = {
  management,
  rolesAndPermissions,
  accessRequests,
  activityLogs,
  comments,
  profile,
};
