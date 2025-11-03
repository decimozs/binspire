import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  InsertTrashbin,
  InsertTrashbinCollection,
  UpdateTrashbin,
} from "@binspire/db/schema";
import {
  TrashbinApi,
  TrashbinCollectionsApi,
  type Trashbin,
  type TrashbinCollections,
} from "../../core";

export function useGetAllTrashbins() {
  return useQuery({
    queryKey: ["trashbins"],
    queryFn: TrashbinApi.getAll,
  });
}

export function useGetTrashbinById(id: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["trashbin", id],
    queryFn: () => TrashbinApi.getById(id),
    enabled: !!id,
    initialData: () => {
      return queryClient
        .getQueryData<Trashbin[]>(["trashbins"])
        ?.find((trashbin) => trashbin.id === id);
    },
  });
}

export function useCreateTrashbin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data }: { data: InsertTrashbin }) =>
      TrashbinApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trashbins"] });
    },
  });
}

export function useUpdateTrashbin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTrashbin }) =>
      TrashbinApi.update(id, data),
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: ["trashbins"] });
      queryClient.invalidateQueries({ queryKey: ["trashbin", id] });
    },
  });
}

export function useDeleteTrashbin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => TrashbinApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trashbins"] });
    },
  });
}

export function useGetAllTrashbinCollections() {
  return useQuery({
    queryKey: ["trashbin-collections"],
    queryFn: TrashbinCollectionsApi.getAll,
  });
}

export function useGetTrashbinCollectionsById(id: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["trashbin-collections", id],
    queryFn: () => TrashbinCollectionsApi.getById(id),
    enabled: !!id,
    initialData: () => {
      return queryClient
        .getQueryData<TrashbinCollections[]>(["trashbin-collections"])
        ?.find((collection) => collection.id === id);
    },
  });
}

export function useGetTrashbinCollectionsByUserId(userId: string) {
  return useQuery({
    queryKey: ["trashbin-collections", "user", userId],
    queryFn: () => TrashbinCollectionsApi.getByUserId(userId),
    enabled: !!userId,
  });
}

export function useDeleteTrashbinCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (collectionId: string) =>
      TrashbinCollectionsApi.delete(collectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trashbin-collections"] });
    },
  });
}

export function useDeleteBatchTrashbinCollections() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (collectionIds: string[]) =>
      Promise.all(collectionIds.map((id) => TrashbinCollectionsApi.delete(id))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trashbin-collections"] });
    },
  });
}

export function useDeleteBatchTrashbins() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) =>
      Promise.all(ids.map((id) => TrashbinApi.delete(id))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trashbins"] });
    },
  });
}

export function useCollectTrashbin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Pick<
        InsertTrashbinCollection,
        "wasteLevel" | "weightLevel" | "batteryLevel"
      >;
    }) => TrashbinApi.collect(id, data),
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: ["trashbins"] });
      queryClient.invalidateQueries({ queryKey: ["trashbin-collections"] });
      queryClient.invalidateQueries({ queryKey: ["trashbin", id] });
    },
  });
}
