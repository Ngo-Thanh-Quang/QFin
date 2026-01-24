export async function deleteExpense(idToken: string, expenseId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/expenses/${expenseId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`DeleteExpense failed: ${res.status} ${text}`);
  }

  return res.json();
}
