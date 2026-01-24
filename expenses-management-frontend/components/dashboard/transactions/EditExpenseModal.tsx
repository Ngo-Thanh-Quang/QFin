"use client";

import { ChevronDown, Pencil, X } from "lucide-react";
import { ExpensesCategories } from "../data/dashboardData";
import { formatCurrencyValue } from "./formatters";

type EditExpenseModalProps = {
  open: boolean;
  isSaving: boolean;
  editName: string;
  editAmount: string;
  editCategoryId: string;
  editDate: string;
  onClose: () => void;
  onSave: () => void;
  onChangeName: (value: string) => void;
  onChangeAmount: (value: string) => void;
  onChangeCategory: (value: string) => void;
  onChangeDate: (value: string) => void;
  isValid: boolean;
};

export function EditExpenseModal({
  open,
  isSaving,
  editName,
  editAmount,
  editCategoryId,
  editDate,
  onClose,
  onSave,
  onChangeName,
  onChangeAmount,
  onChangeCategory,
  onChangeDate,
  isValid,
}: EditExpenseModalProps) {
  if (!open) return null;

  const maxDate = new Date().toISOString().slice(0, 10);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={() => (isSaving ? null : onClose())}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scale-in overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <Pencil className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Chỉnh sửa chi tiêu</h3>
                <p className="text-sm text-white/80">
                  Cập nhật thông tin giao dịch
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              disabled={isSaving}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tên chi tiêu
            </label>
            <input
              type="text"
              value={editName}
              onChange={(e) => onChangeName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Thời gian
            </label>
            <input
              type="date"
              value={editDate}
              onChange={(e) => onChangeDate(e.target.value)}
              max={maxDate}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Loại
            </label>
            <div className="relative">
              <select
                value={editCategoryId}
                onChange={(e) => onChangeCategory(e.target.value)}
                className="w-full appearance-none px-4 py-3 pr-10 border-2 border-gray-200 rounded-xl bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all cursor-pointer"
              >
                {ExpensesCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                <ChevronDown />
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Chi phí (VND)
            </label>
            <div className="relative">
              <input
                type="text"
                value={formatCurrencyValue(editAmount)}
                onChange={(e) => onChangeAmount(e.target.value)}
                className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-semibold"
              />
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                ₫
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            disabled={isSaving}
          >
            Hủy
          </button>
          <button
            onClick={onSave}
            disabled={!isValid || isSaving}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              !isValid || isSaving
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-105"
            }`}
          >
            {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </div>
  );
}
