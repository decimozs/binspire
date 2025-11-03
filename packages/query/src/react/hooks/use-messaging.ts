import { useMutation } from "@tanstack/react-query";
import { MessagingApi } from "../../core/";

export function useRegisterFCMToken() {
  return useMutation({
    mutationFn: ({ userId, fcmToken }: { userId: string; fcmToken: string }) =>
      MessagingApi.register(userId, fcmToken),
  });
}

export function useSendNotification() {
  return useMutation({
    mutationFn: ({
      token,
      notification,
    }: {
      token: string;
      notification: { title: string; body: string };
    }) => MessagingApi.sendNotification(token, notification),
  });
}
