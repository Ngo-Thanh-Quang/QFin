"use client"

import { X, Calendar, ArrowLeft, DollarSign } from "lucide-react"
import { useEffect, useState } from "react"
import type { AddExpenseModalProps, TimeState } from "./types"
import { DateTimeStep } from "./DateTimeStep"
import { ExpenseDetailsStep } from "./ExpenseDetailsStep"
import { addExpenses } from "@/lib/expenses/addExpenses"
import { ExpensesCategories } from "@/components/dashboard/data/dashboardData"
import { getAuth } from "firebase/auth"
import { useExpensesRefreshStore } from "@/lib/store/expensesRefreshStore"

export function AddExpenseModal({
  open,
  onClose,
  onNext,
  onNotify,
  onCreated,
}: AddExpenseModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedTime, setSelectedTime] = useState<TimeState>({
    hour: new Date().getHours(),
    minute: new Date().getMinutes(),
  })
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())

  // step = 1: chọn ngày/giờ, step = 2: nhập thông tin chi tiêu
  const [step, setStep] = useState<1 | 2>(1)

  // state của form chi tiêu (step 2)
  const [expenseName, setExpenseName] = useState("")
  const [expenseAmount, setExpenseAmount] = useState("")
  const [expenseCategory, setExpenseCategory] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const bumpExpensesRefresh = useExpensesRefreshStore((state) => state.bump)

  useEffect(() => {
    if (open) {
      const now = new Date()
      setSelectedDate(now)
      setSelectedTime({
        hour: now.getHours(),
        minute: now.getMinutes(),
      })
      setCurrentMonth(now)
      setStep(1)
      setExpenseName("")
      setExpenseAmount("")
      setExpenseCategory("")
      setIsSubmitting(false)
    }
  }, [open])

  if (!open) return null

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    )
  }

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    )
  }

  const handleDateSelect = (date: Date | null) => {
    if (date) {
      setSelectedDate(date)
    }
  }

  const handleGoToDetails = () => setStep(2)
  const handleBack = () => setStep(1)

  const isFormValid =
    expenseName.trim() !== "" && expenseAmount !== "" && expenseCategory !== ""

  const handleConfirm = async () => {
    if (!isFormValid || isSubmitting) return

    const finalDateTime = new Date(selectedDate)
    finalDateTime.setHours(selectedTime.hour)
    finalDateTime.setMinutes(selectedTime.minute)
    if (finalDateTime.getTime() > Date.now()) {
      onNotify?.({
        type: "error",
        message: "Thời gian chi tiêu không được vượt quá hiện tại.",
      })
      return
    }

    onNext?.({
      date: finalDateTime.toISOString(),
      time: `${String(selectedTime.hour).padStart(2, "0")}:${String(
        selectedTime.minute
      ).padStart(2, "0")}`,
    })

    try {
      setIsSubmitting(true)
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error('User not logged in');
      const idToken = await user.getIdToken();

      const payload = {
        name: expenseName,
        amount: expenseAmount,
        type: 'expense',
        categoryId: expenseCategory,
        categoryName: ExpensesCategories.find(c => c.id === expenseCategory)?.name,
        date: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), selectedTime.hour, selectedTime.minute).toISOString(),
      };

      const result = await addExpenses(idToken, payload);
      console.log('created', result);
      bumpExpensesRefresh();
      onCreated?.()
      onNotify?.({
        type: "success",
        message: "Đã thêm chi tiêu thành công.",
      })
      onClose()
    } catch (err) {
      console.error(err);
      onNotify?.({
        type: "error",
        message: "Thêm chi tiêu thất bại. Vui lòng thử lại.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 mb-0">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {step === 2 && (
                <button
                  onClick={handleBack}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              )}
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                {step === 1 ? (
                  <Calendar className="h-6 w-6" />
                ) : (
                  <DollarSign className="h-6 w-6" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {step === 1 ? "Thêm chi tiêu" : "Chi tiết"}
                </h2>
                <p className="text-sm text-white/80">
                  {step === 1
                    ? "Chọn ngày và giờ giao dịch"
                    : "Thông tin chi tiêu"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center space-x-2 mt-4">
            <div
              className={`h-1 flex-1 rounded-full transition-all ${step >= 1 ? "bg-white" : "bg-white/30"
                }`}
            ></div>
            <div
              className={`h-1 flex-1 rounded-full transition-all ${step >= 2 ? "bg-white" : "bg-white/30"
                }`}
            ></div>
          </div>
        </div>

        {/* Content with slide effect */}
        <div className="relative overflow-y-auto overflow-x-hidden max-h-[calc(100vh-152px)]">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${(step - 1) * 100}%)` }}
          >
            <DateTimeStep
              currentMonth={currentMonth}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onChangeDate={handleDateSelect}
              onChangeTime={setSelectedTime}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onClose={onClose}
              onNextStep={handleGoToDetails}
            />

            <ExpenseDetailsStep
              expenseName={expenseName}
              expenseAmount={expenseAmount}
              expenseCategory={expenseCategory}
              onChangeName={setExpenseName}
              onChangeAmount={setExpenseAmount}
              onChangeCategory={setExpenseCategory}
              onBack={handleBack}
              onConfirm={handleConfirm}
              isSubmitting={isSubmitting}
              isFormValid={isFormValid}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
