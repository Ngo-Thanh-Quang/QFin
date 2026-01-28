import { create } from "zustand";

type ExpensesRefreshState = {
  refreshKey: number;
  bump: () => void;
};

export const useExpensesRefreshStore = create<ExpensesRefreshState>((set) => ({
  refreshKey: 0,
  bump: () => set((state) => ({ refreshKey: state.refreshKey + 1 })),
}));
