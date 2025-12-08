import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/auth`,
  plugins: [
    inferAdditionalFields({
      user: {
        orgId: {
          type: "string",
        },
      },
    }),
  ],
});
