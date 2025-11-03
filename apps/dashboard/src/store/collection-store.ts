import { create } from "zustand";

export interface CollectorDetails {
  id: string;
  name: string;
  email: string;
  image: string;
}

interface TrashbinCollector {
  trashbinId: string;
  collectors: CollectorDetails[];
}

interface CollectionStore {
  assignCollector: TrashbinCollector[];
  setAssignCollector: (trashbinId: string, collector: CollectorDetails) => void;
  removeAssignCollector: (trashbinId: string, collectorId: string) => void;
  resetTrashbinCollectors: (trashbinId: string) => void;
  resetAssignCollector: () => void;
}

const MAX_COLLECTORS = 3;

export const useCollectionStore = create<CollectionStore>((set) => ({
  assignCollector: [],

  setAssignCollector: (trashbinId, collector) =>
    set((state) => {
      const isCollectorAlreadyAssigned = state.assignCollector.some((item) =>
        item.collectors.some((c) => c.id === collector.id),
      );
      if (isCollectorAlreadyAssigned) return state;

      const existing = state.assignCollector.find(
        (a) => a.trashbinId === trashbinId,
      );

      if (existing) {
        if (existing.collectors.length >= MAX_COLLECTORS) return state;

        const updated = state.assignCollector.map((a) =>
          a.trashbinId === trashbinId
            ? { ...a, collectors: [...a.collectors, collector] }
            : a,
        );

        return { assignCollector: updated };
      }

      return {
        assignCollector: [
          ...state.assignCollector,
          { trashbinId, collectors: [collector] },
        ],
      };
    }),

  removeAssignCollector: (trashbinId, collectorId) =>
    set((state) => {
      const updated = state.assignCollector
        .map((a) =>
          a.trashbinId === trashbinId
            ? {
                ...a,
                collectors: a.collectors.filter((c) => c.id !== collectorId),
              }
            : a,
        )
        .filter((a) => a.collectors.length > 0);

      return { assignCollector: updated };
    }),

  resetAssignCollector: () => set({ assignCollector: [] }),

  resetTrashbinCollectors: (trashbinId) =>
    set((state) => ({
      assignCollector: state.assignCollector.filter(
        (a) => a.trashbinId !== trashbinId,
      ),
    })),
}));

export const setAssignCollector = (
  trashbinId: string,
  collector: CollectorDetails,
) => useCollectionStore.getState().setAssignCollector(trashbinId, collector);

export const removeAssignCollector = (
  trashbinId: string,
  collectorId: string,
) =>
  useCollectionStore.getState().removeAssignCollector(trashbinId, collectorId);

export const resetAssignCollector = () =>
  useCollectionStore.getState().resetAssignCollector();

export const resetTrashbinCollectors = (trashbinId: string) =>
  useCollectionStore.getState().resetTrashbinCollectors(trashbinId);

export const resetAllCollectors = () =>
  useCollectionStore.setState({ assignCollector: [] });
