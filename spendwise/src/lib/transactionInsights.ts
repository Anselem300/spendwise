/** Pure calculations shared by dashboard summaries and spending insights. */
export interface FinancialTransaction {
  type: "income" | "expense";
  category: string;
  amount: number;
}

export interface CategoryExpense {
  category: string;
  amount: number;
  percentage: number;
}

function toCents(amount: number): number {
  // Values are validated by the transaction API before being saved.
  // Guard here as well so malformed imported data cannot break the chart.
  return Number.isFinite(amount) && amount > 0
    ? Math.round(amount * 100)
    : 0;
}

export function getFinancialSummary(transactions: FinancialTransaction[]) {
  let incomeCents = 0;
  let expenseCents = 0;

  for (const transaction of transactions) {
    const cents = toCents(transaction.amount);
    if (transaction.type === "income") incomeCents += cents;
    if (transaction.type === "expense") expenseCents += cents;
  }

  return {
    totalIncome: incomeCents / 100,
    totalExpenses: expenseCents / 100,
    balance: (incomeCents - expenseCents) / 100,
  };
}

export function getExpenseBreakdown(
  transactions: FinancialTransaction[]
): CategoryExpense[] {
  const totals = new Map<string, number>();
  let totalExpenseCents = 0;

  for (const transaction of transactions) {
    if (transaction.type !== "expense") continue;

    const cents = toCents(transaction.amount);
    if (cents === 0) continue;

    const category = transaction.category.trim() || "Uncategorized";
    totals.set(category, (totals.get(category) ?? 0) + cents);
    totalExpenseCents += cents;
  }

  return Array.from(totals, ([category, amountCents]) => ({
    category,
    amount: amountCents / 100,
    percentage: (amountCents / totalExpenseCents) * 100,
  })).sort(
    (a, b) =>
      b.amount - a.amount || a.category.localeCompare(b.category)
  );
}
