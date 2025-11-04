import { create } from "zustand";

export interface TrashDetection {
  event: string;
  class: string;
  confidence: number;
  timestamp: string;
}

interface TrashbinLogsState {
  logs: Record<string, TrashDetection[]>;
  addLog: (binId: string, log: TrashDetection) => void;
  resetLogs: () => void;
}

export const useTrashbinLogsStore = create<TrashbinLogsState>((set) => ({
  logs: {},
  addLog: (binId, log) =>
    set((state) => ({
      logs: {
        ...state.logs,
        [binId]: [...(state.logs[binId] || []), log],
      },
    })),
  resetLogs: () => set({ logs: {} }),
}));
