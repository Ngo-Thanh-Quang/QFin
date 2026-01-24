export async function addExpenses(idToken: string, payload: any) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/expenses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`CreateExpense failed: ${res.status} ${text}`);
  }
  return res.json();
}