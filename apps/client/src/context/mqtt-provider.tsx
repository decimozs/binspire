import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { MqttClient } from "mqtt";
import { createMqttClient } from "@/features/mqtt";
import { setConnected } from "@/store/telemetry-store";
import {
  resetBins,
  setBatteryLevel,
  setSolarPower,
  setWasteLevel,
  setWeightLevel,
} from "@/store/realtime-store";
import { useTrashbinLogsStore } from "@/store/trashbin-logs-store";
import { ShowToast } from "@/components/toast";

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
  const shownTelemetryToast = useRef(false);
  const [messages, setMessages] = useState<Record<string, string>>({});

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
      mqttClient.subscribe("trashbin/collection");
      mqttClient.subscribe("server/status");
    });

    mqttClient.on("message", (topic, payload) => {
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
          const { class: className, confidence, timestamp, imageUrl } = message;

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
