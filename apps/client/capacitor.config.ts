import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.binspire.app",
  appName: "Binspire",
  webDir: "dist",
  server: {
    hostname: "client.binspire.space",
  },
};

export default config;
