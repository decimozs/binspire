import type {
  InsertUserCollectionAssignment,
  InsertUserGreenHeart,
  InsertUserInvitation,
  InsertUserQuota,
  InsertUserRequest,
  UpdateUser,
  UpdateUserGreenHeart,
  UpdateUserInvitation,
  UpdateUserQuota,
  UpdateUserRequest,
  UpdateUserSettings,
  UpdateUserStatus,
} from "@binspire/db/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type User,
  UserApi,
  type UserCollectionAssignment,
  UserCollectionAssignmentApi,
  type UserGreenHeart,
  UserGreenHeartApi,
  type UserInvitation,
  UserInvitationsApi,
  UserQuotaApi,
  type UserRequest,
  UserRequestApi,
  UserSettingsApi,
  UserStatusApi,
} from "../../core";

export function useGetAllUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: UserApi.getAll,
  });
}

export function useGetUserById(id: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["user", id],
    queryFn: () => UserApi.getById(id),
    enabled: !!id,
    initialData: () => {
      return queryClient
        .getQueryData<User[]>(["users"])
        ?.find((user) => user.id === id);
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUser }) =>
      UserApi.update(id, data),
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", id] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => UserApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useGetAllUserInvitations() {
  return useQuery({
    queryKey: ["user-invitations"],
    queryFn: UserInvitationsApi.getAll,
  });
}

export function useGetUserInvitationById(id: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["user-invitation", id],
    queryFn: () => UserInvitationsApi.getById(id),
    enabled: !!id,
    initialData: () => {
      return queryClient
        .getQueryData<UserInvitation[]>(["user-invitations"])
        ?.find((invitation) => invitation.id === id);
    },
  });
}

export function useCreateUserInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InsertUserInvitation) => UserInvitationsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-invitations"] });
    },
  });
}

export function useUpdateUserInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserInvitation }) =>
      UserInvitationsApi.update(id, data),
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: ["user-invitations"] });
      queryClient.invalidateQueries({ queryKey: ["user-invitation", id] });
    },
  });
}

export function useDeleteUserInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => UserInvitationsApi.delete(id),
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: ["user-invitations"] });
      queryClient.invalidateQueries({ queryKey: ["user-invitation", id] });
    },
  });
}

export function useGetAllUserRequests() {
  return useQuery({
    queryKey: ["user-requests"],
    queryFn: UserRequestApi.getAll,
  });
}

export function useGetUserRequestById(id: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["user-request", id],
    queryFn: () => UserRequestApi.getById(id),
    enabled: !!id,
    initialData: () => {
      return queryClient
        .getQueryData<UserRequest[]>(["user-requests"])
        ?.find((request) => request.id === id);
    },
  });
}

export function useCreateUserRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<InsertUserRequest, "orgId">) =>
      UserRequestApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-requests"] });
    },
  });
}

export function useUpdateUserRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      UserRequestApi.update(id, data),
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: ["user-requests"] });
      queryClient.invalidateQueries({ queryKey: ["user-request", id] });
    },
  });
}

export function useDeleteUserRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => UserRequestApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-requests"] });
    },
  });
}

export function useGetUserSettingsByUserId(userId: string) {
  return useQuery({
    queryKey: ["user-settings", userId],
    queryFn: () => UserSettingsApi.getByUserId(userId),
    enabled: !!userId,
  });
}

export function useUpdateUserSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string;
      data: UpdateUserSettings;
    }) => UserSettingsApi.update(userId, data),
    onSuccess: ({ userId }) => {
      queryClient.invalidateQueries({ queryKey: ["user-settings", userId] });
    },
  });
}

export function useGetUserStatusByUserId(userId: string) {
  return useQuery({
    queryKey: ["user-status", userId],
    queryFn: () => UserStatusApi.getByUserId(userId),
    enabled: !!userId,
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string;
      data: UpdateUserStatus;
    }) => UserStatusApi.update(userId, data),
    onSuccess: ({ userId }) => {
      queryClient.invalidateQueries({ queryKey: ["user-status"] });
      queryClient.invalidateQueries({ queryKey: ["user-status", userId] });
    },
  });
}

export function useDeleteBatchUsers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) =>
      Promise.all(ids.map((id) => UserApi.delete(id))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useDeleteBatchUserInvitations() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) =>
      Promise.all(ids.map((id) => UserInvitationsApi.delete(id))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-invitations"] });
    },
  });
}

