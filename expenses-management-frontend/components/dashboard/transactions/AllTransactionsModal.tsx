"use client";

import { useEffect } from "react";
import { ExpensesCategories } from "../data/dashboardData";
import type { ExpenseItem } from "./types";
import { formatAmount, formatDate } from "./formatters";

type AllTransactionsModalProps = {
  open: boolean;
  onClose: () => void;
  items: ExpenseItem[];
  loading: boolean;
  error: string | null;
};

export function AllTransactionsModal({
  open,
  onClose,
  items,
  loading,
  error,
}: AllTransactionsModalProps) {
  useEffect(() => {
    if (!open) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">
            Tất cả giao dịch
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-sm font-semibold"
          >
            Đóng
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto md:p-6 space-y-3">
          {loading && (
            <div className="text-sm text-gray-500">Đang tải giao dịch...</div>
          )}
          {!loading && error && (
            <div className="text-sm text-rose-500">{error}</div>
          )}
          {!loading && !error && items.length === 0 && (
            <div className="text-sm text-gray-500">Chưa có giao dịch nào.</div>
          )}
          {!loading &&
            !error &&
            items.map((transaction) => {
              const category =
                ExpensesCategories.find(
                  (item) => item.id === transaction.categoryId
                ) ||
                ExpensesCategories.find(
                  (item) => item.name === transaction.categoryName
                );
              const Icon = category?.icon;
              const colorClass =
                transaction.type === "income"
                  ? "text-emerald-600"
                  : "text-red-600";
              const bgClass = category
                ? `bg-gradient-to-r ${category.color}`
                : "bg-gray-100";

              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className={`${bgClass} p-3 rounded-xl`}>
                      {Icon ? (
                        <Icon className="h-5 w-5 text-white" />
                      ) : (
                        <span className="h-5 w-5 block rounded-full bg-white/60" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900">
                        {transaction.name}
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{transaction.categoryName || "Khác"}</span>
                        <span>•</span>
                        <span>{formatDate(transaction.date)}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`font-bold ${colorClass}`}>
                    {formatAmount(
                      transaction.amount,
                      transaction.type,
                      transaction.currency ?? undefined
                    )}
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
