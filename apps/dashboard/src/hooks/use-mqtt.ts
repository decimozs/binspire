import { MqttContext } from "@/context/mqtt-context";
import { useContext } from "react";

export const useMqtt = () => {
  const context = useContext(MqttContext);

  if (!context) throw new Error("useMqtt must be used within a MqttProvider");

  return context;
};
