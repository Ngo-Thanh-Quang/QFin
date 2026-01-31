import { ChevronLeft, ChevronRight, CircleArrowRight, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuthUser } from "@/lib/auth/useAuthUser";
import { useSavingsRefreshStore } from "@/lib/store/savingsRefreshStore";

type SavingsTabProps = {
    open: boolean;
    active: boolean;
};

type SavingsItem = {
    id: string;
    amount: number;
    description?: string | null;
    date?: string | null;
    createdAt?: string | null;
};

type SavingsSummary = {
    items: SavingsItem[];
    count: number;
    totalAmount: number;
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
    const [savingsSummary, setSavingsSummary] = useState<SavingsSummary>({
        items: [],
        count: 0,
        totalAmount: 0,
    });
    const [totalSavingsAll, setTotalSavingsAll] = useState(0);
    const bumpSavingsRefresh = useSavingsRefreshStore((state) => state.bump);
    const [isSavingsLoading, setIsSavingsLoading] = useState(false);
    const [savingsLoadError, setSavingsLoadError] = useState<string | null>(null);
    const [selectedSavings, setSelectedSavings] = useState<SavingsItem | null>(null);
    const [editSavingsId, setEditSavingsId] = useState<string | null>(null);
    const [isSavingsDeleting, setIsSavingsDeleting] = useState(false);

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

    const formatDisplayDate = (value?: string | null) => {
        if (!value) return "";
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return "";
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        return `${day}/${month}/${date.getFullYear()}`;
    };

    const formatInputDate = (value?: string | null) => {
        if (!value) return "";
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return "";
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        return `${date.getFullYear()}-${month}-${day}`;
    };

    const formatSavingsAmount = (value: number) =>
        value.toLocaleString("vi-VN");

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
        setEditSavingsId(null);
        setSelectedSavings(null);
    }, [open]);

    useEffect(() => {
        if (!active || !user || initializing) return;
        let isMounted = true;
        const loadSavings = async () => {
            setIsSavingsLoading(true);
            setSavingsLoadError(null);
            try {
                const idToken = await user.getIdToken();
                const [monthlyRes, totalRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/savings`, {
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
                if (!monthlyRes.ok) {
                    throw new Error(`Load savings failed: ${monthlyRes.status}`);
                }
                if (!totalRes.ok) {
                    throw new Error(`Load savings summary failed: ${totalRes.status}`);
                }
                const [data, totalData] = await Promise.all([
                    monthlyRes.json(),
                    totalRes.json(),
                ]);
                if (!isMounted) return;
                setSavingsSummary({
                    items: data?.items ?? [],
                    count: data?.count ?? 0,
                    totalAmount: data?.totalAmount ?? 0,
                });
                setTotalSavingsAll(Number(totalData?.totalAmount ?? 0));
            } catch (error) {
                if (isMounted) {
                    setSavingsLoadError("Không thể tải dữ liệu tiết kiệm.");
                }
            } finally {
                if (isMounted) {
                    setIsSavingsLoading(false);
                }
            }
        };
        loadSavings();
        return () => {
            isMounted = false;
        };
    }, [active, user, initializing]);

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
            const isEditing = Boolean(editSavingsId);
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/savings${isEditing ? `/${editSavingsId}` : ""}`,
                {
                    method: isEditing ? "PATCH" : "POST",
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
            const responseData = await res.json().catch(() => null);
            const resetDate = getDefaultSavingsDate();
            const resetBaseDate = new Date(resetDate);
            setSavingsAmountInput("");
            setSavingsDescription("");
            setSavingsDate(resetDate);
            setCalendarYear(resetBaseDate.getFullYear());
            setCalendarMonth(resetBaseDate.getMonth());
            setSavingsView("menu");
            setEditSavingsId(null);
            const normalizedAmount = amountValue;
            const previousItem = isEditing && editSavingsId
                ? savingsSummary.items.find((item) => item.id === editSavingsId)
                : null;
            const previousAmount = Number(previousItem?.amount ?? 0);
            setSavingsSummary((prev) => {
                if (isEditing && editSavingsId) {
                    const nextItems = prev.items.map((item) => {
                        if (item.id !== editSavingsId) return item;
                        return {
                            ...item,
                            amount: normalizedAmount,
                            description: savingsDescription.trim() || null,
                            date: savingsDate || item.date || null,
                        };
                    });
                    const nextTotal = prev.totalAmount - previousAmount + normalizedAmount;
                    return {
                        items: nextItems,
                        count: prev.count,
                        totalAmount: Math.max(nextTotal, 0),
                    };
                }

                const newItem: SavingsItem = {
                    id: responseData?.id ?? `temp-${Date.now()}`,
                    amount: normalizedAmount,
                    description: savingsDescription.trim() || null,
                    date: savingsDate || null,
                    createdAt: new Date().toISOString(),
                };
                return {
                    items: [newItem, ...prev.items],
                    count: prev.count + 1,
                    totalAmount: prev.totalAmount + normalizedAmount,
                };
            });
            if (isEditing) {
                setTotalSavingsAll((total) =>
                    Math.max(total - previousAmount + normalizedAmount, 0)
                );
            } else {
                setTotalSavingsAll((total) => total + normalizedAmount);
            }
            bumpSavingsRefresh();
            setSavingsSuccess(isEditing ? "Cập nhật thành công!" : "Thiết lập thành công!");
        } catch (error) {
            setSavingsError("Lưu tiết kiệm thất bại. Vui lòng thử lại.");
        } finally {
            setIsSavingsSaving(false);
        }
    };

    const handleDeleteSavings = async () => {
        if (!selectedSavings || isSavingsDeleting) return;
        if (!user || initializing) {
            setSavingsError("Chưa xác thực người dùng.");
            return;
        }
        setIsSavingsDeleting(true);
        try {
            const idToken = await user.getIdToken();
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/savings/${selectedSavings.id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                    },
                }
            );
            if (!res.ok) {
                throw new Error(`Delete savings failed: ${res.status}`);
            }
            setSavingsSummary((prev) => {
                const nextItems = prev.items.filter((item) => item.id !== selectedSavings.id);
                const nextTotal = prev.totalAmount - Number(selectedSavings.amount ?? 0);
                return {
                    items: nextItems,
                    count: Math.max(prev.count - 1, 0),
                    totalAmount: Math.max(nextTotal, 0),
                };
            });
            setTotalSavingsAll((total) =>
                Math.max(total - Number(selectedSavings.amount ?? 0), 0)
            );
            bumpSavingsRefresh();
            setSelectedSavings(null);
            setSavingsSuccess("Đã xoá tiết kiệm.");
        } catch (error) {
            setSavingsError("Xoá tiết kiệm thất bại. Vui lòng thử lại.");
        } finally {
            setIsSavingsDeleting(false);
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
                        {savingsSuccess && (
                            <div
                                className={`px-4 py-3 text-sm text-green-600 bg-green-50 mb-4 rounded-full font-semibold text-center md:text-left transition-opacity duration-500 ${savingsSuccessFading ? "opacity-0" : "opacity-100"
                                    }`}
                            >
                                {savingsSuccess}
                            </div>
                        )}
                        <div className="grid border border-gray-300 rounded-lg overflow-hidden mb-4">
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
                        {isSavingsLoading ? (
                            <div className="text-sm text-gray-500 text-center">
                                Đang tải dữ liệu tiết kiệm...
                            </div>
                        ) : savingsLoadError ? (
                            <div className="text-sm text-red-500 text-center">
                                {savingsLoadError}
                            </div>
                        ) : savingsSummary.count === 0 ? (
                            <div className="text-sm text-gray-500 text-center">
                                Dữ liệu tiết kiệm chưa có, thiết lập ngay?
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <div className="grid grid-cols-2 gap-2 md:gap-4">
                                    <div className="flex items-center justify-between rounded-xl border border-green-300 px-4 py-3 lg:py-4 relative">
                                        <span className="text-xs lg:text-sm font-semibold text-emerald-600 absolute lg:static -top-2 bg-white px-1">
                                            Tiết kiệm tháng này
                                        </span>
                                        <span className="text-base lg:text-lg font-bold text-emerald-700">
                                            {formatSavingsAmount(savingsSummary.totalAmount)}đ
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-xl border border-green-300 px-4 py-3 lg:py-4 relative">
                                        <span className="text-xs lg:text-sm font-semibold text-emerald-600 absolute lg:static -top-2 bg-white px-1">
                                            Tổng tiết kiệm
                                        </span>
                                        <span className="text-base lg:text-lg font-bold text-emerald-700">
                                            {formatSavingsAmount(totalSavingsAll)}đ
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="">
                                    <div className="text-sm flex gap-2 justify-between mb-4">
                                        <div className="font-semibold text-gray-600">Tháng này bạn đã tiết kiệm</div>
                                        <span className="font-bold">
                                            {savingsSummary.count} lần
                                        </span>
                                    </div>
                                    <div className="space-y-4">
                                        {savingsSummary.items.map((item) => (
                                            <button
                                                key={item.id}
                                                type="button"
                                                onClick={() => setSelectedSavings(item)}
                                                className="flex w-full flex-col gap-1 md:gap-0 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-left transition hover:border-indigo-300"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="font-semibold text-gray-900">
                                                        {formatSavingsAmount(Number(item.amount ?? 0))}đ
                                                    </div>
                                                    <div className="text-xs text-gray-500 font-semibold">
                                                        {formatDisplayDate(item.date)}
                                                    </div>
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {item.description || "Không có mô tả."}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="w-1/2">
                        <button
                            type="button"
                            onClick={() => {
                                setSavingsView("menu");
                                setEditSavingsId(null);
                                setSavingsAmountInput("");
                                setSavingsDescription("");
                                const resetDate = getDefaultSavingsDate();
                                const resetBaseDate = new Date(resetDate);
                                setSavingsDate(resetDate);
                                setCalendarYear(resetBaseDate.getFullYear());
                                setCalendarMonth(resetBaseDate.getMonth());
                            }}
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
                                        {isSavingsSaving
                                            ? "Đang lưu..."
                                            : editSavingsId
                                                ? "Cập nhật"
                                                : "Lưu"}
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
            {selectedSavings && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl flex flex-col gap-4">
                        <div className="flex gap-2 justify-between items-center">
                            <div className="text-sm font-semibold text-gray-800">
                                Tuỳ chọn tiết kiệm
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedSavings(null)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="size-5" />
                            </button>
                        </div>
                        <div className="text-sm font-medium text-center">Bạn muốn thực hiện gì?</div>
                        <div className="flex">
                            <button
                                type="button"
                                onClick={() => {
                                    setEditSavingsId(selectedSavings.id);
                                    setSavingsAmountInput(String(selectedSavings.amount ?? ""));
                                    setSavingsDescription(selectedSavings.description ?? "");
                                    setSavingsDate(formatInputDate(selectedSavings.date));
                                    setSavingsView("setup");
                                    setSelectedSavings(null);
                                }}
                                className="w-full rounded-l-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:border-indigo-300 hover:text-indigo-600"
                            >
                                Chỉnh sửa
                            </button>
                            <button
                                type="button"
                                onClick={handleDeleteSavings}
                                disabled={isSavingsDeleting}
                                className="w-full rounded-r-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-red-600 hover:border-red-300 disabled:opacity-60"
                            >
                                {isSavingsDeleting ? "Đang xoá..." : "Xóa"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