export function useDeleteBatchUserRequests() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) =>
      Promise.all(ids.map((id) => UserRequestApi.delete(id))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-requests"] });
    },
  });
}

export function useGetAllUserCollectionAssignment() {
  return useQuery({
    queryKey: ["user-collection-assignments"],
    queryFn: () => UserCollectionAssignmentApi.getAll(),
  });
}

export function useGetUserCollectionAssignmentById(id: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["user-collection-assignment", id],
    queryFn: () => UserCollectionAssignmentApi.getById(id),
    enabled: !!id,
    initialData: () => {
      return queryClient
        .getQueryData<UserCollectionAssignment[]>([
          "user-collection-assignments",
        ])
        ?.find((assignment) => assignment.id === id);
    },
  });
}

export function useGetUserCollectionAssignmentsByUserId(userId: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["user-collection-assignments", userId],
    queryFn: () => UserCollectionAssignmentApi.getByUserId(userId),
    enabled: !!userId,
    initialData: () => {
      const cached = queryClient.getQueryData<UserCollectionAssignment[]>([
        "user-collection-assignments",
      ]);
      return cached
        ? cached.filter((assignment) => assignment.userId === userId)
        : [];
    },
  });
}

export function useCreateUserCollectionAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InsertUserCollectionAssignment) =>
      UserCollectionAssignmentApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-collection-assignments"],
      });
    },
  });
}

export function useDeleteUserCollectionAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => UserCollectionAssignmentApi.delete(id),
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({
        queryKey: ["user-collection-assignments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-collection-assignment", id],
      });
    },
  });
}

export function useCreateUserQuota() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InsertUserQuota) => UserQuotaApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-quotas"] });
    },
  });
}

export function useGetUserQuotaByUserId(userId: string) {
  return useQuery({
    queryKey: ["user-quota", userId],
    queryFn: () => UserQuotaApi.getByUserId(userId),
    enabled: !!userId,
  });
}

export function useUpdateUserQuota() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserQuota }) =>
      UserQuotaApi.update(userId, data),
    onSuccess: ({ userId }) => {
      queryClient.invalidateQueries({ queryKey: ["user-quota", userId] });
    },
  });
}

export function useDeleteUserQuota() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => UserQuotaApi.delete(id),
    onSuccess: ({ userId }) => {
      queryClient.invalidateQueries({ queryKey: ["user-quotas"] });
      queryClient.invalidateQueries({ queryKey: ["user-quota", userId] });
    },
  });
}

export function useGetAllGreenHearts() {
  return useQuery({
    queryKey: ["user-green-hearts"],
    queryFn: UserGreenHeartApi.getAll,
  });
}

export function useGetUserGreenHeartById(id: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["user-green-heart", id],
    queryFn: () => UserGreenHeartApi.getById(id),
    enabled: !!id,
    initialData: () => {
      return queryClient
        .getQueryData<UserGreenHeart[]>(["user-green-hearts"])
        ?.find((greenHeart) => greenHeart.id === id);
    },
  });
}

export function useGetUserGreenHeartByUserId(userId: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["user-green-heart", userId],
    queryFn: () => UserGreenHeartApi.getByUserId(userId),
    enabled: !!userId,
    initialData: () => {
      return queryClient
        .getQueryData<UserGreenHeart[]>(["user-green-hearts"])
        ?.find((greenHeart) => greenHeart.userId === userId);
    },
  });
}

export function useCreateUserGreenHeart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InsertUserGreenHeart) => UserGreenHeartApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-green-hearts"] });
    },
  });
}

export function useUpdateUserGreenHeart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string;
      data: UpdateUserGreenHeart;
    }) => UserGreenHeartApi.update(userId, data),
    onSuccess: ({ userId }) => {
      queryClient.invalidateQueries({ queryKey: ["user-green-hearts"] });
      queryClient.invalidateQueries({ queryKey: ["user-green-heart", userId] });
    },
  });
}

export function useDeleteUserGreenHeart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => UserGreenHeartApi.delete(id),
    onSuccess: ({ userId }) => {
      queryClient.invalidateQueries({ queryKey: ["user-green-hearts"] });
      queryClient.invalidateQueries({ queryKey: ["user-green-heart", userId] });
    },
  });
}

export function useBatchDeleteUserGreenHearts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) =>
      Promise.all(ids.map((id) => UserGreenHeartApi.delete(id))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-green-hearts"] });
    },
  });
}
