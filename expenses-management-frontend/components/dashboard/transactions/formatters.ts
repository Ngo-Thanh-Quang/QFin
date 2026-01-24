export const formatAmount = (
  amount: number,
  type?: "expense" | "income",
  currency?: string | null
) => {
  const formatted = Math.abs(amount).toLocaleString("vi-VN");
  const prefix = type === "income" ? "+" : "-";
  const suffix = currency === "VND" || !currency ? "₫" : currency;
  return `${prefix}${suffix}${formatted}`;
};

export const formatDate = (date?: string | null) => {
  if (!date) return "--/--/----";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "--/--/----";
  return parsed.toLocaleDateString("vi-VN");
};

export const toDateInputValue = (date?: string | null) => {
  if (!date) return "";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString().slice(0, 10);
};

export const formatCurrencyValue = (value: string): string => {
  const number = value.replace(/\D/g, "");
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
