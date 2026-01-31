import { ChevronRight, Pencil, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CardsTab } from "../cards/CardsTab";
import type { CardItem } from "../cards/types";
import { SavingsTab } from "./SavingsTab";

type BudgetModalProps = {
    open: boolean;
    activeTab: "info" | "savings" | "cards";
    onClose: () => void;
    onTabChange: (tab: "info" | "savings" | "cards") => void;
    onOpenCardsTab: () => void;
    formattedIncomeAmount: string;
    formattedMonthlyExpense: string;
    formattedCurrentBalance: string;
    onIncomeCommit?: (amount: number) => Promise<void> | void;
    cardCounts: { credit: number; debit: number; total: number };
    creditCards: CardItem[];
    debitCards: CardItem[];
    isCardsLoading: boolean;
    cardsLoadError: string | null;
    onAddCard: () => void;
    onSelectCard: (card: CardItem) => void;
    formatCardNumber: (value: string) => string;
    formatExpiry: (value: string) => string;
};

export function BudgetModal({
    open,
    activeTab,
    onClose,
    onTabChange,
    onOpenCardsTab,
    formattedIncomeAmount,
    formattedMonthlyExpense,
    formattedCurrentBalance,
    onIncomeCommit,
    cardCounts,
    creditCards,
    debitCards,
    isCardsLoading,
    cardsLoadError,
    onAddCard,
    onSelectCard,
    formatCardNumber,
    formatExpiry,
}: BudgetModalProps) {
    const [isIncomeReveal, setIsIncomeReveal] = useState(false);
    const [isIncomeEditing, setIsIncomeEditing] = useState(false);
    const [isIncomeSaving, setIsIncomeSaving] = useState(false);
    const [incomeValue, setIncomeValue] = useState(10400000);
    const [incomeInput, setIncomeInput] = useState("10400000");

    const parseAmount = (value: string) => {
        const digits = value.replace(/[^\d]/g, "");
        return digits ? Number(digits) : 0;
    };

    const initialIncomeValue = useMemo(() => {
        const parsed = parseAmount(formattedIncomeAmount);
        return parsed || 10400000;
    }, [formattedIncomeAmount]);

    useEffect(() => {
        if (!open) return;
        setIncomeValue(initialIncomeValue);
        setIncomeInput(String(initialIncomeValue));
        setIsIncomeReveal(false);
        setIsIncomeEditing(false);
    }, [open, initialIncomeValue]);

    useEffect(() => {
        if (!open) return;
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [open]);


    const commitIncome = async () => {
        const parsed = parseAmount(incomeInput);
        const finalValue = parsed || 10400000;
        if (isIncomeSaving) return;

        setIsIncomeSaving(true);
        try {
            if (onIncomeCommit) {
                await onIncomeCommit(finalValue);
            }
            setIncomeValue(finalValue);
            setIncomeInput(String(finalValue));
        } catch (error) {
            setIncomeInput(String(incomeValue));
        } finally {
            setIsIncomeSaving(false);
            setIsIncomeEditing(false);
            setIsIncomeReveal(false);
        }
    };

    const cancelIncomeEdit = () => {
        setIncomeInput(String(incomeValue));
        setIsIncomeEditing(false);
        setIsIncomeReveal(false);
    };

    const formattedIncomeDisplay = useMemo(
        () => incomeValue.toLocaleString("vi-VN"),
        [incomeValue]
    );


    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 mb-0">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in h-screen"
                onClick={onClose}
            />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl animate-scale-in overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-cyan-600 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-2xl font-bold">Ví của bạn</h3>
                            <p className="text-sm text-white/80">
                                Tổng quan tài chính của bạn
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>
                <div className="px-4 lg:px-6 pt-4 flex justify-center">
                    <div className="grid grid-cols-3 rounded-xl bg-gray-100 p-1">
                        {[
                            { id: "info", label: "Thông tin" },
                            { id: "savings", label: "Tiết kiệm" },
                            { id: "cards", label: "Thẻ" },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id as typeof activeTab)}
                                className={`px-4 py-2 text-sm font-semibold rounded-lg transition whitespace-nowrap ${activeTab === tab.id
                                    ? "bg-white text-indigo-600 shadow"
                                    : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="px-4 lg:px-6 py-6 overflow-x-hidden overflow-y-auto max-h-[calc(100vh-208px)]">
                    {activeTab === "info" && (
                        <div className="space-y-4">
                            <div className="grid lg:grid-cols-2 gap-4">
                                <div
                                    className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 lg:py-4 relative cursor-pointer"
                                    onClick={() => {
                                        if (!isIncomeEditing) {
                                            setIsIncomeReveal((prev) => !prev);
                                        }
                                    }}
                                    onMouseLeave={() => {
                                        if (!isIncomeEditing) {
                                            setIsIncomeReveal(false);
                                        }
                                    }}
                                >
                                    <span className="text-xs lg:text-sm font-semibold text-green-600 absolute lg:static -top-2 bg-white px-1">
                                        Thu nhập
                                    </span>
                                    <div
                                        className={`flex items-center justify-end gap-2 transition-transform duration-500 ${isIncomeReveal ? "lg:-translate-x-10" : "translate-x-0"
                                            }`}
                                    >
                                        <span className="text-base lg:text-lg font-bold text-green-600">
                                            <span>+ </span>
                                            {isIncomeEditing ? (
                                                <input
                                                    value={incomeInput}
                                                    onClick={(event) => event.stopPropagation()}
                                                    onChange={(event) => {
                                                        const nextValue = event.target.value.replace(/[^\d]/g, "");
                                                        setIncomeInput(nextValue);
                                                    }}
                                                    onBlur={commitIncome}
                                                    onKeyDown={(event) => {
                                                        if (event.key === "Enter") {
                                                            commitIncome();
                                                        }
                                                        if (event.key === "Escape") {
                                                            cancelIncomeEdit();
                                                        }
                                                    }}
                                                    inputMode="numeric"
                                                    disabled={isIncomeSaving}
                                                    className="w-28 lg:w-36 bg-transparent text-green-700 focus:outline-none"
                                                    autoFocus
                                                />
                                            ) : (
                                                formattedIncomeDisplay
                                            )}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            setIsIncomeEditing(true);
                                            setIsIncomeReveal(true);
                                        }}
                                        className={`absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-green-50 p-2 text-green-600 transition-all duration-500 ${isIncomeReveal
                                                ? "opacity-100 translate-x-0"
                                                : "opacity-0 translate-x-6 pointer-events-none"
                                            }`}
                                        aria-label="Chỉnh sửa thu nhập"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 lg:py-4 relative">
                                    <span className="text-xs lg:text-sm font-semibold text-red-600 absolute lg:static -top-2 bg-white px-1">
                                        Chi tiêu
                                    </span>
                                    <span className="text-base lg:text-lg font-bold text-red-600">
                                        <span>- </span>{formattedMonthlyExpense}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 lg:py-4 relative">
                                <span className="text-xs lg:text-sm font-semibold text-gray-600 absolute lg:static -top-2 bg-white px-1">
                                    Số dư tháng này
                                </span>
                                <span className="text-base lg:text-lg font-bold text-gray-900">
                                    {formattedCurrentBalance}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 lg:gap-4">
                                <div className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 lg:py-4 relative">
                                    <span className="text-xs lg:text-sm font-semibold text-gray-600 absolute lg:static -top-2 bg-white px-1">
                                        Tiết kiệm
                                    </span>
                                    <span className="text-base lg:text-lg font-bold text-gray-900">
                                        5.000.000
                                    </span>
                                </div>
                                <div className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 lg:py-4 relative">
                                    <span className="text-xs lg:text-sm font-semibold text-gray-600 absolute lg:static -top-2 bg-white px-1">
                                        Mục tiêu
                                    </span>
                                    <span className="text-base lg:text-lg font-bold text-gray-900">
                                        5.000.000
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 lg:py-4 relative">
                                <span className="text-xs lg:text-sm font-semibold text-gray-600 absolute lg:static -top-2 bg-white px-1">
                                    Tổng số dư
                                </span>
                                <span className="text-base lg:text-lg font-bold text-gray-900">
                                    {formattedIncomeAmount}
                                </span>
                            </div>
                            <div onClick={onOpenCardsTab} className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 lg:py-4 relative cursor-pointer hover:bg-gray-100  transition duration-500">
                                <span className="text-xs lg:text-sm font-semibold text-gray-600 absolute lg:static -top-2 bg-white px-1 lg:bg-transparent">
                                    Số thẻ hiện có
                                </span>
                                <span className="text-base lg:text-lg font-bold text-gray-900">
                                    {cardCounts.total}
                                </span>
                                <ChevronRight className="block lg:hidden text-gray-400" />
                            </div>
                        </div>
                    )}
                    <SavingsTab open={open} active={activeTab === "savings"} />
                    {activeTab === "cards" && (
                        <CardsTab
                            cardCounts={cardCounts}
                            creditCards={creditCards}
                            debitCards={debitCards}
                            isCardsLoading={isCardsLoading}
                            cardsLoadError={cardsLoadError}
                            onAddCard={onAddCard}
                            onSelectCard={onSelectCard}
                            formatCardNumber={formatCardNumber}
                            formatExpiry={formatExpiry}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
