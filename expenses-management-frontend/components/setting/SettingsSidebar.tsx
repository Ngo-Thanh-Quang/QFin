"use client";

import { useEffect, useMemo, useState } from "react";
import { settingsCategories } from "../dashboard/data/dashboardData";
import { useAuthUser } from "@/lib/auth/useAuthUser";
import { AddCardModal } from "./cards/AddCardModal";
import { DeleteConfirmModal } from "./cards/DeleteConfirmModal";
import { EditCardModal } from "./cards/EditCardModal";
import { BudgetModal } from "./budget/BudgetModal";
import { SidebarLayout } from "./sidebar/SidebarLayout";
import { SettingsSidebarMenu } from "./sidebar/SettingsSidebarMenu";
import { useCardsManager } from "./cards/useCardsManager";

type SettingsSidebarProps = {
    open: boolean
    onClose: () => void
    onOpenAddExpense?: () => void
}

export function SettingsSidebar({ open, onClose, onOpenAddExpense }: SettingsSidebarProps) {
    const { user, initializing } = useAuthUser();
    const [isBudgetOpen, setIsBudgetOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"info" | "savings" | "cards">("info");
    const [monthlyExpense, setMonthlyExpense] = useState(0);
    const {
        isAddCardOpen,
        setIsAddCardOpen,
        isEditCardOpen,
        setIsEditCardOpen,
        isDeleteConfirmOpen,
        setIsDeleteConfirmOpen,
        isSavingCard,
        isDeletingCard,
        cardError,
        editCardError,
        cardForm,
        setCardForm,
        editCardForm,
        setEditCardForm,
        isCardsLoading,
        cardsLoadError,
        cardCounts,
        creditCards,
        debitCards,
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
    } = useCardsManager({ user, initializing, isBudgetOpen });
    const incomeAmount = 10400000;

    useEffect(() => {
        let isActive = true;

        const loadSummary = async () => {
            if (!isBudgetOpen) return;
            if (!user || initializing) {
                setMonthlyExpense(0);
                return;
            }

            try {
                const idToken = await user.getIdToken();
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/expenses/summary`,
                    {
                        headers: {
                            Authorization: `Bearer ${idToken}`,
                        },
                    }
                );

                if (!res.ok) {
                    throw new Error(`Summary fetch failed: ${res.status}`);
                }

                const data = await res.json();
                if (!isActive) return;
                setMonthlyExpense(Number(data?.current?.totalExpense ?? 0));
            } catch (err) {
                if (isActive) {
                    setMonthlyExpense(0);
                }
            }
        };

        loadSummary();

        return () => {
            isActive = false;
        };
    }, [isBudgetOpen, user, initializing]);

    const formattedIncomeAmount = useMemo(
        () => incomeAmount.toLocaleString("vi-VN"),
        [incomeAmount]
    );
    const formattedMonthlyExpense = useMemo(
        () => monthlyExpense.toLocaleString("vi-VN"),
        [monthlyExpense]
    );
    const formattedCurrentBalance = useMemo(
        () => (incomeAmount - monthlyExpense).toLocaleString("vi-VN"),
        [incomeAmount, monthlyExpense]
    );

    return (
        <>
            <SidebarLayout open={open} onClose={onClose}>
                <SettingsSidebarMenu
                    categories={settingsCategories}
                    onItemClick={(item) => {
                        if (item.id === "expenses" && onOpenAddExpense) {
                            onOpenAddExpense();
                        } else if (item.id === "budgets") {
                            setActiveTab("info");
                            setIsBudgetOpen(true);
                            onClose();
                        } else {
                            onClose();
                        }
                    }}
                />
            </SidebarLayout>

            <BudgetModal
                open={isBudgetOpen}
                activeTab={activeTab}
                onClose={() => setIsBudgetOpen(false)}
                onTabChange={setActiveTab}
                onOpenCardsTab={() => setActiveTab("cards")}
                formattedIncomeAmount={formattedIncomeAmount}
                formattedMonthlyExpense={formattedMonthlyExpense}
                formattedCurrentBalance={formattedCurrentBalance}
                cardCounts={cardCounts}
                creditCards={creditCards}
                debitCards={debitCards}
                isCardsLoading={isCardsLoading}
                cardsLoadError={cardsLoadError}
                onAddCard={openAddCard}
                onSelectCard={openEditCard}
                formatCardNumber={formatCardNumber}
                formatExpiry={formatExpiry}
            />

            <AddCardModal
                open={isAddCardOpen}
                form={cardForm}
                setForm={setCardForm}
                onClose={() => {
                    setIsAddCardOpen(false);
                    resetCardForm();
                }}
                onSubmit={handleSubmitCard}
                formatCardNumber={formatCardNumber}
                formatExpiry={formatExpiry}
                normalizeDigits={normalizeDigits}
                error={cardError}
                isSaving={isSavingCard}
            />

            <EditCardModal
                open={isEditCardOpen}
                form={editCardForm}
                setForm={setEditCardForm}
                onClose={() => {
                    setIsEditCardOpen(false);
                    resetEditCardForm();
                }}
                onSubmit={handleUpdateCard}
                onDeleteClick={() => setIsDeleteConfirmOpen(true)}
                formatCardNumber={formatCardNumber}
                formatExpiry={formatExpiry}
                normalizeDigits={normalizeDigits}
                error={editCardError}
                isSaving={isSavingCard}
                isDeleting={isDeletingCard}
            />

            <DeleteConfirmModal
                open={isDeleteConfirmOpen}
                onCancel={() => setIsDeleteConfirmOpen(false)}
                onConfirm={handleDeleteCard}
                isDeleting={isDeletingCard}
            />
        </>
    )
}
