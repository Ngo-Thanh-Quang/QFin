import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { salesData } from "../data/dashboardData";
import { useIsDesktop } from "@/lib/screen/useIsDesktop"

export function YearStatsChart() {
    const isDesktop = useIsDesktop()

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
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salesData}>
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
