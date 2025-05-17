import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import { useWebsocketStore } from "@/store/websocket.store";

export const WebSocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isClient, setIsClient] = useState(false); // Ensure this is only set once client-side

  const setLastMessage = useWebsocketStore((state) => state.setLastMessage);
  const setSendJsonMessage = useWebsocketStore(
    (state) => state.setSendJsonMessage,
  );
  const setReadyState = useWebsocketStore((state) => state.setReadyState);

  useEffect(() => {
    setIsClient(true); // Only run WebSocket logic client-side
  }, []);

  const { lastMessage, sendJsonMessage, readyState } = useWebSocket(
    isClient ? "ws://localhost:5173/ws" : null, // Delay WebSocket connection until mounted
    isClient ? { share: true, shouldReconnect: () => true } : undefined,
  );

  useEffect(() => {
    if (lastMessage) setLastMessage(lastMessage);
  }, [lastMessage, setLastMessage]);

  useEffect(() => {
    if (sendJsonMessage) setSendJsonMessage(() => sendJsonMessage);
  }, [sendJsonMessage, setSendJsonMessage]);

  useEffect(() => {
    if (readyState !== undefined) setReadyState(readyState);
  }, [readyState, setReadyState]);

  if (!isClient) return <>{children}</>; // Avoid rendering WebSocket logic before mounting

  return <>{children}</>;
};
