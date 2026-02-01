"use client";

import { MoreVertical, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ExpensesCategories } from "../data/dashboardData";
import { useAuthUser } from "@/lib/auth/useAuthUser";
import { deleteExpense } from "@/lib/expenses/deleteExpense";
import { updateExpense } from "@/lib/expenses/updateExpense";
import type { ExpenseItem } from "./types";
import { formatAmount, formatDate, toDateInputValue } from "./formatters";
import { AllTransactionsModal } from "./AllTransactionsModal";
import { EditExpenseModal } from "./EditExpenseModal";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import { useExpensesRefreshStore } from "@/lib/store/expensesRefreshStore";

type RecentTransactionsProps = {
  refreshKey?: number;
};

export function RecentTransactions({ refreshKey }: RecentTransactionsProps) {
  const { user, initializing } = useAuthUser();
  const bumpExpensesRefresh = useExpensesRefreshStore((state) => state.bump);
  const [items, setItems] = useState<ExpenseItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAllOpen, setIsAllOpen] = useState(false);
  const [allItems, setAllItems] = useState<ExpenseItem[]>([]);
  const [loadingAll, setLoadingAll] = useState(false);
  const [errorAll, setErrorAll] = useState<string | null>(null);
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<ExpenseItem | null>(null);
  const [editName, setEditName] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editDate, setEditDate] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ExpenseItem | null>(null);
  const [localRefreshKey, setLocalRefreshKey] = useState(0);

  useEffect(() => {
    let isActive = true;

    const loadExpenses = async () => {
      if (!user || initializing) {
        setItems([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const idToken = await user.getIdToken();
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/expenses/all`,
          {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Fetch expenses failed: ${res.status}`);
        }

        const data = await res.json();
        if (!isActive) return;
        const nextItems = Array.isArray(data?.items) ? data.items : [];
        setItems(nextItems.slice(0, 5));
      } catch (err) {
        if (isActive) {
          setError("Không thể tải giao dịch. Vui lòng thử lại.");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadExpenses();

    return () => {
      isActive = false;
    };
  }, [user, initializing, refreshKey, localRefreshKey]);

  useEffect(() => {
    let isActive = true;

    const loadAllExpenses = async () => {
      if (!isAllOpen || !user || initializing) {
        return;
      }

      setLoadingAll(true);
      setErrorAll(null);
      try {
        const idToken = await user.getIdToken();
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/expenses/all`,
          {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Fetch all expenses failed: ${res.status}`);
        }

        const data = await res.json();
        if (!isActive) return;
        setAllItems(Array.isArray(data?.items) ? data.items : []);
      } catch (err) {
        if (isActive) {
          setErrorAll("Không thể tải toàn bộ giao dịch.");
        }
      } finally {
        if (isActive) {
          setLoadingAll(false);
        }
      }
    };

    loadAllExpenses();

    return () => {
      isActive = false;
    };
  }, [isAllOpen, user, initializing, localRefreshKey]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest("[data-transaction-menu]")) {
        return;
      }
      setOpenActionId(null);
    };

    if (openActionId) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openActionId]);

  const filteredItems = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return items;
    return items.filter((item) => {
      const name = item.name?.toLowerCase() ?? "";
      const category = item.categoryName?.toLowerCase() ?? "";
      return name.includes(keyword) || category.includes(keyword);
    });
  }, [items, searchTerm]);


  const handleAmountChange = (value: string) => {
    const raw = value.replace(/,/g, "");
    if (raw === "" || /^\d+$/.test(raw)) {
      setEditAmount(raw);
    }
  };

  const openEditModal = (item: ExpenseItem) => {
    setEditingItem(item);
    setEditName(item.name || "");
    setEditAmount(String(item.amount ?? ""));
    setEditCategoryId(item.categoryId || "");
    setEditDate(toDateInputValue(item.date));
    setOpenActionId(null);
  };

  const handleSaveEdit = async () => {
    if (!editingItem || !user || isSaving) return;

    const trimmedName = editName.trim();
    if (!trimmedName || !editAmount || !editCategoryId || !editDate) return;
    const editDateValue = new Date(editDate);
    if (Number.isNaN(editDateValue.getTime()) || editDateValue.getTime() > Date.now()) {
      return;
    }

    setIsSaving(true);
    try {
      const idToken = await user.getIdToken();
      const category = ExpensesCategories.find(
        (item) => item.id === editCategoryId
      );
      await updateExpense(idToken, editingItem.id, {
        name: trimmedName,
        amount: editAmount,
        categoryId: editCategoryId,
        categoryName: category?.name ?? null,
        date: editDateValue.toISOString(),
      });
      setEditingItem(null);
      setLocalRefreshKey((prev) => prev + 1);
      bumpExpensesRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteExpense = async () => {
    if (!user || !deleteTarget || isDeleting) return;

    try {
      setIsDeleting(true);
      const idToken = await user.getIdToken();
      await deleteExpense(idToken, deleteTarget.id);
      setOpenActionId(null);
      setDeleteTarget(null);
      setLocalRefreshKey((prev) => prev + 1);
      bumpExpensesRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Giao dịch gần đây</h2>
                    <button
                      onClick={() => setIsAllOpen(true)}
                      className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                    >
                        Xem tất cả
                    </button>
                </div>

                {/* Search */}
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm giao dịch..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>

                <div className="space-y-3">
                    {loading && (
                      <div className="text-sm text-gray-500">Đang tải giao dịch...</div>
                    )}
                    {!loading && error && (
                      <div className="text-sm text-rose-500">{error}</div>
                    )}
                    {!loading && !error && filteredItems.length === 0 && (
                      <div className="text-sm text-gray-500">Chưa có giao dịch nào.</div>
                    )}
                    {!loading &&
                      !error &&
                      filteredItems.map((transaction) => {
                        const category =
                          ExpensesCategories.find(
                            (item) => item.id === transaction.categoryId
                          ) ||
                          ExpensesCategories.find(
                            (item) => item.name === transaction.categoryName
                          );
                        const Icon = category?.icon;
                        const colorClass = transaction.type === "income" ? "text-emerald-600" : "text-red-600";
                        const bgClass = category
                          ? `bg-gradient-to-r ${category.color}`
                          : "bg-gray-100";
                        return (
                            <div key={transaction.id} className="flex items-center justify-between py-4 lg:p-4 hover:lg:bg-gray-50 rounded-xl transition-colors">
                                <div className="flex items-center space-x-4 flex-1">
                                    <div className={`${bgClass} p-3 rounded-xl`}>
                                        {Icon ? (
                                          <Icon className="h-5 w-5 text-white" />
                                        ) : (
                                          <span className="h-5 w-5 block rounded-full bg-white/60" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900">{transaction.name}</p>
                                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                                            <span>{transaction.categoryName || "Khác"}</span>
                                            <span>•</span>
                                            <span>{formatDate(transaction.date)}</span>
                                        </div>
                                        <span className={`text-sm font-bold lg:hidden ${colorClass}`}>
                                          {formatAmount(
                                            transaction.amount,
                                            transaction.type,
                                            transaction.currency ?? undefined
                                          )}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <span className={`font-bold hidden lg:block ${colorClass}`}>
                                      {formatAmount(
                                        transaction.amount,
                                        transaction.type,
                                        transaction.currency ?? undefined
                                      )}
                                    </span>
                                    <div className="relative" data-transaction-menu>
                                      <button
                                        onClick={() =>
                                          setOpenActionId((prev) =>
                                            prev === transaction.id ? null : transaction.id
                                          )
                                        }
                                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                                      >
                                        <MoreVertical className="h-5 w-5 text-gray-400" />
                                      </button>
                                      {openActionId === transaction.id && (
                                        <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-10">
                                          <button
                                            className="w-full text-left px-3 py-2 font-semibold cursor-pointer text-gray-700 hover:bg-gray-50"
                                            onClick={() => openEditModal(transaction)}
                                          >
                                            Chỉnh sửa
                                          </button>
                                          <button
                                            className="w-full text-left px-3 py-2 font-semibold cursor-pointer text-red-600 hover:bg-gray-50"
                                            onClick={() => {
                                              setDeleteTarget(transaction);
                                              setOpenActionId(null);
                                            }}
                                          >
                                            Xóa
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <AllTransactionsModal
              open={isAllOpen}
              onClose={() => setIsAllOpen(false)}
              items={allItems}
              loading={loadingAll}
              error={errorAll}
            />
            <EditExpenseModal
              open={!!editingItem}
              isSaving={isSaving}
              editName={editName}
              editAmount={editAmount}
              editCategoryId={editCategoryId}
              editDate={editDate}
              onClose={() => setEditingItem(null)}
              onSave={handleSaveEdit}
              onChangeName={setEditName}
              onChangeAmount={handleAmountChange}
              onChangeCategory={setEditCategoryId}
              onChangeDate={setEditDate}
              isValid={
                !!editName.trim() &&
                !!editAmount &&
                !!editCategoryId &&
                !!editDate
              }
            />
            <ConfirmDeleteModal
              open={!!deleteTarget}
              item={deleteTarget}
              isDeleting={isDeleting}
              onClose={() => setDeleteTarget(null)}
              onConfirm={handleDeleteExpense}
            />
    </>
  );
}
