import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { CardFormState, CardItem } from "./types";

type UseCardsManagerOptions = {
    user: { getIdToken: () => Promise<string> } | null;
    initializing: boolean;
    isBudgetOpen: boolean;
};

export function useCardsManager({ user, initializing, isBudgetOpen }: UseCardsManagerOptions) {
    const [isAddCardOpen, setIsAddCardOpen] = useState(false);
    const [isEditCardOpen, setIsEditCardOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [isSavingCard, setIsSavingCard] = useState(false);
    const [isDeletingCard, setIsDeletingCard] = useState(false);
    const [cardError, setCardError] = useState<string | null>(null);
    const [editCardError, setEditCardError] = useState<string | null>(null);
    const [cards, setCards] = useState<CardItem[]>([]);
    const [isCardsLoading, setIsCardsLoading] = useState(false);
    const [cardsLoadError, setCardsLoadError] = useState<string | null>(null);
    const [editingCardId, setEditingCardId] = useState<string | null>(null);
    const [cardForm, setCardForm] = useState<CardFormState>({
        name: "",
        cardNumber: "",
        bank: "MB Bank",
        bankOther: "",
        cardType: "credit",
        expiry: "",
        cvv: "",
    });
    const [editCardForm, setEditCardForm] = useState<CardFormState>({
        name: "",
        cardNumber: "",
        bank: "MB Bank",
        bankOther: "",
        cardType: "credit",
        expiry: "",
        cvv: "",
    });

    useEffect(() => {
        let isActive = true;

        const loadCards = async () => {
            if (!isBudgetOpen) return;
            if (!user || initializing) {
                setCards([]);
                return;
            }

            setIsCardsLoading(true);
            setCardsLoadError(null);

            try {
                const idToken = await user.getIdToken();
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cards`, {
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                    },
                });

                if (!res.ok) {
                    throw new Error(`Cards fetch failed: ${res.status}`);
                }

                const data = await res.json();
                if (!isActive) return;
                setCards(Array.isArray(data?.items) ? data.items : []);
            } catch (err) {
                if (isActive) {
                    setCards([]);
                    setCardsLoadError("Không thể tải danh sách thẻ.");
                }
            } finally {
                if (isActive) {
                    setIsCardsLoading(false);
                }
            }
        };

        loadCards();

        return () => {
            isActive = false;
        };
    }, [isBudgetOpen, user, initializing]);

    const cardCounts = useMemo(() => {
        const credit = cards.filter((card) => card.cardType === "credit").length;
        const debit = cards.filter((card) => card.cardType === "debit").length;
        return { credit, debit, total: cards.length };
    }, [cards]);
    const creditCards = useMemo(
        () => cards.filter((card) => card.cardType === "credit"),
        [cards]
    );
    const debitCards = useMemo(
        () => cards.filter((card) => card.cardType === "debit"),
        [cards]
    );

    const formatCardNumber = (value: string) => {
        const digits = value.replace(/\D/g, "").slice(0, 16);
        return digits.replace(/(.{4})/g, "$1 ").trim();
    };

    const formatExpiry = (value: string) => {
        const digits = value.replace(/\D/g, "").slice(0, 4);
        if (digits.length <= 2) return digits;
        return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    };

    const normalizeDigits = (value: string, maxLength: number) =>
        value.replace(/\D/g, "").slice(0, maxLength);

    const resetCardForm = () => {
        setCardForm({
            name: "",
            cardNumber: "",
            bank: "MB Bank",
            bankOther: "",
            cardType: "credit",
            expiry: "",
            cvv: "",
        });
        setCardError(null);
    };

    const resetEditCardForm = () => {
        setEditCardForm({
            name: "",
            cardNumber: "",
            bank: "MB Bank",
            bankOther: "",
            cardType: "credit",
            expiry: "",
            cvv: "",
        });
        setEditCardError(null);
        setEditingCardId(null);
        setIsDeleteConfirmOpen(false);
    };

    const openAddCard = () => {
        setIsAddCardOpen(true);
        setCardError(null);
    };

    const handleSubmitCard = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setCardError(null);

        if (!user || initializing) {
            setCardError("Vui lòng đăng nhập trước khi thêm thẻ.");
            return;
        }

        const name = cardForm.name.trim();
        const bankName = cardForm.bank === "other" ? cardForm.bankOther.trim() : cardForm.bank;

        if (!name) {
            setCardError("Vui lòng nhập tên chủ thẻ.");
            return;
        }
        if (cardForm.cardNumber.length !== 16) {
            setCardError("Mã số thẻ cần đủ 16 chữ số.");
            return;
        }
        if (!bankName) {
            setCardError("Vui lòng chọn ngân hàng hoặc nhập ngân hàng khác.");
            return;
        }
        if (!cardForm.cardType) {
            setCardError("Vui lòng chọn loại thẻ.");
            return;
        }
        if (cardForm.expiry.length !== 4) {
            setCardError("Ngày hết hạn cần đủ 4 chữ số (MM/YY).");
            return;
        }
        if (cardForm.cvv.length !== 3) {
            setCardError("CVV cần đủ 3 chữ số.");
            return;
        }

        setIsSavingCard(true);
        try {
            const idToken = await user.getIdToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cards`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify({
                    name,
                    cardNumber: cardForm.cardNumber,
                    bank: bankName,
                    cardType: cardForm.cardType,
                    expiry: cardForm.expiry,
                    cvv: cardForm.cvv,
                }),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`CreateCard failed: ${res.status} ${text}`);
            }

            const created = await res.json();
            setCards((prev) => [
                {
                    id: created?.id ?? `${Date.now()}`,
                    name,
                    cardNumber: cardForm.cardNumber,
                    bank: bankName,
                    cardType: cardForm.cardType as "credit" | "debit",
                    expiry: cardForm.expiry,
                    cvv: cardForm.cvv,
                },
                ...prev,
            ]);

            setIsAddCardOpen(false);
            resetCardForm();
        } catch (err) {
            setCardError("Không thể lưu thẻ. Vui lòng thử lại.");
        } finally {
            setIsSavingCard(false);
        }
    };

    const openEditCard = (card: CardItem) => {
        const isKnownBank = card.bank === "MB Bank" || card.bank === "Lio Bank";
        setEditCardForm({
            name: card.name,
            cardNumber: card.cardNumber,
            bank: isKnownBank ? card.bank : "other",
            bankOther: isKnownBank ? "" : card.bank,
            cardType: card.cardType,
            expiry: card.expiry,
            cvv: card.cvv,
        });
        setEditingCardId(card.id);
        setEditCardError(null);
        setIsEditCardOpen(true);
    };

    const handleUpdateCard = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setEditCardError(null);

        if (!user || initializing) {
            setEditCardError("Vui lòng đăng nhập trước khi cập nhật thẻ.");
            return;
        }

        if (!editingCardId) {
            setEditCardError("Không tìm thấy thẻ cần cập nhật.");
            return;
        }

        const name = editCardForm.name.trim();
        const bankName = editCardForm.bank === "other" ? editCardForm.bankOther.trim() : editCardForm.bank;

        if (!name) {
            setEditCardError("Vui lòng nhập tên chủ thẻ.");
            return;
        }
        if (editCardForm.cardNumber.length !== 16) {
            setEditCardError("Mã số thẻ cần đủ 16 chữ số.");
            return;
        }
        if (!bankName) {
            setEditCardError("Vui lòng chọn ngân hàng hoặc nhập ngân hàng khác.");
            return;
        }
        if (!editCardForm.cardType) {
            setEditCardError("Vui lòng chọn loại thẻ.");
            return;
        }
        if (editCardForm.expiry.length !== 4) {
            setEditCardError("Ngày hết hạn cần đủ 4 chữ số (MM/YY).");
            return;
        }
        if (editCardForm.cvv.length !== 3) {
            setEditCardError("CVV cần đủ 3 chữ số.");
            return;
        }

        setIsSavingCard(true);
        try {
            const idToken = await user.getIdToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cards/${editingCardId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify({
                    name,
                    cardNumber: editCardForm.cardNumber,
                    bank: bankName,
                    cardType: editCardForm.cardType,
                    expiry: editCardForm.expiry,
                    cvv: editCardForm.cvv,
                }),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`UpdateCard failed: ${res.status} ${text}`);
            }

            setCards((prev) =>
                prev.map((card) =>
                    card.id === editingCardId
                        ? {
                            ...card,
                            name,
                            cardNumber: editCardForm.cardNumber,
                            bank: bankName,
                            cardType: editCardForm.cardType as "credit" | "debit",
                            expiry: editCardForm.expiry,
                            cvv: editCardForm.cvv,
                        }
                        : card
                )
            );

            setIsEditCardOpen(false);
            resetEditCardForm();
        } catch (err) {
            setEditCardError("Không thể cập nhật thẻ. Vui lòng thử lại.");
        } finally {
            setIsSavingCard(false);
        }
    };

    const handleDeleteCard = async () => {
        if (!editingCardId) {
            setEditCardError("Không tìm thấy thẻ cần xóa.");
            return;
        }
        if (!user || initializing) {
            setEditCardError("Vui lòng đăng nhập trước khi xóa thẻ.");
            return;
        }

        setIsDeletingCard(true);
        setEditCardError(null);
        try {
            const idToken = await user.getIdToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cards/${editingCardId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`DeleteCard failed: ${res.status} ${text}`);
            }

            setCards((prev) => prev.filter((card) => card.id !== editingCardId));
            setIsEditCardOpen(false);
            resetEditCardForm();
        } catch (err) {
            setEditCardError("Không thể xóa thẻ. Vui lòng thử lại.");
        } finally {
            setIsDeletingCard(false);
        }
    };

    return {
        cards,
        isCardsLoading,
        cardsLoadError,
        cardCounts,
        creditCards,
        debitCards,
        cardForm,
        setCardForm,
        editCardForm,
        setEditCardForm,
        isAddCardOpen,
        setIsAddCardOpen,
        isEditCardOpen,
        setIsEditCardOpen,
        isDeleteConfirmOpen,
        setIsDeleteConfirmOpen,
        cardError,
        editCardError,
        isSavingCard,
        isDeletingCard,
        formatCardNumber,
        formatExpiry,
        normalizeDigits,
        resetCardForm,
        resetEditCardForm,
        openAddCard,
        handleSubmitCard,
        openEditCard,
        handleUpdateCard,
        handleDeleteCard,
    };
}
