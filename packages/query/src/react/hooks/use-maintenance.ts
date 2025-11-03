import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MaintenanceApi, type Maintenance } from "../../core";
import type { InsertMaintenance, UpdateMaintenance } from "@binspire/db/schema";

export function useGetAllMaintenance() {
  return useQuery({
    queryKey: ["maintenance"],
    queryFn: MaintenanceApi.getAll,
  });
}

export function useGetMaintenanceById(id: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["maintenance", id],
    queryFn: () => MaintenanceApi.getById(id),
    enabled: !!id,
    initialData: () => {
      return queryClient
        .getQueryData<Maintenance[]>(["maintenance"])
        ?.find((maintenance: Maintenance) => maintenance.id === id);
    },
  });
}

export function useCreateMaintenance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data }: { data: InsertMaintenance }) =>
      MaintenanceApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance"] });
    },
  });
}

export function useUpdateMaintenance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMaintenance }) =>
      MaintenanceApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance"] });
    },
  });
}

export function useDeleteMaintenance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => MaintenanceApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance"] });
    },
  });
}
