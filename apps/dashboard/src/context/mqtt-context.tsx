import type { MqttClient } from "mqtt";
import { createContext } from "react";

interface MqttContextType {
  client: MqttClient | null;
  messages: Record<string, string>;
}

export const MqttContext = createContext<MqttContextType>({
  client: null,
  messages: {},
});
