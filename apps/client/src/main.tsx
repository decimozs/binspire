import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { Toaster } from "@binspire/ui/toast";
import { QueryProvider, queryClient } from "@binspire/query";
import { routeTree } from "./routeTree.gen";
import { MapProvider } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import "@binspire/ui/globals.css";
import { ThemeProvider } from "./context/theme-provider";
import { NuqsAdapter } from "nuqs/adapters/react";
import { FontProvider } from "./context/font-provider";
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
            <ThemeProvider>
              <FontProvider>
                <Toaster position="top-center" richColors />
                <NuqsAdapter>
                  <RouterProvider router={router} />
                </NuqsAdapter>
              </FontProvider>
            </ThemeProvider>
          </MapProvider>
        </MqttProvider>
      </QueryProvider>
    </StrictMode>,
  );
}
