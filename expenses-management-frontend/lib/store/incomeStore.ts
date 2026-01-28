import { create } from "zustand";

type IncomeState = {
  incomeAmount: number;
  setIncomeAmount: (amount: number) => void;
  hydrateIncomeAmount: (amount: number) => void;
};

const DEFAULT_INCOME = 10400000;

export const useIncomeStore = create<IncomeState>((set) => ({
  incomeAmount: DEFAULT_INCOME,
  setIncomeAmount: (amount) => set({ incomeAmount: amount }),
  hydrateIncomeAmount: (amount) =>
    set((state) => (state.incomeAmount === amount ? state : { incomeAmount: amount })),
}));
