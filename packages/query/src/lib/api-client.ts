import { hcWithType } from "@binspire/api/rpc";

export const rpc = hcWithType(import.meta.env.VITE_SERVER_BASE_URL!, {
  init: {
    credentials: "include",
  },
}).v1;
