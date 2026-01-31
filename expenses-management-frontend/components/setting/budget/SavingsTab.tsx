import { ChevronLeft, ChevronRight, CircleArrowRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuthUser } from "@/lib/auth/useAuthUser";

type SavingsTabProps = {
    open: boolean;
    active: boolean;
};

export function SavingsTab({ open, active }: SavingsTabProps) {
    const { user, initializing } = useAuthUser();
    const [savingsView, setSavingsView] = useState<"menu" | "setup" | "goal">("menu");
    const [savingsDate, setSavingsDate] = useState("");
    const [calendarYear, setCalendarYear] = useState(0);
    const [calendarMonth, setCalendarMonth] = useState(0);
    const [savingsAmountInput, setSavingsAmountInput] = useState("");
    const [savingsDescription, setSavingsDescription] = useState("");
    const [isSavingsSaving, setIsSavingsSaving] = useState(false);
    const [savingsError, setSavingsError] = useState<string | null>(null);
    const [savingsSuccess, setSavingsSuccess] = useState<string | null>(null);
    const [savingsSuccessFading, setSavingsSuccessFading] = useState(false);

    const getDefaultSavingsDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const parseAmount = (value: string) => {
        const digits = value.replace(/[^\d]/g, "");
        return digits ? Number(digits) : 0;
    };

    const formattedSavingsAmount = useMemo(() => {
        if (!savingsAmountInput.trim()) return "";
        return parseAmount(savingsAmountInput).toLocaleString("vi-VN");
    }, [savingsAmountInput]);

    useEffect(() => {
        if (!open) return;
        const defaultDate = getDefaultSavingsDate();
        const baseDate = new Date(defaultDate);
        setSavingsView("menu");
        setSavingsDate(defaultDate);
        setCalendarYear(baseDate.getFullYear());
        setCalendarMonth(baseDate.getMonth());
        setSavingsSuccess(null);
        setSavingsSuccessFading(false);
    }, [open]);

    useEffect(() => {
        if (!savingsSuccess) return;
        setSavingsSuccessFading(false);
        const fadeTimer = window.setTimeout(() => {
            setSavingsSuccessFading(true);
        }, 5000);
        const clearTimer = window.setTimeout(() => {
            setSavingsSuccess(null);
            setSavingsSuccessFading(false);
        }, 5500);
        return () => {
            window.clearTimeout(fadeTimer);
            window.clearTimeout(clearTimer);
        };
    }, [savingsSuccess]);

    useEffect(() => {
        if (!active) {
            setSavingsView("menu");
        }
    }, [active]);

    useEffect(() => {
        if (!savingsDate) return;
        const date = new Date(savingsDate);
        setCalendarYear(date.getFullYear());
        setCalendarMonth(date.getMonth());
    }, [savingsDate]);

    const selectedDay = useMemo(() => {
        if (!savingsDate) return null;
        const date = new Date(savingsDate);
        if (
            date.getFullYear() !== calendarYear ||
            date.getMonth() !== calendarMonth
        ) {
            return null;
        }
        return date.getDate();
    }, [savingsDate, calendarYear, calendarMonth]);

    const daysInMonth = useMemo(
        () => new Date(calendarYear, calendarMonth + 1, 0).getDate(),
        [calendarYear, calendarMonth]
    );

    const goToPreviousMonth = () => {
        if (calendarMonth === 0) {
            setCalendarYear((prev) => prev - 1);
            setCalendarMonth(11);
            return;
        }
        setCalendarMonth((prev) => prev - 1);
    };

    const goToNextMonth = () => {
        if (calendarMonth === 11) {
            setCalendarYear((prev) => prev + 1);
            setCalendarMonth(0);
            return;
        }
        setCalendarMonth((prev) => prev + 1);
    };

    const saveSavings = async () => {
        if (isSavingsSaving) return;
        const amountValue = parseAmount(savingsAmountInput);
        if (!savingsAmountInput.trim()) {
            setSavingsError("Vui lòng nhập số tiền tiết kiệm.");
            setSavingsSuccess(null);
            return;
        }
        if (!user || initializing) {
            setSavingsError("Chưa xác thực người dùng.");
            setSavingsSuccess(null);
            return;
        }
        setSavingsError(null);
        setSavingsSuccess(null);
        setIsSavingsSaving(true);
        try {
            const idToken = await user.getIdToken();
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/savings`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        amount: amountValue,
                        description: savingsDescription.trim() || undefined,
                        date: savingsDate || undefined,
                    }),
                }
            );

            if (!res.ok) {
                throw new Error(`Save savings failed: ${res.status}`);
            }
            const resetDate = getDefaultSavingsDate();
            const resetBaseDate = new Date(resetDate);
            setSavingsAmountInput("");
            setSavingsDescription("");
            setSavingsDate(resetDate);
            setCalendarYear(resetBaseDate.getFullYear());
            setCalendarMonth(resetBaseDate.getMonth());
            setSavingsView("menu");
            setSavingsSuccess("Thiết lập thành công!");
        } catch (error) {
            setSavingsError("Lưu tiết kiệm thất bại. Vui lòng thử lại.");
        } finally {
            setIsSavingsSaving(false);
        }
    };

    if (!active) return null;

    return (
        <div>
            <div className="relative overflow-hidden">
                <div
                    className={`flex w-[200%] transition-transform duration-500 ease-out ${savingsView === "menu" ? "translate-x-0" : "-translate-x-1/2"
                        }`}
                >
                    <div className="w-1/2 pr-0">
                        <div className="text-sm text-gray-500 text-center mb-4 md:mb-6">
                            Dữ liệu tiết kiệm chưa có, thiết lập ngay?
                        </div>
                        {savingsSuccess && (
                            <div
                                className={`px-4 py-3 text-sm text-green-600 bg-green-50 mb-4 rounded-full font-semibold text-center md:text-left transition-opacity duration-500 ${savingsSuccessFading ? "opacity-0" : "opacity-100"
                                    }`}
                            >
                                {savingsSuccess}
                            </div>
                        )}
                        <div className="grid border border-gray-300 rounded-lg overflow-hidden">
                            {[
                                { id: "setup", label: "Thiết lập" },
                                { id: "goal", label: "Mục tiêu" },
                            ].map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() =>
                                        setSavingsView(item.id as "setup" | "goal")
                                    }
                                    className="last:border-0 border-b border-gray-300 p-4 flex justify-between cursor-pointer bg-gradient-to-r from-gray-100 to-gray-100 bg-[length:0%_100%] bg-no-repeat bg-left transition-[background-size] duration-500 hover:bg-[length:100%_100%]"
                                >
                                    <div>{item.label}</div>
                                    <CircleArrowRight />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="w-1/2">
                        <button
                            type="button"
                            onClick={() => setSavingsView("menu")}
                            className="mb-4 inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700 w-full justify-between"
                        >
                            <ChevronLeft />
                            {savingsView === "setup" ? "Thiết lập" : "Mục tiêu"}
                        </button>
                        {savingsView === "setup" && (
                            <div className="flex flex-col gap-4">
                                <div className="relative">
                                    <span className="absolute left-4 -top-2 text-xs px-1 bg-white rounded-full text-gray-600">Tiền tiết kiệm</span>
                                    <input
                                        type="text"
                                        placeholder="0"
                                        value={formattedSavingsAmount}
                                        onChange={(event) => {
                                            const nextValue = event.target.value.replace(/[^\d]/g, "");
                                            setSavingsAmountInput(nextValue);
                                            if (savingsError) {
                                                setSavingsError(null);
                                            }
                                            if (savingsSuccess) {
                                                setSavingsSuccess(null);
                                            }
                                        }}
                                        className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-semibold"
                                    />
                                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                                        ₫
                                    </span>
                                </div>
                                <div className="relative">
                                    <span className="absolute left-4 -top-2 text-xs px-1 bg-white rounded-full text-gray-600">Mô tả</span>
                                    <textarea
                                        placeholder="Mô tả đê"
                                        value={savingsDescription}
                                        onChange={(event) => {
                                            setSavingsDescription(event.target.value);
                                            if (savingsSuccess) {
                                                setSavingsSuccess(null);
                                            }
                                        }}
                                        className="text-sm lg:text-base w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                                    />
                                </div>
                                <div className="relative -mt-4">
                                    <span className="text-xs text-gray-600">Ngày tiết kiệm</span>
                                    <div className="mt-2 rounded-xl border border-gray-200 p-3">
                                        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                                            <button
                                                type="button"
                                                onClick={goToPreviousMonth}
                                                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-gray-500 hover:text-indigo-600"
                                                aria-label="Tháng trước"
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                                <span className="hidden md:block">Trước</span>
                                            </button>
                                            <span>
                                                Tháng {calendarMonth + 1}/{calendarYear}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={goToNextMonth}
                                                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-gray-500 hover:text-indigo-600"
                                                aria-label="Tháng sau"
                                            >
                                                <span className="hidden md:block">Sau</span>
                                                <ChevronRight className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-7 gap-2">
                                            {Array.from({ length: daysInMonth }, (_, index) => {
                                                const day = index + 1;
                                                const isSelected = day === selectedDay;
                                                return (
                                                    <button
                                                        key={day}
                                                        type="button"
                                                        onClick={() => {
                                                            const month = String(calendarMonth + 1).padStart(2, "0");
                                                            const dayValue = String(day).padStart(2, "0");
                                                            setSavingsDate(`${calendarYear}-${month}-${dayValue}`);
                                                        }}
                                                        className={`h-9 rounded-lg text-sm font-semibold transition ${isSelected
                                                            ? "bg-indigo-600 text-white shadow"
                                                            : "bg-white text-gray-700 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
                                                            }`}
                                                    >
                                                        {day}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                                {savingsError && (
                                    <div className="text-sm text-red-500 text-center">
                                        {savingsError}
                                    </div>
                                )}
                                <div className="flex justify-center">
                                    <button
                                        type="button"
                                        onClick={saveSavings}
                                        disabled={isSavingsSaving || !savingsAmountInput.trim()}
                                        className="md:max-w-[358px] py-3 px-6 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition text-white w-full font-bold rounded-full shadow-md"
                                    >
                                        {isSavingsSaving ? "Đang lưu..." : "Lưu"}
                                    </button>
                                </div>
                            </div>
                        )}
                        {savingsView === "goal" && (
                            <div className="rounded-xl border border-gray-200 p-4 text-gray-700">
                                Trang mục tiêu
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
