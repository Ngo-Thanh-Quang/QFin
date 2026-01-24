import { Plus } from "lucide-react";
import type { CardItem } from "./types";

type CardsTabProps = {
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

export function CardsTab({
    cardCounts,
    creditCards,
    debitCards,
    isCardsLoading,
    cardsLoadError,
    onAddCard,
    onSelectCard,
    formatCardNumber,
    formatExpiry,
}: CardsTabProps) {
    return (
        <div className="flex flex-col gap-6 max-h-[calc(100vh-240px)] lg:max-h-[calc(100vh-272px)] overflow-y-scroll">
            <div className="flex justify-between items-center">
                <div className="font-black text-xl relative">
                    Thẻ của bạn
                    <span className="bg-blue-500 text-white py-0.5 px-2 rounded-full text-xs absolute -top-0.5 ml-1">
                        {cardCounts.total}
                    </span>
                </div>
                <button
                    type="button"
                    onClick={onAddCard}
                    className="px-2 lg:px-4 py-2 bg-blue-500 hover:bg-blue-600 transition duration-500 text-white rounded-full font-bold cursor-pointer flex gap-1"
                >
                    <Plus />
                    <p className="hidden lg:block">Thêm thẻ</p>
                </button>
            </div>
            <div className="flex flex-col justify-center items-center gap-4">
                {isCardsLoading && (
                    <p className="text-sm text-gray-500">Đang tải thẻ...</p>
                )}
                {cardsLoadError && (
                    <p className="text-sm text-red-500">{cardsLoadError}</p>
                )}
                {/* Credit Card */}
                <div className="w-full sm:w-[380px]">
                    <div className="font-bold text-center w-full mb-2 text-base lg:text-lg relative">
                        CREDIT
                        <span className="bg-blue-500 text-white py-0.5 px-2 rounded-full text-xs absolute -top-0.5 ml-1">
                            {cardCounts.credit}
                        </span>
                    </div>
                    {creditCards.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center">
                            Chưa có thẻ credit.
                        </p>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {creditCards.map((card) => (
                                <button
                                    key={card.id}
                                    type="button"
                                    onClick={() => onSelectCard(card)}
                                    className="w-full relative aspect-video lg:aspect-auto min-h-[175px] lg:h-[220px] rounded-2xl p-5 text-white
                                        bg-gradient-to-br from-slate-900 via-sky-900 to-slate-800
                                        shadow-2xl overflow-hidden text-left flex flex-col"
                                >
                                    {/* Top */}
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-semibold tracking-wide">
                                                {card.bank}
                                            </p>
                                            <p className="text-xs tracking-widest opacity-70 mt-1">
                                                CREDIT
                                            </p>
                                        </div>

                                        {/* Chip */}
                                        <div className="w-14 h-10 rounded-lg bg-gradient-to-br
                                                from-yellow-200 to-yellow-400
                                                flex flex-col justify-center gap-1 px-2">
                                            <span className="h-[2px] bg-black/30 rounded" />
                                            <span className="h-[2px] bg-black/30 rounded" />
                                            <span className="h-[2px] bg-black/30 rounded" />
                                        </div>
                                    </div>

                                    {/* Card Number */}
                                    <p className="mt-6 lg:mt-10 text-lg lg:text-xl tracking-[0.2em] font-semibold">
                                        {formatCardNumber(card.cardNumber)}
                                    </p>

                                    {/* Bottom */}
                                    <div className="mt-auto flex justify-between items-end">
                                        <div>
                                            <p className="text-[10px] tracking-widest opacity-60">
                                                CARDHOLDER
                                            </p>
                                            <p className="text-sm font-semibold uppercase">
                                                {card.name}
                                            </p>
                                        </div>

                                        <div className="flex gap-6">
                                            <div>
                                                <p className="text-[10px] tracking-widest opacity-60">
                                                    EXPIRES
                                                </p>
                                                <p className="text-sm font-semibold">
                                                    {formatExpiry(card.expiry)}
                                                </p>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-[10px] tracking-widest opacity-60">
                                                    CVV
                                                </p>
                                                <p className="text-sm font-semibold tracking-widest">
                                                    {card.cvv}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Decorative gradients */}
                                    <div className="absolute -bottom-24 -left-24 w-56 h-56
                                            bg-emerald-400/30 rounded-full blur-3xl" />
                                    <div className="absolute -top-24 -right-24 w-64 h-64
                                            bg-indigo-400/30 rounded-full blur-3xl" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                {/* Debit */}
                <div className="w-full sm:w-[380px]">
                    <div className="font-bold text-center w-full mb-2 text-base lg:text-lg relative">
                        DEBIT
                        <span className="bg-blue-500 text-white py-0.5 px-2 rounded-full text-xs absolute -top-0.5 ml-1">
                            {cardCounts.debit}
                        </span>
                    </div>
                    {debitCards.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center">
                            Chưa có thẻ debit.
                        </p>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {debitCards.map((card) => (
                                <button
                                    key={card.id}
                                    type="button"
                                    onClick={() => onSelectCard(card)}
                                    className="w-full relative aspect-video lg:aspect-auto min-h-[175px] lg:h-[220px] rounded-2xl p-5 text-white
                                        bg-gradient-to-br from-slate-900 via-sky-900 to-slate-800
                                        shadow-2xl overflow-hidden text-left flex flex-col"
                                >
                                    {/* Top */}
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-semibold tracking-wide">
                                                {card.bank}
                                            </p>
                                            <p className="text-xs tracking-widest opacity-70 mt-1">
                                                DEBIT
                                            </p>
                                        </div>

                                        {/* Chip */}
                                        <div className="w-14 h-10 rounded-lg bg-gradient-to-br
                                                from-yellow-200 to-yellow-400
                                                flex flex-col justify-center gap-1 px-2">
                                            <span className="h-[2px] bg-black/30 rounded" />
                                            <span className="h-[2px] bg-black/30 rounded" />
                                            <span className="h-[2px] bg-black/30 rounded" />
                                        </div>
                                    </div>

                                    {/* Card Number */}
                                    <p className="mt-6 lg:mt-10 text-lg lg:text-xl tracking-[0.2em] font-semibold">
                                        {formatCardNumber(card.cardNumber)}
                                    </p>

                                    {/* Bottom */}
                                    <div className="mt-auto flex justify-between items-end">
                                        <div>
                                            <p className="text-[10px] tracking-widest opacity-60">
                                                CARDHOLDER
                                            </p>
                                            <p className="text-sm font-semibold uppercase">
                                                {card.name}
                                            </p>
                                        </div>

                                        <div className="flex gap-6">
                                            <div>
                                                <p className="text-[10px] tracking-widest opacity-60">
                                                    EXPIRES
                                                </p>
                                                <p className="text-sm font-semibold">
                                                    {formatExpiry(card.expiry)}
                                                </p>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-[10px] tracking-widest opacity-60">
                                                    CVV
                                                </p>
                                                <p className="text-sm font-semibold tracking-widest">
                                                    {card.cvv}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Decorative gradients */}
                                    <div className="absolute -bottom-24 -left-24 w-56 h-56
                                            bg-emerald-400/30 rounded-full blur-3xl" />
                                    <div className="absolute -top-24 -right-24 w-64 h-64
                                            bg-indigo-400/30 rounded-full blur-3xl" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
