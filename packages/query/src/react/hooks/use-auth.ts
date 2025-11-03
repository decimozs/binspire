import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QRCodeApi, type QRCode } from "../../core";
import type { InsertQrCode, UpdateQrCode } from "@binspire/db/schema";

export function useGetAllQRCodes() {
  return useQuery({
    queryKey: ["qrcodes"],
    queryFn: QRCodeApi.getAll,
  });
}

export function useGetQRCodeById(id: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["qrcode", id],
    queryFn: () => QRCodeApi.getById(id),
    enabled: !!id,
    initialData: () => {
      return queryClient
        .getQueryData<QRCode[]>(["qrcodes"])
        ?.find((qrcode: QRCode) => qrcode.id === id);
    },
  });
}

export function useGetQRCodeBySecret(secret: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["qrcode", secret],
    queryFn: () => QRCodeApi.getBySecret(secret),
    enabled: !!secret,
    initialData: () => {
      return queryClient
        .getQueryData<QRCode[]>(["qrcodes"])
        ?.find((qrcode: QRCode) => qrcode.secret === secret);
    },
  });
}

export function useCreateQRCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data }: { data: InsertQrCode }) => QRCodeApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["qrcodes"] });
    },
  });
}

export function useUpdateQRCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateQrCode }) =>
      QRCodeApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["qrcodes"] });
    },
  });
}

export function useDeleteQRCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => QRCodeApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["qrcodes"] });
    },
  });
}
