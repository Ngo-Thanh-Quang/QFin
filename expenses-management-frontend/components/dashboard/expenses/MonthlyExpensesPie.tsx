"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { ExpensesCategories } from "../data/dashboardData";
import { useAuthUser } from "@/lib/auth/useAuthUser";
import { getMonthKey } from "@/lib/date";

type MonthlyExpensesPieProps = {
    refreshKey?: number;
};

export default function MonthlyExpensesPie({ refreshKey }: MonthlyExpensesPieProps) {
    const currentMonth = new Date().getMonth() + 1;
    const { user, initializing } = useAuthUser();
    const [byCategory, setByCategory] = useState<Record<string, number>>({});
    const [totalExpense, setTotalExpense] = useState(0);
    const colorByCategory: Record<string, string> = {
        shopping: "#3b82f6",
        housing: "#8b5cf6",
        food: "#f59e0b",
        transport: "#10b981",
        entertainment: "#fb2c36",
    };

    useEffect(() => {
        let isActive = true;

        const loadBreakdown = async () => {
            if (!user || initializing) {
                setByCategory({});
                setTotalExpense(0);
                return;
            }

            try {
                const idToken = await user.getIdToken();
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/expenses/breakdown?month=${getMonthKey()}`,
                    {
                        headers: {
                            Authorization: `Bearer ${idToken}`,
                        },
                    }
                );

                if (!res.ok) {
                    throw new Error(`Breakdown fetch failed: ${res.status}`);
                }

                const data = await res.json();
                if (!isActive) return;
                setByCategory(data?.byCategory ?? {});
                setTotalExpense(Number(data?.totalExpense ?? 0));
            } catch (err) {
                if (isActive) {
                    setByCategory({});
                    setTotalExpense(0);
                }
            }
        };

        loadBreakdown();

        return () => {
            isActive = false;
        };
    }, [user, initializing, refreshKey]);

    const chartData = useMemo(() => {
        if (!totalExpense) return [];
        return ExpensesCategories.map((category) => {
            const rawValue = Number(byCategory[category.id] ?? 0);
            const value = Math.max(rawValue, 0);
            return {
                name: category.name,
                value: Math.round((value / totalExpense) * 100),
                color: colorByCategory[category.id] ?? "#94a3b8",
            };
        }).filter((item) => item.value > 0);
    }, [byCategory, totalExpense]);

    return (
        <Card className="bg-white border border-gray-300">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg">
                    Chi tiêu tháng {currentMonth}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
                {totalExpense === 0 ? (
                    <div className="h-[250px] w-full text-gray-500 flex items-center justify-center text-sm text-muted-foreground">
                        Chưa có chi tiêu nào.
                    </div>
                ) : (
                    <>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={1}
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>

                        {/* Legend */}
                        <div className="mt-6 w-full space-y-2">
                            {chartData.map((item) => (
                                <div key={item.name} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="text-muted-foreground">{item.name}</span>
                                    </div>
                                    <span className="font-medium text-foreground">{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
