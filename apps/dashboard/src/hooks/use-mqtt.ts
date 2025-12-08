import { useContext } from "react";
import { MqttContext } from "@/context/mqtt-context";

export const useMqtt = () => {
  const context = useContext(MqttContext);

  if (!context) throw new Error("useMqtt must be used within a MqttProvider");

  return context;
};
