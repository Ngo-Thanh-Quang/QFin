"use client"

import { useEffect, useState } from "react"
import { RecentTransactions } from "../transactions/RecentTransactions"
import { StatCards } from "../stat/StatCards"
import MonthlyExpensesPie from "../expenses/MonthlyExpensesPie"
import { YearStatsChart } from "../expenses/YearStatsChart"
import { SettingsSidebar } from "../../setting/SettingsSidebar"
import { SettingsToggleButton } from "../../setting/SettingsToggleButton"
import { AddExpenseModal } from "../../setting/expenses/ExpensesModal"


export function DashboardContent() {
    const [isTextSettingsOpen, setIsTextSettingsOpen] = useState(false)
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false)
    const [expensesRefreshKey, setExpensesRefreshKey] = useState(0)
    const [notice, setNotice] = useState<{
        type: "success" | "error"
        message: string
    } | null>(null)
    const [isNoticeVisible, setIsNoticeVisible] = useState(false)

    useEffect(() => {
        if (!isSettingsOpen && !isAddExpenseModalOpen) return

        const originalOverflow = document.body.style.overflow
        document.body.style.overflow = "hidden"

        return () => {
            document.body.style.overflow = originalOverflow
        }
    }, [isSettingsOpen, isAddExpenseModalOpen])

    useEffect(() => {
        if (!notice) return

        setIsNoticeVisible(true)
        const hideTimer = window.setTimeout(() => setIsNoticeVisible(false), 4600)
        const clearTimer = window.setTimeout(() => setNotice(null), 5000)

        return () => {
            window.clearTimeout(hideTimer)
            window.clearTimeout(clearTimer)
        }
    }, [notice])

    return (
        <main className="flex flex-col overflow-auto bg-background space-y-6 lg:space-y-8 max-w-7xl px-4 mx-auto my-16 lg:my-[104px] overflow-visible">
            <SettingsToggleButton
                isTextSettingsOpen={isTextSettingsOpen}
                onToggleText={() => setIsTextSettingsOpen(!isTextSettingsOpen)}
                onToggleSidebar={() => setIsSettingsOpen(!isSettingsOpen)}
            />

            {isSettingsOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 m-0"
                    onClick={() => setIsSettingsOpen(false)}
                />
            )}

            <SettingsSidebar
                open={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                onOpenAddExpense={() => {
                    setIsSettingsOpen(false)
                    setIsAddExpenseModalOpen(true)
                }}
            />

            {/* Modal Thêm chi tiêu */}
            <AddExpenseModal
                open={isAddExpenseModalOpen}
                onClose={() => setIsAddExpenseModalOpen(false)}
                onNotify={(payload) => setNotice(payload)}
                onCreated={() => setExpensesRefreshKey((prev) => prev + 1)}
                onNext={({ date, time }) => {
                    // TODO: sau này bạn handle logic tiếp theo ở đây
                    console.log("Ngày chọn:", date, "Giờ chọn:", time)
                }}
            />

            {notice && (
                <div
                    className={`fixed top-28 left-1/2 -translate-x-1/2 z-60 max-w-2/3 rounded-2xl px-4 py-3 text-sm font-semibold border shadow-lg transition-all duration-300 ${
                        isNoticeVisible
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 -translate-y-2"
                    } ${
                        notice.type === "success"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                    }`}
                >
                    {notice.message}
                </div>
            )}

            {/* Stat Cards with Gradients */}
            <StatCards refreshKey={expensesRefreshKey} />

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Thống kê 2025 */}
                <YearStatsChart />

                {/* Chi tiêu tháng này */}
                <MonthlyExpensesPie refreshKey={expensesRefreshKey} />
            </div>

            <RecentTransactions refreshKey={expensesRefreshKey} />
        </main>
    )
}
