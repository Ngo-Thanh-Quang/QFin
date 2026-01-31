import { create } from "zustand";

type IncomeRefreshState = {
  refreshKey: number;
  bump: () => void;
};

export const useIncomeRefreshStore = create<IncomeRefreshState>((set) => ({
  refreshKey: 0,
  bump: () => set((state) => ({ refreshKey: state.refreshKey + 1 })),
}));
