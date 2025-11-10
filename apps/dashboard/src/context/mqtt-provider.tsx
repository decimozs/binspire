import { useEffect, useState, type ReactNode } from "react";
import { MqttContext } from "./mqtt-context";
import type { MqttClient } from "mqtt";
import { createMqttClient } from "@/lib/mqtt_client";
import {
  resetBins,
  setBinData,
  useRealtimeUpdatesStore,
} from "@/store/realtime-store";
import { setConnected } from "@/store/telemetry-store";
import { ShowToast } from "@/components/core/toast-notification";
import { authClient } from "@/lib/auth-client";
import { useTrashbinLogsStore } from "@/store/trashbin-logs-store";
import { useQueryClient } from "@binspire/query";
import type { NotificationItem } from "@/features/notification";

interface Props {
  children: ReactNode;
}

const LOCAL_STORAGE_KEY = "notifications";

export function MqttProvider({ children }: Props) {
  const [client, setClient] = useState<MqttClient | null>(null);
  const [messages, setMessages] = useState<Record<string, string>>({});
  const shownCollectionToasts = new Set<string>();
  const queryClient = useQueryClient();
  const { addUpdate } = useRealtimeUpdatesStore.getState();

  useEffect(() => {
    const mqttClient = createMqttClient();
    setClient(mqttClient);

    mqttClient.on("connect", () => {
      setConnected(true);

      mqttClient.subscribe("trashbin/+/status");
      mqttClient.subscribe("trashbin/+/alerts");
      mqttClient.subscribe("trashbin/collection");
      mqttClient.subscribe("server/status");
      mqttClient.subscribe("user/permissions/update");
      mqttClient.subscribe("trashbin/detections");
      mqttClient.subscribe("users-requests");
      mqttClient.subscribe("issues");
    });

    mqttClient.on("message", (topic, payload) => {
      (async () => {
        try {
          const message = JSON.parse(payload.toString());

          if (topic === "server/status") {
            const { server } = message;

            if (server === "offline") {
              setConnected(false);
              resetBins();
              ShowToast("warning", "Telemetry disconnected.");
            } else {
              setConnected(true);
              ShowToast("success", "Telemetry connected.");
            }
            return;
          }

          if (topic === "trashbin/detections") {
            const {
              bin_id,
              event,
              class: className,
              confidence,
              timestamp,
            } = message;
            useTrashbinLogsStore.getState().addLog(bin_id, {
              event,
              class: className,
              confidence,
              timestamp,
            });
            return;
          }

          if (
            topic.startsWith("trashbin/") &&
            topic.endsWith("/alerts") &&
            window.location.pathname.startsWith("/map")
          ) {
            const { event, name, location, battery_level, timestamp } = message;

            if (event === "battery_low") {
              const msg = `Low battery detected for ${name} (${battery_level}%) at ${location}.`;
              addUpdate({ msg, timestamp });
            }

            if (event === "battery_critical") {
              const msg = `Critical battery detected for ${name} (${battery_level}%) at ${location}.`;
              addUpdate({ msg, timestamp });
            }

            if (event === "almost-full") {
              const msg = `${name} is almost full.`;
              addUpdate({ msg, timestamp });
            }

            if (event === "full") {
              const msg = `${name} is full.`;
              addUpdate({ msg, timestamp });
            }

            return;
          }

          if (topic === "trashbin/collection") {
            queryClient.invalidateQueries({
              queryKey: ["trashbin-collections"],
            });

            const { trashbinId, name, location, key, url } = message;

            if (!shownCollectionToasts.has(trashbinId)) {
              ShowToast(
                "success",
                `${name} collected at ${location}`,
                "bottom-right",
                true,
                { key, url },
              );

              shownCollectionToasts.add(trashbinId);

              setTimeout(() => shownCollectionToasts.delete(trashbinId), 5000);
            }

            return;
          }

          if (topic === "user/permissions/update") {
            const { userId } = message;
            const session = await authClient.getSession();
            const currentUserId = session?.data?.user.id;

            if (userId === currentUserId) {
              ShowToast(
                "info",
                "Your permissions have been updated. Please refresh the page.",
                "top-center",
              );
            }

            return;
          }

          if (topic === "users-requests" || topic === "issues") {
            const { userId, title, description, timestamp, key, url } = message;
            const session = await authClient.getSession();
            const currentUserId = session?.data?.user.id;

            if (userId === currentUserId) return;

            const stored = localStorage.getItem(LOCAL_STORAGE_KEY);

            let currentNotifications: NotificationItem[] = [];

            if (stored) currentNotifications = JSON.parse(stored);

            const newNotif: NotificationItem = {
              id: Date.now(),
              title,
              description,
              timestamp,
              key,
              url,
              isRead: false,
            };

            const updatedNotifications = [newNotif, ...currentNotifications];

            localStorage.setItem(
              LOCAL_STORAGE_KEY,
              JSON.stringify(updatedNotifications),
            );

            window.dispatchEvent(
              new CustomEvent("notifications-updated", {
                detail: updatedNotifications,
              }),
            );

            return;
          }

          const match = topic.match(/^trashbin\/([^/]+)\/status$/);

          if (!match) return;

          const id = match[1];
          const { status, name, location, timestamp } = message.trashbin;

          const MAX_DISTANCE = 53;
          const fillLevel = Math.max(
            0,
            Math.min(
              100,
              ((MAX_DISTANCE - status.wasteLevel) / MAX_DISTANCE) * 100,
            ),
          ).toFixed(0);

          let msg: string = "";

          if (status.levelType === "empty") {
            msg = `${name} is currently empty at ${location}. No collection needed.`;
          } else if (status.levelType === "low") {
            msg = `${name} has a low waste level (${fillLevel}%) at ${location}. Monitoring recommended.`;
          } else if (status.levelType === "almost-full") {
            msg = `${name} is almost full (${fillLevel}%) at ${location}. Schedule collection soon.`;
          } else if (status.levelType === "full") {
            msg = `${name} is full (${fillLevel}%) at ${location}. Immediate collection advised.`;
          } else if (status.levelType === "overflowing") {
            msg = `${name} is overflowing (${fillLevel}%) at ${location}. Urgent collection required!`;
          }

          if (status.weightLevel >= 25) {
            msg += ` Current weight is ${status.weightLevel} kg, check for overload.`;
          }

          addUpdate({ msg, timestamp });
          setBinData(id, status);
          setMessages(message);
        } catch (e) {
          console.error("Invalid MQTT message:", e);
        }
      })();
    });

    mqttClient.on("error", (err) => {
      console.error("❌ MQTT connection error:", err);
      setConnected(false);
    });

    return () => {
      mqttClient.end(true);
      setConnected(false);
      resetBins();
    };
  }, []);

  return (
    <MqttContext.Provider value={{ client, messages }}>
      {children}
    </MqttContext.Provider>
  );
}
