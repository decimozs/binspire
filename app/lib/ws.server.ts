import type { WSContext } from "hono/ws";

export const clients = new Set<WSContext>();

export const broadcast = (message: object) => {
  const data = JSON.stringify(message);
  clients.forEach((client) => {
    if (client.readyState === 1) client.send(data);
  });
};
