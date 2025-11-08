import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { MqttClient } from "mqtt";
import { createMqttClient } from "@/features/mqtt";
import { setConnected } from "@/store/telemetry-store";
import { resetBins, setBinData } from "@/store/realtime-store";
import { useTrashbinLogsStore } from "@/store/trashbin-logs-store";

interface MqttContextType {
  client: MqttClient | null;
  messages: Record<string, string>;
}

const MqttContext = createContext<MqttContextType>({
  client: null,
  messages: {},
});

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
      mqttClient.subscribe("trashbin/detections");
    });

    mqttClient.on("message", (topic, payload) => {
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

        const match = topic.match(/^trashbin\/([^/]+)\/status$/);

        if (!match) return;

        const id = match[1];

        const { status } = message.trashbin;

        setBinData(id, status);
        setMessages(message);
      } catch (e) {
        console.error("Invalid MQTT message:", e);
      }
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

export const useMqtt = () => {
  const context = useContext(MqttContext);

  if (!context) {
    throw new Error("useMqtt must be used within an MqttProvider");
  }

  return context;
};
