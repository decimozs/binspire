import { HistoryApi, type History } from "../../core";
import type { InsertHistory, UpdateHistory } from "@binspire/db/schema";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useGetAllHistories() {
  return useQuery({
    queryKey: ["histories"],
    queryFn: HistoryApi.getAll,
  });
}

export function useGetHistoryById(id: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["history", id],
    queryFn: () => HistoryApi.getById(id),
    enabled: !!id,
    initialData: () => {
      return queryClient
        .getQueryData<History[]>(["histories"])
        ?.find((history: History) => history.id === id);
    },
  });
}

export function useCreateHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data }: { data: InsertHistory }) => HistoryApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["histories"] });
    },
  });
}

export function useUpdateHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateHistory }) =>
      HistoryApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["histories"] });
    },
  });
}

export function useDeleteHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => HistoryApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["histories"] });
    },
  });
}

export function useDeleteBatchHistories() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) =>
      Promise.all(ids.map((id) => HistoryApi.delete(id))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["histories"] });
    },
  });
}
