"use client";
import React, { useEffect, useMemo, useState } from "react";



type Expense = {
    id: string;
    description: string;
    amount: number;
    date: string; // ISO yyyy-mm-dd
    category?: string;
};

const STORAGE_KEY = "expenses.management.demo";

function uid() {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function Page(): React.ReactElement {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState<string>("");
    const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [category, setCategory] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [monthFilter, setMonthFilter] = useState<string>(() => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`; // yyyy-mm
    });

    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) setExpenses(JSON.parse(raw));
        } catch {
            setExpenses([]);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
        } catch {
            // ignore
        }
    }, [expenses]);

    const clearForm = () => {
        setDescription("");
        setAmount("");
        setDate(new Date().toISOString().slice(0, 10));
        setCategory("");
        setEditingId(null);
    };

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        const amt = parseFloat(amount);
        if (!description.trim() || Number.isNaN(amt) || amt <= 0) {
            alert("Provide a description and a positive amount.");
            return;
        }
        if (editingId) {
            setExpenses((prev) =>
                prev.map((ex) =>
                    ex.id === editingId ? { ...ex, description, amount: amt, date, category } : ex
                )
            );
        } else {
            const newExpense: Expense = {
                id: uid(),
                description,
                amount: amt,
                date,
                category,
            };
            setExpenses((prev) => [newExpense, ...prev]);
        }
        clearForm();
    };

    const handleEdit = (id: string) => {
        const e = expenses.find((x) => x.id === id);
        if (!e) return;
        setEditingId(id);
        setDescription(e.description);
        setAmount(String(e.amount));
        setDate(e.date);
        setCategory(e.category ?? "");
    };

    const handleDelete = (id: string) => {
        if (!confirm("Delete this expense?")) return;
        setExpenses((prev) => prev.filter((x) => x.id !== id));
        if (editingId === id) clearForm();
    };

    const filtered = useMemo(() => {
        return expenses.filter((ex) => {
            const matchesSearch =
                !search || ex.description.toLowerCase().includes(search.toLowerCase());
            const matchesMonth = !monthFilter || ex.date.startsWith(monthFilter);
            return matchesSearch && matchesMonth;
        });
    }, [expenses, search, monthFilter]);

    const total = useMemo(
        () => filtered.reduce((s, e) => s + e.amount, 0),
        [filtered]
    );

    const formatCurrency = (n: number) =>
        n.toLocaleString(undefined, { style: "currency", currency: "USD" });

    return (
        <main style={{ padding: 24, fontFamily: "Inter, system-ui, Arial" }}>
            <h1 style={{ margin: "0 0 12px 0" }}>Manage Expenses</h1>

            <section
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 320px",
                    gap: 16,
                    alignItems: "start",
                }}
            >
                <div>
                    <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                        <input
                            aria-label="Search description"
                            placeholder="Search description..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ flex: 1, padding: "8px 10px" }}
                        />
                        <input
                            aria-label="Filter month"
                            type="month"
                            value={monthFilter}
                            onChange={(e) => setMonthFilter(e.target.value)}
                            style={{ padding: "8px 10px" }}
                        />
                        <button
                            onClick={() => {
                                setSearch("");
                                const d = new Date();
                                setMonthFilter(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
                            }}
                            style={{ padding: "8px 12px" }}
                            title="Reset filters"
                        >
                            Reset
                        </button>
                    </div>

                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            background: "#fff",
                            boxShadow: "0 0 0 1px rgba(0,0,0,0.06)",
                        }}
                    >
                        <thead>
                            <tr>
                                <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #eee" }}>
                                    Date
                                </th>
                                <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #eee" }}>
                                    Description
                                </th>
                                <th style={{ textAlign: "right", padding: 8, borderBottom: "1px solid #eee" }}>
                                    Amount
                                </th>
                                <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #eee" }}>
                                    Category
                                </th>
                                <th style={{ padding: 8, borderBottom: "1px solid #eee" }} />
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ padding: 16, textAlign: "center", color: "#666" }}>
                                        No expenses found.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((ex) => (
                                    <tr key={ex.id}>
                                        <td style={{ padding: 8 }}>{ex.date}</td>
                                        <td style={{ padding: 8 }}>{ex.description}</td>
                                        <td style={{ padding: 8, textAlign: "right" }}>{formatCurrency(ex.amount)}</td>
                                        <td style={{ padding: 8 }}>{ex.category ?? "-"}</td>
                                        <td style={{ padding: 8, textAlign: "right" }}>
                                            <button
                                                onClick={() => handleEdit(ex.id)}
                                                style={{ marginRight: 8 }}
                                                aria-label={`Edit ${ex.description}`}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(ex.id)}
                                                aria-label={`Delete ${ex.description}`}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={2} style={{ padding: 8, fontWeight: 600 }}>
                                    Total
                                </td>
                                <td style={{ padding: 8, textAlign: "right", fontWeight: 600 }}>
                                    {formatCurrency(total)}
                                </td>
                                <td colSpan={2} />
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <aside
                    style={{
                        borderLeft: "1px solid #eee",
                        paddingLeft: 16,
                        minWidth: 280,
                    }}
                >
                    <h2 style={{ marginTop: 0 }}>{editingId ? "Edit Expense" : "Add Expense"}</h2>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: 8 }}>
                            <label style={{ display: "block", marginBottom: 4 }}>Description</label>
                            <input
                                placeholder="e.g., Coffee with client"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                style={{ width: "100%", padding: "8px 10px" }}
                            />
                        </div>

                        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: "block", marginBottom: 4 }}>Amount (USD)</label>
                                <input
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    inputMode="decimal"
                                    placeholder="0.00"
                                    style={{ width: "100%", padding: "8px 10px" }}
                                />
                            </div>
                            <div style={{ width: 120 }}>
                                <label style={{ display: "block", marginBottom: 4 }}>Date</label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    style={{ width: "100%", padding: "8px 10px" }}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: 12 }}>
                            <label style={{ display: "block", marginBottom: 4 }}>Category</label>
                            <input
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder="e.g., Travel, Meals"
                                style={{ width: "100%", padding: "8px 10px" }}
                            />
                        </div>

                        <div style={{ display: "flex", gap: 8 }}>
                            <button type="submit" style={{ padding: "8px 12px" }}>
                                {editingId ? "Save" : "Add"}
                            </button>
                            <button
                                type="button"
                                onClick={clearForm}
                                style={{ padding: "8px 12px" }}
                                disabled={!editingId && !description && !amount && !category}
                            >
                                Clear
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setExpenses([]);
                                    clearForm();
                                }}
                                style={{ marginLeft: "auto", padding: "8px 12px" }}
                                title="Delete all expenses"
                            >
                                Reset All
                            </button>
                        </div>
                    </form>
                </aside>
            </section>
        </main>
    );
}