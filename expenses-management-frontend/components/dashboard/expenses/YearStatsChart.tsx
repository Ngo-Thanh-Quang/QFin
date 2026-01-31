import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useEffect, useMemo, useState } from "react";
import { useAuthUser } from "@/lib/auth/useAuthUser";
import { useIsDesktop } from "@/lib/screen/useIsDesktop"
import { useExpensesRefreshStore } from "@/lib/store/expensesRefreshStore";
import { useSavingsRefreshStore } from "@/lib/store/savingsRefreshStore";
import { useIncomeRefreshStore } from "@/lib/store/incomeRefreshStore";

export function YearStatsChart() {
    const isDesktop = useIsDesktop()
    const { user, initializing } = useAuthUser();
    const [chartData, setChartData] = useState<Array<{ month: string; TN: number; CT: number; TK: number }>>([]);
    const [isLoading, setIsLoading] = useState(false);
    const expensesRefreshKey = useExpensesRefreshStore((state) => state.refreshKey);
    const savingsRefreshKey = useSavingsRefreshStore((state) => state.refreshKey);
    const incomeRefreshKey = useIncomeRefreshStore((state) => state.refreshKey);

    const year = new Date().getFullYear();

    useEffect(() => {
        if (!user || initializing) {
            setChartData([]);
            return;
        }
        let isActive = true;
        const loadData = async () => {
            setIsLoading(true);
            try {
                const idToken = await user.getIdToken();
                const [expensesRes, savingsRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/expenses/monthly?year=${year}`, {
                        headers: {
                            Authorization: `Bearer ${idToken}`,
                        },
                    }),
                    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/savings/monthly?year=${year}`, {
                        headers: {
                            Authorization: `Bearer ${idToken}`,
                        },
                    }),
                ]);

                if (!expensesRes.ok || !savingsRes.ok) {
                    throw new Error("Load monthly data failed");
                }

                const [expensesData, savingsData] = await Promise.all([
                    expensesRes.json(),
                    savingsRes.json(),
                ]);
                if (!isActive) return;

                const expenseMap = new Map<string, number>();
                const incomeMap = new Map<string, number>();
                (expensesData?.items ?? []).forEach((item: any) => {
                    if (item?.month) {
                        expenseMap.set(item.month, Number(item.totalExpense ?? 0));
                        incomeMap.set(item.month, Number(item.totalIncome ?? 0));
                    }
                });

                const savingsMap = new Map<string, number>();
                (savingsData?.items ?? []).forEach((item: any) => {
                    if (item?.month) {
                        savingsMap.set(item.month, Number(item.totalAmount ?? 0));
                    }
                });

                const nextData = Array.from({ length: 12 }, (_, index) => {
                    const monthIndex = index + 1;
                    const monthKey = `${year}-${String(monthIndex).padStart(2, "0")}`;
                    return {
                        month: `T.${monthIndex}`,
                        TN: incomeMap.get(monthKey) ?? 0,
                        CT: expenseMap.get(monthKey) ?? 0,
                        TK: savingsMap.get(monthKey) ?? 0,
                    };
                });

                setChartData(nextData);
            } catch {
                if (isActive) {
                    setChartData([]);
                }
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        };

        loadData();

        return () => {
            isActive = false;
        };
    }, [user, initializing, year, expensesRefreshKey, savingsRefreshKey, incomeRefreshKey]);

    return (
        <Card className="lg:col-span-2 bg-white border border-gray-300 lg:flex flex-col justify-between">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                        Thống kê {new Date().getFullYear()}
                    </CardTitle>
                    <div className="flex gap-3">
                        {isDesktop && (
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-[#45cca8]" />
                                <span className="text-xs text-muted-foreground">Thu nhập</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-red-400" />
                            <span className="text-xs text-muted-foreground">Chi tiêu</span>
                        </div>
                        {isDesktop && (
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-blue-400" />
                                <span className="text-xs text-muted-foreground">Tiết kiệm</span>
                            </div>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading && (
                    <div className="text-sm text-gray-500 mb-2">Đang tải dữ liệu...</div>
                )}
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis
                            dataKey="month"
                            stroke="hsl(var(--muted-foreground))"
                            interval={0}
                            tickMargin={8}
                            tick={{ fontSize: isDesktop ? 16 : 14 }}
                        />
                        <YAxis hide />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "hsl(var(--card))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "8px",
                                color: "hsl(var(--foreground))",
                            }}
                            content={({ active, payload, label }) => {
                                if (!active || !payload || payload.length === 0) return null;
                                const formatValue = (value?: number) =>
                                    Number(value ?? 0).toLocaleString("vi-VN");
                                const values = payload.reduce<Record<string, number>>((acc, entry: any) => {
                                    acc[entry.dataKey] = Number(entry.value ?? 0);
                                    return acc;
                                }, {});
                                return (
                                    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-md">
                                        <div className="text-xs text-gray-500 mb-1">{label}</div>
                                        <div className="space-y-1 text-sm">
                                            {typeof values.TN !== "undefined" && (
                                                <div className="flex items-center justify-between gap-4 bg-white font-bold text-emerald-600">
                                                    <span>TN</span>
                                                    <span>{formatValue(values.TN)}</span>
                                                </div>
                                            )}
                                            {typeof values.CT !== "undefined" && (
                                                <div className="flex items-center justify-between gap-4 bg-white font-bold text-red-500">
                                                    <span>CT</span>
                                                    <span>{formatValue(values.CT)}</span>
                                                </div>
                                            )}
                                            {typeof values.TK !== "undefined" && (
                                                <div className="flex items-center justify-between gap-4 bg-white font-bold text-blue-500">
                                                    <span>TK</span>
                                                    <span>{formatValue(values.TK)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            }}
                        />
                        {isDesktop && <Bar dataKey="TN" fill="#45cca8" radius={[4, 4, 0, 0]} />}
                        <Bar dataKey="CT" fill="#f87171" radius={[4, 4, 0, 0]} />
                        {isDesktop && <Bar dataKey="TK" fill="#60a5fa" radius={[4, 4, 0, 0]} />}

                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
