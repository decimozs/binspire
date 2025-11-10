import { create } from "zustand";

interface TrashbinRealtimeData {
  wasteLevel: number;
  weightLevel: number;
  batteryLevel: number;
}

interface TrashbinRealtimeState {
  bins: Record<string, TrashbinRealtimeData>;
  setBinData: (id: string, data: TrashbinRealtimeData) => void;
  resetBins: () => void;
}

export const useTrashbinRealtime = create<TrashbinRealtimeState>((set) => ({
  bins: {},
  setBinData: (id, data) =>
    set((state) => ({
      bins: {
        ...state.bins,
        [id]: data,
      },
    })),
  resetBins: () => set({ bins: {} }),
}));

export const setBinData = (id: string, data: TrashbinRealtimeData) =>
  useTrashbinRealtime.getState().setBinData(id, data);

export const resetBins = () => useTrashbinRealtime.getState().resetBins();

interface UpdatesState {
  updates: string[];
  addUpdate: (msg: string) => void;
  clearUpdates: () => void;
}

export const useRealtimeUpdatesStore = create<UpdatesState>((set) => ({
  updates: [],
  addUpdate: (msg) =>
    set((state) => ({
      updates: [msg, ...state.updates].slice(0, 20),
    })),
  clearUpdates: () => set({ updates: [] }),
}));
