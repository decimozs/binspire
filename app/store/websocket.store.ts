import { create } from "zustand";

type WebsocketStore = {
  lastMessage: MessageEvent<any> | null;
  sendJsonMessage: ((msg: any) => void) | null;
  readyState: number;
  setLastMessage: (msg: MessageEvent<any>) => void;
  setSendJsonMessage: (fn: (msg: any) => void) => void;
  setReadyState: (state: number) => void;
};

export const useWebsocketStore = create<WebsocketStore>((set) => ({
  lastMessage: null,
  sendJsonMessage: null,
  readyState: 0,
  setLastMessage: (msg) => set({ lastMessage: msg }),
  setSendJsonMessage: (fn) => set({ sendJsonMessage: fn }),
  setReadyState: (state) => set({ readyState: state }),
}));
