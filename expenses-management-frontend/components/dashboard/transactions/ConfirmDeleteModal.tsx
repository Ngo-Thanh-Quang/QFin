"use client";

import { AlertTriangle, X } from "lucide-react";
import type { ExpenseItem } from "./types";

type ConfirmDeleteModalProps = {
  open: boolean;
  item: ExpenseItem | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function ConfirmDeleteModal({
  open,
  item,
  isDeleting,
  onClose,
  onConfirm,
}: ConfirmDeleteModalProps) {
  if (!open || !item) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={() => (isDeleting ? null : onClose())}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scale-in overflow-hidden">
        <div className="bg-gradient-to-r from-rose-600 to-orange-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Xóa chi tiêu</h3>
                <p className="text-sm text-white/80">
                  Thao tác này không thể hoàn tác
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              disabled={isDeleting}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-gray-700">
            Bạn có chắc muốn xóa chi tiêu{" "}
            <span className="font-semibold">{item.name}</span> không?
          </p>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            disabled={isDeleting}
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              isDeleting
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-rose-600 to-orange-600 text-white shadow-lg hover:shadow-xl hover:scale-105"
            }`}
          >
            {isDeleting ? "Đang xóa..." : "Xóa"}
          </button>
        </div>
      </div>
    </div>
  );
}
