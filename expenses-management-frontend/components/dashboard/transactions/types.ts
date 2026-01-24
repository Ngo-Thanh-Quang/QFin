export type ExpenseItem = {
  id: string;
  name: string;
  amount: number;
  type?: "expense" | "income";
  categoryId?: string | null;
  categoryName?: string | null;
  date?: string | null;
  currency?: string | null;
};
