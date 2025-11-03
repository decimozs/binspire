import { useEffect, useState, type ReactNode } from "react";
import { MqttContext } from "./mqtt-context";
import type { MqttClient } from "mqtt";
import { createMqttClient } from "@/lib/mqtt_client";
import { resetBins, setBinData } from "@/store/realtime-store";
import { setConnected } from "@/store/telemetry-store";
import { ShowToast } from "@/components/core/toast-notification";
import { authClient } from "@/lib/auth-client";

interface Props {
  children: ReactNode;
}

export function MqttProvider({ children }: Props) {
  const [client, setClient] = useState<MqttClient | null>(null);
  const [messages, setMessages] = useState<Record<string, string>>({});

  useEffect(() => {
    const mqttClient = createMqttClient();
    setClient(mqttClient);

    mqttClient.on("connect", () => {
      setConnected(true);

      mqttClient.subscribe("trashbin/+/status");
      mqttClient.subscribe("trashbin/collection");
      mqttClient.subscribe("server/status");
      mqttClient.subscribe("user/permissions/update");
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
            } else {
              setConnected(true);
            }
            return;
          }

          if (topic === "trashbin/collection") {
            const { name, location } = message;
            ShowToast("success", `${name} collected at ${location}`);
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
          }

          const match = topic.match(/^trashbin\/([^/]+)\/status$/);
          if (!match) return;

          const id = match[1];
          const { status } = message.trashbin;

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
