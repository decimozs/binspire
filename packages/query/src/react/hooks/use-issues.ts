import type { InsertIssue, UpdateIssue } from "@binspire/db/schema";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { IssueApi, type Issue } from "../../core";

export function useGetAllIssues() {
  return useQuery({
    queryKey: ["issues"],
    queryFn: IssueApi.getAll,
  });
}

export function useGetIssueById(id: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["issue", id],
    queryFn: () => IssueApi.getById(id),
    enabled: !!id,
    initialData: () => {
      return queryClient
        .getQueryData<Issue[]>(["issues"])
        ?.find((issue: Issue) => issue.id === id);
    },
  });
}

export function useCreateIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data }: { data: InsertIssue }) => IssueApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
  });
}

export function useUpdateIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateIssue }) =>
      IssueApi.update(id, data),
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      queryClient.invalidateQueries({ queryKey: ["issue", id] });
    },
  });
}

export function useDeleteIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => IssueApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
  });
}

export function useDeleteBatchIssues() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) =>
      Promise.all(ids.map((id) => IssueApi.delete(id))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
  });
}
