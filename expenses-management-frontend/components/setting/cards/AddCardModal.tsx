import type { Dispatch, FormEvent, SetStateAction } from "react";
import { X } from "lucide-react";
import type { CardFormState } from "./types";

type AddCardModalProps = {
    open: boolean;
    form: CardFormState;
    setForm: Dispatch<SetStateAction<CardFormState>>;
    onClose: () => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    formatCardNumber: (value: string) => string;
    formatExpiry: (value: string) => string;
    normalizeDigits: (value: string, maxLength: number) => string;
    error: string | null;
    isSaving: boolean;
};

export function AddCardModal({
    open,
    form,
    setForm,
    onClose,
    onSubmit,
    formatCardNumber,
    formatExpiry,
    normalizeDigits,
    error,
    isSaving,
}: AddCardModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 mb-0">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl animate-scale-in overflow-hidden">
                <div className="bg-gradient-to-r from-slate-900 via-sky-900 to-slate-800 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-2xl font-bold">Thêm thẻ</h3>
                            <p className="text-sm text-white/80">
                                Nhập thông tin thẻ ngân hàng
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>
                <form onSubmit={onSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="text-sm font-semibold text-gray-700">Tên</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(event) =>
                                setForm((prev) => ({ ...prev, name: event.target.value }))
                            }
                            className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2 lg:py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nguyễn Văn A"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-gray-700">Mã số</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength={19}
                            value={formatCardNumber(form.cardNumber)}
                            onChange={(event) =>
                                setForm((prev) => ({
                                    ...prev,
                                    cardNumber: normalizeDigits(event.target.value, 16),
                                }))
                            }
                            className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2 lg:py-4 text-sm tracking-[0.25em] focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="1234 5678 9012 3456"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-gray-700">Ngân hàng</label>
                        <select
                            value={form.bank}
                            onChange={(event) =>
                                setForm((prev) => ({
                                    ...prev,
                                    bank: event.target.value,
                                    bankOther: event.target.value === "other" ? prev.bankOther : "",
                                }))
                            }
                            className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2 lg:py-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="MB Bank">MB Bank</option>
                            <option value="Lio Bank">Lio Bank</option>
                            <option value="other">Khác</option>
                        </select>
                        {form.bank === "other" && (
                            <input
                                type="text"
                                value={form.bankOther}
                                onChange={(event) =>
                                    setForm((prev) => ({ ...prev, bankOther: event.target.value }))
                                }
                                className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-2 lg:py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập tên ngân hàng"
                            />
                        )}
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-gray-700">Loại thẻ</label>
                        <select
                            value={form.cardType}
                            onChange={(event) =>
                                setForm((prev) => ({
                                    ...prev,
                                    cardType: event.target.value as CardFormState["cardType"],
                                }))
                            }
                            className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2 lg:py-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="credit">Credit card</option>
                            <option value="debit">Debit card</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-semibold text-gray-700">Ngày hết hạn</label>
                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={5}
                                value={formatExpiry(form.expiry)}
                                onChange={(event) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        expiry: normalizeDigits(event.target.value, 4),
                                    }))
                                }
                                className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2 lg:py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="MM/YY"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-700">CVV</label>
                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={3}
                                value={form.cvv}
                                onChange={(event) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        cvv: normalizeDigits(event.target.value, 3),
                                    }))
                                }
                                className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2 lg:py-4 text-sm tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="123"
                            />
                        </div>
                    </div>
                    {error && (
                        <p className="text-sm text-red-500">{error}</p>
                    )}
                    <div className="grid grid-cols-2 border border-gray-300 rounded-full overflow-hidden">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 lg:py-3 border border-gray-200 text-sm lg:text-base font-semibold text-gray-600 hover:bg-gray-100 transition"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-4 py-2 lg:py-3 bg-blue-600 text-white text-sm lg:text-base font-semibold hover:bg-blue-700 transition disabled:opacity-70"
                        >
                            {isSaving ? "Đang lưu..." : "Xác nhận"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
