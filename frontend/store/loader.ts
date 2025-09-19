import { create } from "zustand";

interface LoaderState {
  isVisible: boolean;
  title: string;
  leftOffsetPx?: number;
  show: (title: string, leftOffsetPx?: number) => void;
  hide: () => void;
}

export const useLoaderStore = create<LoaderState>((set) => ({
  isVisible: false,
  title: "Loading...",
  leftOffsetPx: undefined,
  show: (title: string, leftOffsetPx?: number) => set({ 
    isVisible: true, 
    title: title || "Loading...",
    leftOffsetPx 
  }),
  hide: () => set({ isVisible: false, leftOffsetPx: undefined }),
}));
