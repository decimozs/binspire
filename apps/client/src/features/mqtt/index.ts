import mqtt from "mqtt";

const MQTT_URL = import.meta.env.VITE_MQTT_URL!;

export const createMqttClient = () => {
  const client = mqtt.connect(MQTT_URL, {
    username: import.meta.env.VITE_MQTT_USERNAME!,
    password: import.meta.env.VITE_MQTT_PASSWORD!,
    reconnectPeriod: 2000,
    connectTimeout: 5000,
    port: Number(import.meta.env.VITE_MQTT_PORT!),
    rejectUnauthorized: false,
    keepalive: 30,
    clean: true,
    clientId: `binspire_mqtt${Math.random().toString(16).substr(2, 8)}`,
  });

  return client;
};
