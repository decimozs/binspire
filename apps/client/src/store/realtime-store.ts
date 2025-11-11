import { create } from "zustand";

interface TrashbinRealtimeData {
  wasteLevel: number;
  weightLevel: number;
  batteryLevel: number;
  solarPower: number;
}

interface TrashbinRealtimeState {
  bins: Record<string, TrashbinRealtimeData>;
  setBinData: (id: string, data: TrashbinRealtimeData) => void;
  setWasteLevel: (id: string, wasteLevel: number) => void;
  setWeightLevel: (id: string, weightLevel: number) => void;
  setBatteryLevel: (id: string, batteryLevel: number) => void;
  setSolarPower: (id: string, solarPower: number) => void;
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

  setWasteLevel: (id, wasteLevel) =>
    set((state) => ({
      bins: {
        ...state.bins,
        [id]: {
          ...state.bins[id],
          wasteLevel,
        },
      },
    })),

  setWeightLevel: (id, weightLevel) =>
    set((state) => ({
      bins: {
        ...state.bins,
        [id]: {
          ...state.bins[id],
          weightLevel,
        },
      },
    })),

  setBatteryLevel: (id, batteryLevel) =>
    set((state) => ({
      bins: {
        ...state.bins,
        [id]: {
          ...state.bins[id],
          batteryLevel,
        },
      },
    })),

  setSolarPower: (id, solarPower) =>
    set((state) => ({
      bins: {
        ...state.bins,
        [id]: {
          ...state.bins[id],
          solarPower,
        },
      },
    })),

  resetBins: () => set({ bins: {} }),
}));

export const setBinData = (id: string, data: TrashbinRealtimeData) =>
  useTrashbinRealtime.getState().setBinData(id, data);

export const setWasteLevel = (id: string, wasteLevel: number) =>
  useTrashbinRealtime.getState().setWasteLevel(id, wasteLevel);

export const setWeightLevel = (id: string, weightLevel: number) =>
  useTrashbinRealtime.getState().setWeightLevel(id, weightLevel);

export const setBatteryLevel = (id: string, batteryLevel: number) =>
  useTrashbinRealtime.getState().setBatteryLevel(id, batteryLevel);

export const setSolarPower = (id: string, solarPower: number) =>
  useTrashbinRealtime.getState().setSolarPower(id, solarPower);

export const resetBins = () => useTrashbinRealtime.getState().resetBins();

interface Update {
  msg: string;
  timestamp: string;
}

interface UpdatesState {
  updates: Update[];
  addUpdate: (update: Update) => void;
  clearUpdates: () => void;
}

export const useRealtimeUpdatesStore = create<UpdatesState>((set) => ({
  updates: [],
  addUpdate: (update) =>
    set((state) => ({
      updates: [update, ...state.updates].slice(0, 20),
    })),
  clearUpdates: () => set({ updates: [] }),
}));
