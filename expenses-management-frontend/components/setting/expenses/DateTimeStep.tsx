"use client"

import { Clock, ChevronLeft, ChevronRight } from "lucide-react"
import type { TimeState } from "./types"
import { useMemo } from "react"

type DateTimeStepProps = {
    currentMonth: Date
    selectedDate: Date
    selectedTime: TimeState
    onChangeDate: (date: Date | null) => void
    onChangeTime: (time: TimeState) => void
    onPrevMonth: () => void
    onNextMonth: () => void
    onClose: () => void
    onNextStep: () => void
}

// helpers riêng cho step này
const getDaysInMonth = (date: Date): (Date | null)[] => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: (Date | null)[] = []

    for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(null)
    }

    for (let day = 1; day <= daysInMonth; day++) {
        days.push(new Date(year, month, day))
    }

    return days
}

const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
        date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
    )
}

const isToday = (date: Date): boolean => {
    return isSameDay(date, new Date())
}

const weekDays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]

const monthNames = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
]

export function DateTimeStep({
    currentMonth,
    selectedDate,
    selectedTime,
    onChangeDate,
    onChangeTime,
    onPrevMonth,
    onNextMonth,
    onClose,
    onNextStep,
}: DateTimeStepProps) {
    const days = useMemo(() => getDaysInMonth(currentMonth), [currentMonth])

    return (
        <div className="flex flex-col gap-4 justify-between w-full flex-shrink-0 p-6">
            <div className="w-full">
                {/* Calendar */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                        </h3>
                        <div className="flex space-x-2">
                            <button
                                onClick={onPrevMonth}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ChevronLeft className="h-5 w-5 text-gray-600" />
                            </button>
                            <button
                                onClick={onNextMonth}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ChevronRight className="h-5 w-5 text-gray-600" />
                            </button>
                        </div>
                    </div>

                    {/* Week days */}
                    <div className="grid grid-cols-7 gap-2 mb-2">
                        {weekDays.map((day) => (
                            <div
                                key={day}
                                className="text-center text-xs font-semibold text-gray-500 py-2"
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Days */}
                    <div className="grid grid-cols-7 gap-2">
                        {days.map((day, index) => (
                            <button
                                key={index}
                                onClick={() => onChangeDate(day)}
                                disabled={!day}
                                className={`
                aspect-square rounded-lg text-sm font-medium transition-all
                ${!day ? "invisible" : ""}
                ${day && isSameDay(day, selectedDate)
                                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-110"
                                        : day && isToday(day)
                                            ? "bg-indigo-50 text-indigo-700 border-2 border-indigo-200"
                                            : "hover:bg-gray-100 text-gray-700"
                                    }
              `}
                            >
                                {day && day.getDate()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Time Picker */}
                <div className="mb-6 flex flex-col lg:flex-row gap-4 justify-between">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                        <Clock className="h-4 w-4" />
                        <span>Chọn thời gian</span>
                    </label>
                    <div className="flex items-center justify-center space-x-4 rounded-xl">
                        {/* Hour */}
                        <div className="flex items-center gap-4 rounded-xl border-2 border-gray-200 px-3 py-2">
                            <label className="text-xs text-gray-500">Giờ</label>
                            <select
                                value={selectedTime.hour}
                                onChange={(e) =>
                                    onChangeTime({
                                        ...selectedTime,
                                        hour: parseInt(e.target.value, 10),
                                    })
                                }
                                className="rounded-lg text-center font-semibold text-gray-900 focus:border-indigo-500 outline-none transition-all cursor-pointer"
                            >
                                {Array.from({ length: 24 }, (_, i) => (
                                    <option key={i} value={i}>
                                        {String(i).padStart(2, "0")}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <span className="text-2xl font-bold text-gray-400">:</span>

                        {/* Minute */}
                        <div className="flex items-center gap-4 rounded-xl border-2 border-gray-200 px-3 py-2">
                            <label className="text-xs text-gray-500">Phút</label>
                            <select
                                value={selectedTime.minute}
                                onChange={(e) =>
                                    onChangeTime({
                                        ...selectedTime,
                                        minute: parseInt(e.target.value, 10),
                                    })
                                }
                                className="text-center font-semibold text-gray-900 focus:border-indigo-500 outline-none transition-all cursor-pointer"
                            >
                                {Array.from({ length: 60 }, (_, i) => (
                                    <option key={i} value={i}>
                                        {String(i).padStart(2, "0")}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Selected DateTime Display */}
                <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                    <p className="text-sm text-gray-600 mb-1">Thời gian đã chọn:</p>
                    <span className="flex gap-1 sm:gap-2 justify-center">
                        <span className="text-base lg:text-lg font-bold text-indigo-700">
                            {selectedDate.toLocaleDateString("vi-VN", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </span>
                        <span className="-mt-1 text-sm lg:text-md font-semibold text-indigo-600">
                            {String(selectedTime.hour).padStart(2, "0")}:
                            {String(selectedTime.minute).padStart(2, "0")}
                        </span>
                    </span>
                </div>

            </div>
            {/* Action Buttons */}
            <div className="flex space-x-3">
                <button
                    onClick={onClose}
                    className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                >
                    Hủy
                </button>
                <button
                    onClick={onNextStep}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                    Tiếp theo
                </button>
            </div>
        </div>
    )
}
