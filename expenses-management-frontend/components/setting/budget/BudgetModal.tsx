import { ChevronRight, X } from "lucide-react";
import { CardsTab } from "../cards/CardsTab";
import type { CardItem } from "../cards/types";

type BudgetModalProps = {
    open: boolean;
    activeTab: "info" | "savings" | "cards";
    onClose: () => void;
    onTabChange: (tab: "info" | "savings" | "cards") => void;
    onOpenCardsTab: () => void;
    formattedIncomeAmount: string;
    formattedMonthlyExpense: string;
    formattedCurrentBalance: string;
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
                                className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${activeTab === tab.id
                                    ? "bg-white text-indigo-600 shadow"
                                    : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="px-4 lg:px-6 py-6">
                    {activeTab === "info" && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-2 lg:gap-4">
                                <div className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 lg:py-4 relative">
                                    <span className="text-xs lg:text-sm font-semibold text-green-600 absolute lg:static -top-2 bg-white">
                                        Thu nhập
                                    </span>
                                    <span className="text-base lg:text-lg font-bold text-green-600">
                                        <span className="hidden lg:inline">+ </span>{formattedIncomeAmount}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 lg:py-4 relative">
                                    <span className="text-xs lg:text-sm font-semibold text-red-600 absolute lg:static -top-2 bg-white">
                                        Chi tiêu
                                    </span>
                                    <span className="text-base lg:text-lg font-bold text-red-600">
                                        <span className="hidden lg:inline">- </span>{formattedMonthlyExpense}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 lg:py-4 relative">
                                <span className="text-xs lg:text-sm font-semibold text-gray-600 absolute lg:static -top-2 bg-white">
                                    Số dư tháng này
                                </span>
                                <span className="text-base lg:text-lg font-bold text-gray-900">
                                    {formattedCurrentBalance}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 lg:gap-4">
                                <div className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 lg:py-4 relative">
                                    <span className="text-xs lg:text-sm font-semibold text-gray-600 absolute lg:static -top-2 bg-white">
                                        Tiết kiệm
                                    </span>
                                    <span className="text-base lg:text-lg font-bold text-gray-900">
                                        5.000.000
                                    </span>
                                </div>
                                <div className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 lg:py-4 relative">
                                    <span className="text-xs lg:text-sm font-semibold text-gray-600 absolute lg:static -top-2 bg-white">
                                        Mục tiêu
                                    </span>
                                    <span className="text-base lg:text-lg font-bold text-gray-900">
                                        5.000.000
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 lg:py-4 relative">
                                <span className="text-xs lg:text-sm font-semibold text-gray-600 absolute lg:static -top-2 bg-white">
                                    Tổng số dư
                                </span>
                                <span className="text-base lg:text-lg font-bold text-gray-900">
                                    {formattedIncomeAmount}
                                </span>
                            </div>
                            <div onClick={onOpenCardsTab} className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 lg:py-4 relative cursor-pointer hover:bg-gray-100  transition duration-500">
                                <span className="text-xs lg:text-sm font-semibold text-gray-600 absolute lg:static -top-2 bg-white lg:bg-transparent">
                                    Số thẻ hiện có
                                </span>
                                <span className="text-base lg:text-lg font-bold text-gray-900">
                                    {cardCounts.total}
                                </span>
                                <ChevronRight className="block lg:hidden text-gray-400" />
                            </div>
                        </div>
                    )}
                    {activeTab === "savings" && (
                        <div className="text-sm text-gray-500">
                            Chưa có dữ liệu tiết kiệm.
                        </div>
                    )}
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
