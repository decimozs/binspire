import type { InsertAudit, UpdateAudit } from "@binspire/db/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type Audit, AuditApi } from "../../core";

export function useGetAllAudits() {
  return useQuery({
    queryKey: ["audits"],
    queryFn: AuditApi.getAll,
  });
}

export function useGetAuditById(id: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["audit", id],
    queryFn: () => AuditApi.getById(id),
    enabled: !!id,
    initialData: () => {
      return queryClient
        .getQueryData<Audit[]>(["audits"])
        ?.find((audit: Audit) => audit.id === id);
    },
  });
}

export function useCreateAudit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data }: { data: InsertAudit }) => AuditApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audits"] });
    },
  });
}

export function useUpdateAudit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAudit }) =>
      AuditApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audits"] });
    },
  });
}

export function useDeleteAudit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => AuditApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audits"] });
    },
  });
}

export function useDeleteBatchAudits() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) =>
      Promise.all(ids.map((id) => AuditApi.delete(id))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audits"] });
    },
  });
}
