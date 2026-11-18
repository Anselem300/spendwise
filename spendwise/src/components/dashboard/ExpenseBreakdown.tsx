"use client";

import { ChartNoAxesCombined } from "lucide-react";
import {
  getExpenseBreakdown,
  type FinancialTransaction,
} from "@/lib/transactionInsights";

interface ExpenseBreakdownProps {
  transactions: FinancialTransaction[];
  formatCurrency: (amount: number) => string;
  loading: boolean;
}

/** Accessible horizontal bar chart without adding a charting dependency. */
export default function ExpenseBreakdown({
  transactions,
  formatCurrency,
  loading,
}: ExpenseBreakdownProps) {
  const breakdown = getExpenseBreakdown(transactions);
  const totalExpenses = breakdown.reduce((sum, item) => sum + item.amount, 0);

  return (
    <section
      aria-labelledby="expense-breakdown-title"
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2
            id="expense-breakdown-title"
            className="flex items-center gap-2 text-lg font-semibold text-slate-900"
          >
            <ChartNoAxesCombined size={21} aria-hidden="true" />
            Expenses by Category
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            See where your money goes across all recorded expenses.
          </p>
        </div>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          All-time overview
        </span>
      </div>

      {loading ? (
        <p role="status" className="py-7 text-center text-sm text-slate-500">
          Loading spending insights…
        </p>
      ) : breakdown.length === 0 ? (
        <div className="rounded-xl bg-slate-50 px-5 py-8 text-center">
          <p className="font-medium text-slate-700">No expenses recorded yet</p>
          <p className="mt-2 text-sm text-slate-500">
            Add an expense to see a category breakdown here.
          </p>
        </div>
      ) : (
        <>
          <p className="mb-5 text-sm text-slate-600">
            Total expenses: <strong className="text-slate-900">{formatCurrency(totalExpenses)}</strong>
          </p>
          <ul className="space-y-5">
            {breakdown.map(({ category, amount, percentage }) => (
              <li key={category}>
                <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2 text-sm">
                  <span className="font-medium text-slate-800">{category}</span>
                  <span className="text-slate-600">
                    {formatCurrency(amount)} · {percentage.toFixed(1)}%
                  </span>
                </div>
                <div
                  role="progressbar"
                  aria-label={`${category} share of total expenses`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Number(percentage.toFixed(1))}
                  className="h-3 overflow-hidden rounded-full bg-slate-100"
                >
                  <div
                    className="h-full rounded-full bg-blue-600 transition-[width] duration-300"
                    style={{ width: `${Math.min(100, percentage)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
