import { QueryProvider, queryClient } from "@binspire/query";
import { Toaster } from "@binspire/ui/toast";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { NuqsAdapter } from "nuqs/adapters/react";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { MapProvider } from "react-map-gl/maplibre";
import { FontProvider } from "./context/font-provider";
import { MapLayerProvider } from "./context/map-layer-provider";
import { ThemeProvider } from "./context/theme-provider";
import { routeTree } from "./routeTree.gen";
import "maplibre-gl/dist/maplibre-gl.css";
import "@binspire/ui/globals.css";
import "./scrollbar.css";
import { MqttProvider } from "./context/mqtt-provider";

const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error(
    "Root element not found. Check if it's in your index.html or if the id is correct.",
  );
}

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryProvider>
        <MqttProvider>
          <MapProvider>
            <MapLayerProvider>
              <FontProvider>
                <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                  <Toaster position="bottom-right" richColors expand />
                  <NuqsAdapter>
                    <RouterProvider router={router} />
                  </NuqsAdapter>
                </ThemeProvider>
              </FontProvider>
            </MapLayerProvider>
          </MapProvider>
        </MqttProvider>
      </QueryProvider>
    </StrictMode>,
  );
}
