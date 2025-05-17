import type { Notification } from "@/lib/types";
import { create } from "zustand";

type NotificationStore = {
  notifications: Notification[];
  setNotifications: (data: Notification[]) => void;
  addNotification: (notif: Notification) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
};

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  setNotifications: (data) =>
    set({
      notifications: data.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    }),
  addNotification: (notif) =>
    set((state) => ({
      notifications: [notif, ...state.notifications].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  clearNotifications: () => set({ notifications: [] }),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === id
          ? { ...notification, status: "read" }
          : notification,
      ),
    })),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((i) => ({
        ...i,
        status: "read",
      })),
    })),
}));
