import { create } from "zustand";

interface TrashbinLog {
  timestamp: string;
  class: string;
  confidence: number;
  imageUrl: string;
}

interface TrashbinLogsState {
  logs: Record<string, TrashbinLog[]>;
  addLog: (id: string, log: TrashbinLog) => void;
  resetLogs: (id?: string) => void;
}

export const useTrashbinLogsStore = create<TrashbinLogsState>((set) => ({
  logs: {},
  addLog: (id, log) =>
    set((state) => ({
      logs: {
        ...state.logs,
        [id]: [...(state.logs[id] || []), { ...log }],
      },
    })),
  resetLogs: (id) =>
    set((state) => ({
      logs: id ? { ...state.logs, [id]: [] } : {},
    })),
}));
