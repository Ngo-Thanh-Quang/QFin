"use client"

import { DollarSign, FileText, Tag } from "lucide-react"
import { type ChangeEvent } from "react"
import { ExpensesCategories } from "../../dashboard/data/dashboardData"
import type { TimeState } from "./types"

type ExpenseDetailsStepProps = {
  expenseName: string
  expenseAmount: string
  expenseCategory: string
  onChangeName: (value: string) => void
  onChangeAmount: (value: string) => void
  onChangeCategory: (value: string) => void
  onBack: () => void
  onConfirm: () => void
  isSubmitting: boolean
  isFormValid: boolean
  selectedDate: Date
  selectedTime: TimeState
}

// format tiền riêng cho step 2
const formatCurrency = (value: string): string => {
  const number = value.replace(/\D/g, "")
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export function ExpenseDetailsStep({
  expenseName,
  expenseAmount,
  expenseCategory,
  onChangeName,
  onChangeAmount,
  onChangeCategory,
  onBack,
  onConfirm,
  isSubmitting,
  isFormValid,
  selectedDate,
  selectedTime,
}: ExpenseDetailsStepProps) {
  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/,/g, "")
    if (raw === "" || /^\d+$/.test(raw)) {
      onChangeAmount(raw)
    }
  }

  const formattedSummaryDate = selectedDate.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
  })

  const formattedSummaryTime = `${String(selectedTime.hour).padStart(
    2,
    "0"
  )}:${String(selectedTime.minute).padStart(2, "0")}`

  return (
    <div className="w-full flex-shrink-0 p-6">
      <div className="flex flex-col justify-between h-full gap-4">
        <div className="flex flex-col gap-4">
          {/* Tên chi tiêu */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
              <FileText className="h-4 w-4" />
              <span>Tên chi tiêu</span>
            </label>
            <input
              type="text"
              value={expenseName}
              onChange={(e) => onChangeName(e.target.value)}
              placeholder="VD: Mua sắm siêu thị"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
            />
          </div>

          {/* Số tiền */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
              <DollarSign className="h-4 w-4" />
              <span>Số tiền (VND)</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={formatCurrency(expenseAmount)}
                onChange={handleAmountChange}
                placeholder="0"
                className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-lg font-semibold"
              />
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                ₫
              </span>
            </div>
          </div>

          {/* Thể loại */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
              <Tag className="h-4 w-4" />
              <span>Thể loại</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {ExpensesCategories.map((category) => {
                const Icon = category.icon
                return (
                  <button
                    key={category.id}
                    onClick={() => onChangeCategory(category.id)}
                    className={`
                      p-4 rounded-xl border-2 transition-all duration-200 text-left flex gap-2 lg:gap-4
                      ${expenseCategory === category.id
                        ? `bg-gradient-to-r ${category.color} text-white border-transparent shadow-lg scale-105`
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <div
                      className={`font-semibold text-sm ${expenseCategory === category.id
                          ? "text-white"
                          : "text-gray-900"
                        }`}
                    >
                      {category.name}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Summary */}
          {(expenseName || expenseAmount || expenseCategory) && (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 relative">
              <p className="text-xs text-gray-500 absolute -top-2 z-10 bg-gray-50">Tóm tắt</p>
              <div className="space-y-1 text-sm">
                {expenseName && (
                  <p className="text-gray-700">
                    <span className="font-semibold">Tên:</span>{" "}
                    <span className="capitalize">{expenseName}</span>
                  </p>
                )}
                {expenseAmount && (
                  <p className="text-gray-700">
                    <span className="font-semibold">Số tiền:</span>{" "}
                    {formatCurrency(expenseAmount)}₫
                  </p>
                )}
                {expenseCategory && (
                  <p className="text-gray-700">
                    <span className="font-semibold">Thể loại:</span>{" "}
                    {
                      ExpensesCategories.find(
                        (c) => c.id === expenseCategory
                      )?.name
                    }
                  </p>
                )}

                {/* Thời gian */}
                <p className="text-gray-700">
                  <span className="font-semibold">Thời gian:</span>{" "}
                  {formattedSummaryDate}, {formattedSummaryTime}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onBack}
            className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
          >
            Quay lại
          </button>
          <button
            onClick={onConfirm}
            disabled={!isFormValid || isSubmitting}
            className={`
              flex-1 px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap
              ${isFormValid
                ? isSubmitting
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white cursor-default opacity-25"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }
            `}
          >
            <span className={isSubmitting ? "italic" : undefined}>
              {isSubmitting ? "Đang thêm..." : "Xác nhận"}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
