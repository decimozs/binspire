import { createContext } from "react";
import type { MqttClient } from "mqtt";

interface MqttContextType {
  client: MqttClient | null;
  messages: Record<string, string>;
}

export const MqttContext = createContext<MqttContextType>({
  client: null,
  messages: {},
});
