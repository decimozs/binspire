import { create } from "zustand";

interface MonitoringState {
  enabled: boolean;
  setEnabled: (value: boolean) => void;
}

export const useMonitoringStore = create<MonitoringState>((set) => ({
  enabled: localStorage.getItem("monitoringMode") === "true",
  setEnabled: (value: boolean) => {
    localStorage.setItem("monitoringMode", String(value));
    set({ enabled: value });
  },
}));
