"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuthUser } from "@/lib/auth/useAuthUser";
import { useUserProfile } from "@/lib/auth/useUserProfile";
import { useIncomeStore } from "@/lib/store/incomeStore";
import { useExpensesRefreshStore } from "@/lib/store/expensesRefreshStore";
import { useSavingsRefreshStore } from "@/lib/store/savingsRefreshStore";
import { useIncomeRefreshStore } from "@/lib/store/incomeRefreshStore";

type StatCardsProps = {
    refreshKey?: number;
};

export function StatCards({ refreshKey }: StatCardsProps) {
    const { user, initializing } = useAuthUser();
    const { profile } = useUserProfile();
    const expensesRefreshKey = useExpensesRefreshStore((state) => state.refreshKey);
    const savingsRefreshKey = useSavingsRefreshStore((state) => state.refreshKey);
    const incomeRefreshKey = useIncomeRefreshStore((state) => state.refreshKey);
    const [totalExpense, setTotalExpense] = useState(0);
    const [prevTotalExpense, setPrevTotalExpense] = useState(0);
    const [weeklyExpense, setWeeklyExpense] = useState(0);
    const [totalSavingsAll, setTotalSavingsAll] = useState(0);
    const incomeAmount = useIncomeStore((state) => state.incomeAmount);
    const hydrateIncomeAmount = useIncomeStore((state) => state.hydrateIncomeAmount);

    useEffect(() => {
        const parsed = Number(profile?.incomeAmount);
        if (!Number.isNaN(parsed) && parsed >= 0) {
            hydrateIncomeAmount(parsed);
        }
    }, [profile, hydrateIncomeAmount]);

    useEffect(() => {
        let isActive = true;

        const loadSummary = async () => {
            if (!user || initializing) {
                setTotalExpense(0);
                setPrevTotalExpense(0);
                setWeeklyExpense(0);
                return;
            }

            try {
                const idToken = await user.getIdToken();
                const [summaryRes, weeklyRes, savingsRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/expenses/summary`, {
                        headers: {
                            Authorization: `Bearer ${idToken}`,
                        },
                    }),
                    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/expenses/summary-week`, {
                        headers: {
                            Authorization: `Bearer ${idToken}`,
                        },
                    }),
                    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/savings/summary`, {
                        headers: {
                            Authorization: `Bearer ${idToken}`,
                        },
                    }),
                ]);

                if (summaryRes.ok) {
                    const data = await summaryRes.json();
                    if (!isActive) return;
                    setTotalExpense(Number(data?.current?.totalExpense ?? 0));
                    setPrevTotalExpense(Number(data?.previous?.totalExpense ?? 0));
                } else if (isActive) {
                    setTotalExpense(0);
                    setPrevTotalExpense(0);
                }

                if (weeklyRes.ok) {
                    const weeklyData = await weeklyRes.json();
                    if (!isActive) return;
                    setWeeklyExpense(Number(weeklyData?.totalExpense ?? 0));
                } else if (isActive) {
                    setWeeklyExpense(0);
                }

                if (savingsRes.ok) {
                    const savingsData = await savingsRes.json();
                    if (!isActive) return;
                    setTotalSavingsAll(Number(savingsData?.totalAmount ?? 0));
                } else if (isActive) {
                    setTotalSavingsAll(0);
                }
            } catch (err) {
                if (isActive) {
                    setTotalExpense(0);
                    setPrevTotalExpense(0);
                    setWeeklyExpense(0);
                    setTotalSavingsAll(0);
                }
            }
        };

        loadSummary();

        return () => {
            isActive = false;
        };
    }, [user, initializing, refreshKey, expensesRefreshKey, savingsRefreshKey, incomeRefreshKey]);

    const formattedTotalExpense = useMemo(
        () => totalExpense.toLocaleString("vi-VN"),
        [totalExpense]
    );
    const formattedCurrentBalance = useMemo(
        () => (incomeAmount - totalExpense).toLocaleString("vi-VN"),
        [incomeAmount, totalExpense]
    );
    const formattedWeeklyExpense = useMemo(
        () => weeklyExpense.toLocaleString("vi-VN"),
        [weeklyExpense]
    );
    const formattedTotalSavingsAll = useMemo(
        () => totalSavingsAll.toLocaleString("vi-VN"),
        [totalSavingsAll]
    );

    const percentChange = useMemo(() => {
        if (prevTotalExpense === 0) {
            return totalExpense === 0 ? 0 : 100;
        }
        return Math.round(((totalExpense - prevTotalExpense) / prevTotalExpense) * 100);
    }, [prevTotalExpense, totalExpense]);

    const trendLabel = totalExpense >= prevTotalExpense ? "Tăng" : "Giảm";
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                {/* Chi tiêu tháng này */}
                <div className="bg-gradient-to-r from-[#fc9667] to-[#fd6170] rounded-lg p-6 text-white shadow-lg gradient-pattern relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-start justify-between mb-12">
                            <div>
                                <p className="text-white/80 font-medium mb-2">Chi tiêu tháng này</p>
                                <h3 className="text-4xl font-bold">
                                    {formattedTotalExpense}
                                </h3>
                            </div>
                            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                {totalExpense >= prevTotalExpense ? <TrendingUp className="w-6 h-6 text-white" /> : <TrendingDown className="w-6 h-6 text-white" />}
                            </div>
                        </div>
                        {totalExpense > 0 ? 
                            <p className="text-white/80">
                                {trendLabel} {Math.abs(percentChange)}% so với tháng trước
                            </p>
                            : <p className="text-white/80">
                                Chưa có chi tiêu nào.
                             </p>
                        }
                    </div>
                </div>

                {/* Chi tiêu tuần này */}
                <div className="bg-gradient-to-r from-[#83c3f7] to-[#3599e8] rounded-lg p-6 text-white shadow-lg gradient-pattern relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-start justify-between mb-12">
                            <div>
                                <p className="text-white/80 font-medium mb-2">Chi tiêu tuần này</p>
                                <h3 className="text-4xl font-bold">{formattedWeeklyExpense}</h3>
                            </div>
                            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 5a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 19V5z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <span className="text-white/80">
                            Số dư tháng này: <span className="font-bold">{formattedCurrentBalance}</span>
                        </span>
                    </div>
                </div>

                {/* Tiết kiệm */}
                <div className="bg-gradient-to-r from-[#7cd8d0] to-[#35d1bb] rounded-lg p-6 text-white shadow-lg gradient-pattern relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-start justify-between mb-12">
                            <div>
                                <p className="text-white/80 font-medium mb-2">Mục tiêu tiết kiệm tháng này</p>
                                <h3 className="text-4xl font-bold">200,000</h3>
                            </div>
                            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-white/80">
                            Tổng tiền tiết kiệm: <b>{formattedTotalSavingsAll}</b>
                        </p>
                    </div>
                </div>
            </div>
    )
}
