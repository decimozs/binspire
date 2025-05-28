import { Marker, useMap } from "react-map-gl/maplibre";
import { Button } from "../ui/button";
import { BatteryLow, BatteryWarning, Trash } from "lucide-react";
import type { Trashbin, TrashbinStatus } from "@/lib/types";
import { useQueryState } from "nuqs";
import { trashbinStatusColorMap } from "@/lib/constants";
import { hexToRgba } from "@/lib/utils";
import { useWebsocketStore } from "@/store/websocket.store";
import { useEffect, useState } from "react";
import { useRevalidator } from "react-router";
import mqtt from "mqtt";

export default function TrashbinMarker({ data }: { data: Trashbin[] }) {
  const revalidator = useRevalidator();
  const { current: map } = useMap();
  const [routeDirectionParam] = useQueryState("route_direction");
  const [trashbinIdParam, setTrashbinIdParams] = useQueryState("trashbin_id");
  const [, setViewTrashbinParam] = useQueryState("view_trashbin");
  const lastMessage = useWebsocketStore((s) => s.lastMessage);
  const [liveTrashbin, setLiveTrashbin] = useState<Trashbin>();

  useEffect(() => {
    const mqttClient = mqtt.connect("ws://test.mosquitto.org:8080");

    mqttClient.on("connect", () => {
      console.log("Connected to MQTT broker");
      mqttClient.subscribe("arcovia/trashbin/status");
    });

    mqttClient.on("message", (topic, message) => {
      if (topic === "arcovia/trashbin/status") {
        try {
          const payload = JSON.parse(message.toString());
          console.log(payload);
          const newTrashbin: Trashbin = {
            id: payload.id,
            name: payload.name,
            isActive: payload.isActive,
            isCollected: payload.isCollected,
            wasteStatus: payload.wasteStatus,
            weightStatus: payload.weightStatus,
            batteryStatus: payload.batteryStatus,
            latitude: payload.latitude,
            longitude: payload.longitude,
            wasteLevel: payload.wasteLevel,
            weightLevel: payload.weightLevel,
            batteryLevel: payload.batteryLevel,
            createdAt: new Date(payload.createdAt),
            updatedAt: new Date(payload.updatedAt),
          };

          setLiveTrashbin(newTrashbin);
        } catch (err) {
          console.error("Error parsing MQTT message:", err);
        }
      }
    });

    return () => {
      mqttClient.end();
    };
  }, []);

  useEffect(() => {
    if (liveTrashbin?.id === "f0nNI_aFd29dEM4H-bpqS") {
      console.log("Live status:", liveTrashbin.wasteStatus);
    }
  }, [liveTrashbin]);

  useEffect(() => {
    if (lastMessage !== null) {
      try {
        const parsed = JSON.parse(lastMessage.data);
        if (parsed.transaction === "collect-trashbin" && parsed.trashbinId) {
          revalidator.revalidate();
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    }
  }, [lastMessage, revalidator]);

  const handleReviewTrashbin = (
    id: string,
    longitude: string,
    latitude: string,
  ) => {
    const offsetLng = 0.0002;
    map?.flyTo({
      center: [Number(longitude) + offsetLng, Number(latitude)],
      zoom: 20,
      essential: true,
      duration: 2000,
    });
    setTrashbinIdParams(id);
    setViewTrashbinParam("true");
  };

  const getTrashbinColor = (item: Trashbin) => {
    if (item.wasteStatus === "empty" || item.wasteStatus === "0") {
      return hexToRgba("#4ade80", 0.7);
    }
    return hexToRgba(
      trashbinStatusColorMap[item.wasteStatus as TrashbinStatus],
      0.7,
    );
  };

  const displayTrashbins = data.map((item) => {
    if (liveTrashbin && item.id === liveTrashbin.id) {
      return liveTrashbin;
    }
    return item;
  });

  return (
    <>
      {displayTrashbins.map((item) => (
        <Marker
          longitude={Number(item.longitude)}
          latitude={Number(item.latitude)}
          key={item.id}
        >
          {routeDirectionParam && trashbinIdParam === item.id ? (
            <Button
              size="icon"
              onClick={() =>
                handleReviewTrashbin(item.id, item.longitude, item.latitude)
              }
            >
              <Trash />
            </Button>
          ) : (
            <div className="flex flex-col items-center">
              {item.batteryStatus === "low" && (
                <BatteryLow size={20} className="fill-red-400" />
              )}
              {item.batteryStatus === "critical" && (
                <BatteryWarning size={20} className="fill-red-500" />
              )}
              <Button
                variant="secondary"
                size="icon"
                onClick={() =>
                  handleReviewTrashbin(item.id, item.longitude, item.latitude)
                }
                style={{
                  backgroundColor: getTrashbinColor(item),
                }}
              >
                <Trash />
                {(item.wasteStatus === "full" ||
                  item.wasteStatus === "overflowing") && (
                  <span className="absolute flex size-3 z-0 h-[50px] w-[50px]">
                    <span
                      className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${
                        item.wasteStatus === "full"
                          ? "bg-red-500"
                          : "bg-violet-500"
                      }`}
                    ></span>
                  </span>
                )}
              </Button>
            </div>
          )}
        </Marker>
      ))}
    </>
  );
}
