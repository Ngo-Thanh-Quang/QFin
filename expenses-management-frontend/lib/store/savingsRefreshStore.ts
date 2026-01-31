import { create } from "zustand";

type SavingsRefreshState = {
  refreshKey: number;
  bump: () => void;
};

export const useSavingsRefreshStore = create<SavingsRefreshState>((set) => ({
  refreshKey: 0,
  bump: () => set((state) => ({ refreshKey: state.refreshKey + 1 })),
}));
