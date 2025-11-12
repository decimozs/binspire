import { create } from "zustand";

interface ORSMetadata {
  attribution?: string;
  engine?: {
    build_date?: string;
    version?: string;
    osm_date?: string;
  };
  query?: {
    profile?: string;
    coordinates?: [number, number][];
  };
}

interface ORSFeatureCollection extends GeoJSON.FeatureCollection {
  metadata?: ORSMetadata;
}

interface TrackingData {
  userId: string;
  name: string;
  trashbinId: string;
  position?: [number, number];
}

interface RouteData {
  geojson: ORSFeatureCollection;
  tracker?: TrackingData;
}

interface RouteState {
  routes: Record<string, RouteData>;
  setRoute: (trashbinId: string, routeData: RouteData) => void;
  setTrackingPosition: (trashbinId: string, position: [number, number]) => void;
  deleteRoute: (trashbinId: string) => void;
  clearRoutes: () => void;
}

export const useRouteStore = create<RouteState>((set) => ({
  routes: {},

  setRoute: (trashbinId, routeData) =>
    set((state) => ({
      routes: { ...state.routes, [trashbinId]: routeData },
    })),

  setTrackingPosition: (trashbinId, position) =>
    set((state) => {
      const routeData = state.routes[trashbinId];
      if (!routeData) return state;

      return {
        routes: {
          ...state.routes,
          [trashbinId]: {
            ...routeData,
            tracker: {
              ...routeData.tracker,
              position,
              userId: routeData.tracker?.userId ?? "",
              name: routeData.tracker?.name ?? "",
              trashbinId: routeData.tracker?.trashbinId ?? trashbinId,
            },
          },
        },
      };
    }),

  deleteRoute: (trashbinId) =>
    set((state) => {
      const { [trashbinId]: _, ...rest } = state.routes;
      return { routes: rest };
    }),

  clearRoutes: () => set({ routes: {} }),
}));

export const setRoute = (trashbinId: string, routeData: RouteData) => {
  useRouteStore.getState().setRoute(trashbinId, routeData);
};

export const setTrackingPosition = (
  trashbinId: string,
  position: [number, number],
) => {
  useRouteStore.getState().setTrackingPosition(trashbinId, position);
};

export const deleteRoute = (trashbinId: string) => {
  useRouteStore.getState().deleteRoute(trashbinId);
};

export const clearRoutes = () => {
  useRouteStore.getState().clearRoutes();
};
