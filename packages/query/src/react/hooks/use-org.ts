import type { UpdateOrganization } from "@binspire/db/schema";
import type { OrganizationSettingsOpts } from "@binspire/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  OrganizationApi,
  OrganizationSettingsApi,
  type Organization,
} from "../../core";

export function useGetAllOrganizations() {
  return useQuery({
    queryKey: ["organizations"],
    queryFn: OrganizationApi.getAll,
  });
}

export function useGetOrganizationById(id: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["organization", id],
    queryFn: () => OrganizationApi.getById(id),
    enabled: !!id,
    initialData: () => {
      return queryClient
        .getQueryData<Organization[]>(["organizations"])
        ?.find((org) => org.id === id);
    },
  });
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrganization }) =>
      OrganizationApi.update(id, data),
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: ["organization", id] });
    },
  });
}

export function useGetOrganizationSettingsById(id: string) {
  return useQuery({
    queryKey: ["organization-settings", id],
    queryFn: () => OrganizationSettingsApi.getByOrgId(id),
    enabled: !!id,
  });
}

export function useUpdateOrganizationSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orgId,
      data,
    }: {
      orgId: string;
      data: OrganizationSettingsOpts;
    }) => OrganizationSettingsApi.update(orgId, data),
    onSuccess: ({ organizationId }) => {
      queryClient.invalidateQueries({ queryKey: ["organization-settings"] });
      queryClient.invalidateQueries({
        queryKey: ["organization-settings", organizationId],
      });
    },
  });
}

export function useUpdateOrgSecret() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orgId, secret }: { orgId: string; secret: string }) =>
      OrganizationSettingsApi.updateSecret(orgId, secret),
    onSuccess: ({ organizationId }) => {
      queryClient.invalidateQueries({ queryKey: ["organization-settings"] });
      queryClient.invalidateQueries({
        queryKey: ["organization-settings", organizationId],
      });
    },
  });
}
