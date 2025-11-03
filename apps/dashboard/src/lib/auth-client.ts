import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/auth`,
  fetchOptions: {
    credentials: "include",
  },
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
