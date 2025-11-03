import { create } from "zustand";

interface TelemetryData {
  isConnected: boolean;
  setConnected?: (status: boolean) => void;
}

export const useTelemetryStore = create<TelemetryData>((set) => ({
  isConnected: false,
  setConnected: (status: boolean) => set({ isConnected: status }),
}));

export const setConnected = (status: boolean) =>
  useTelemetryStore.getState().setConnected?.(status);
