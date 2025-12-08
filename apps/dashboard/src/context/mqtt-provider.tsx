import { useQueryClient } from "@binspire/query";
import type { MqttClient } from "mqtt";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { ShowToast } from "@/components/core/toast-notification";
import type { NotificationItem } from "@/features/notification";
import { authClient } from "@/lib/auth-client";
import { createMqttClient } from "@/lib/mqtt_client";
import {
  resetBins,
  setBatteryLevel,
  setSolarPower,
  setWasteLevel,
  setWeightLevel,
  useRealtimeUpdatesStore,
} from "@/store/realtime-store";
import {
  deleteRoute,
  setRoute,
  setTrackingPosition,
} from "@/store/route-store";
import { setConnected } from "@/store/telemetry-store";
import { useTrashbinLogsStore } from "@/store/trashbin-logs-store";
import { MqttContext } from "./mqtt-context";

interface Props {
  children: ReactNode;
}

const LOCAL_STORAGE_KEY = "notifications";

export function MqttProvider({ children }: Props) {
  const [client, setClient] = useState<MqttClient | null>(null);
  const [messages, setMessages] = useState<Record<string, string>>({});
  const shownCollectionToasts = new Set<string>();
  const shownTelemetryToast = useRef(false);
  const queryClient = useQueryClient();
  const { addUpdate } = useRealtimeUpdatesStore.getState();
  const timeoutRefs = useRef<Record<string, NodeJS.Timeout>>({});

  function refreshInactivityTimer(id: string) {
    if (timeoutRefs.current[id]) {
      clearTimeout(timeoutRefs.current[id]);
    }

    timeoutRefs.current[id] = setTimeout(() => {
      deleteRoute(id);
      delete timeoutRefs.current[id];
    }, 60_000);
  }

  useEffect(() => {
    const mqttClient = createMqttClient();
    setClient(mqttClient);

    mqttClient.on("connect", () => {
      setConnected(true);

      mqttClient.subscribe("trashbin/+/waste_level");
      mqttClient.subscribe("trashbin/+/weight_level");
      mqttClient.subscribe("trashbin/+/battery_level");
      mqttClient.subscribe("trashbin/+/alerts");
      mqttClient.subscribe("trashbin/+/detections");
      mqttClient.subscribe("trashbin/+/tracking");
      mqttClient.subscribe("trashbin/collection");
      mqttClient.subscribe("server/status");
      mqttClient.subscribe("user/permissions/update");
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
              shownTelemetryToast.current = false;
              ShowToast("warning", "Telemetry disconnected.");
            } else {
              setConnected(true);
              if (!shownTelemetryToast.current) {
                ShowToast("success", "Telemetry connected.");
                shownTelemetryToast.current = true;
              }
            }
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

          if (topic.match(/^trashbin\/([^/]+)\/battery_level$/)) {
            const match = topic.match(/^trashbin\/([^/]+)\/battery_level$/);

            if (!match) return;

            const id = match[1];
            const {
              // voltage,
              current_mA,
              // power_W,
              batteryLevel,
              // timestamp,
            } = message;

            setBatteryLevel(id, batteryLevel);
            setSolarPower(id, current_mA);
            setMessages(message);
          }

          if (topic.match(/^trashbin\/([^/]+)\/weight_level$/)) {
            const match = topic.match(/^trashbin\/([^/]+)\/weight_level$/);

            if (!match) return;

            const id = match[1];
            const {
              weightLevel,
              // timestamp,
            } = message;

            setWeightLevel(id, weightLevel);
            setMessages(message);
          }

          if (topic.match(/^trashbin\/([^/]+)\/detections$/)) {
            const match = topic.match(/^trashbin\/([^/]+)\/detections$/);

            if (!match) return;

            const id = match[1];
            const {
              class: className,
              confidence,
              timestamp,
              imageUrl,
            } = message;

            useTrashbinLogsStore.getState().addLog(id, {
              class: className,
              confidence,
              timestamp,
              imageUrl,
            });
          }

          if (topic.match(/^trashbin\/([^/]+)\/waste_level$/)) {
            const match = topic.match(/^trashbin\/([^/]+)\/waste_level$/);

            if (!match) return;

            const id = match[1];
            const {
              wasteLevel,
              // timestamp,
            } = message;

            setWasteLevel(id, wasteLevel);
            setMessages(message);
          }

          if (topic.match(/^trashbin\/([^/]+)\/tracking$/)) {
            const match = topic.match(/^trashbin\/([^/]+)\/tracking$/);
            if (!match) return;

            const id = match[1];
            const { status, routes, userId, name, position } = message;

            refreshInactivityTimer(id);

            if (status === "navigating") {
              setRoute(id, {
                geojson: routes,
                tracker: { userId, name, trashbinId: id },
              });
            }

            if (status === "update-position" && position) {
              setTrackingPosition(id, position);
            }

            if (status === "stop-navigating") {
              deleteRoute(id);

              if (timeoutRefs.current[id]) {
                clearTimeout(timeoutRefs.current[id]);
                delete timeoutRefs.current[id];
              }
            }
          }
        } catch (e) {
          console.error("Invalid MQTT message:", e);
        }
      })();
    });

    mqttClient.on("error", (err) => {
      console.error("MQTT connection error:", err);
      setConnected(false);
    });

    return () => {
      mqttClient.end(true);
      setConnected(false);
      resetBins();
      Object.values(timeoutRefs.current).forEach(clearTimeout);
      timeoutRefs.current = {};
    };
  }, []);

  return (
    <MqttContext.Provider value={{ client, messages }}>
      {children}
    </MqttContext.Provider>
  );
}
