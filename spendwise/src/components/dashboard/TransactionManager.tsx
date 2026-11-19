
"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import ExpenseBreakdown from "@/components/dashboard/ExpenseBreakdown";
import { getFinancialSummary } from "@/lib/transactionInsights";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Wallet,
  Plus,
  Pencil,
  Trash2,
  X,
  RefreshCw,
} from "lucide-react";

type TransactionType = "income" | "expense";

type TransactionTypeFilter = "all" | TransactionType;

type DateRangeFilter = "all" | "this-month" | "last-month" | "this-year";

interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  date: string;
}

interface TransactionForm {
  type: TransactionType;
  amount: string;
  description: string;
  category: string;
  date: string;
}

const incomeCategories = [
  "Salary",
  "Freelance",
  "Business",
  "Investment",
  "Gift",
  "Other",
];

const expenseCategories = [
  "Food",
  "Transportation",
  "Housing",
  "Utilities",
  "Healthcare",
  "Education",
  "Entertainment",
  "Shopping",
  "Other",
];

function getLocalDate(): string {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function createEmptyForm(): TransactionForm {
  return {
    type: "expense",
    amount: "",
    description: "",
    category: "Food",
    date: getLocalDate(),
  };
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default function TransactionManager() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [form, setForm] = useState<TransactionForm>(createEmptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [typeFilter, setTypeFilter] =
    useState<TransactionTypeFilter>("all");

  const [categoryFilter, setCategoryFilter] = useState("all");

  const [dateRangeFilter, setDateRangeFilter] =
    useState<DateRangeFilter>("all");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const categories =
    form.type === "income" ? incomeCategories : expenseCategories;

  const loadTransactions = useCallback(async (signal?: AbortSignal) => {
    try {
      const response = await fetch("/api/transactions", {
        cache: "no-store",
        signal,
      });

      const data: {
        transactions?: Transaction[];
        message?: string;
      } = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load transactions.");
      }

      if (!signal?.aborted) {
        setTransactions(data.transactions ?? []);
        setError("");
      }
    } catch (err) {
      if (!signal?.aborted) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading transactions."
        );
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    void loadTransactions(controller.signal);

    return () => controller.abort();
  }, [loadTransactions]);

  // All-time financial summary.
  const { totalIncome, totalExpenses, balance } =
    getFinancialSummary(transactions);

  const today = new Date();

  const thisMonthStart = toDateKey(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const lastMonthStart = toDateKey(
    new Date(today.getFullYear(), today.getMonth() - 1, 1)
  );

  const lastMonthEnd = toDateKey(
    new Date(today.getFullYear(), today.getMonth(), 0)
  );

  const thisYearStart = `${today.getFullYear()}-01-01`;

  // Apply transaction filters.
  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = transaction.date.slice(0, 10);

    const matchesType =
      typeFilter === "all" || transaction.type === typeFilter;

    const matchesCategory =
      categoryFilter === "all" ||
      transaction.category === categoryFilter;

    let matchesDate = true;

    if (dateRangeFilter === "this-month") {
      matchesDate =
        transactionDate >= thisMonthStart &&
        transactionDate <= toDateKey(today);
    } else if (dateRangeFilter === "last-month") {
      matchesDate =
        transactionDate >= lastMonthStart &&
        transactionDate <= lastMonthEnd;
    } else if (dateRangeFilter === "this-year") {
      matchesDate =
        transactionDate >= thisYearStart &&
        transactionDate <= `${today.getFullYear()}-12-31`;
    }

    return matchesType && matchesCategory && matchesDate;
  });

  const availableCategories = [
    ...new Set(transactions.map((transaction) => transaction.category)),
  ];

  function handleTypeChange(type: TransactionType) {
    setForm((current) => ({
      ...current,
      type,
      category: type === "income" ? "Salary" : "Food",
    }));
  }

  function resetForm() {
    setForm(createEmptyForm());
    setEditingId(null);
  }

  function handleEdit(transaction: Transaction) {
    setEditingId(transaction.id);
    setDeleteId(null);
    setSuccess("");
    setError("");

    setForm({
      type: transaction.type,
      amount: String(transaction.amount),
      description: transaction.description,
      category: transaction.category,
      date: transaction.date.slice(0, 10),
    });

    document
      .getElementById("transaction-form")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        type: form.type,
        amount: Number(form.amount),
        description: form.description.trim(),
        category: form.category,
        date: form.date,
      };

      const url = editingId
        ? `/api/transactions/${editingId}`
        : "/api/transactions";

      const response = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data: { message?: string } = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save transaction.");
      }

      setSuccess(
        editingId
          ? "Transaction updated successfully."
          : "Transaction added successfully."
      );

      resetForm();
      await loadTransactions();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while saving."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });

      const data: { message?: string } = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete transaction.");
      }

      setTransactions((current) =>
        current.filter((transaction) => transaction.id !== id)
      );

      setDeleteId(null);
      setSuccess("Transaction deleted successfully.");

      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while deleting."
      );
    }
  }

  return (
    <div className="space-y-8">
      {/* Feedback Alerts */}
      {error && (
        <div
          role="alert"
          className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            className="text-red-500 hover:text-red-700"
            aria-label="Dismiss error"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {success && (
        <div
          role="status"
          className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
        >
          <span>{success}</span>

          <button
            type="button"
            onClick={() => setSuccess("")}
            className="text-emerald-500 hover:text-emerald-700"
            aria-label="Dismiss message"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <section
        aria-label="Financial summary"
        className="grid gap-4 sm:grid-cols-3"
      >
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-emerald-600">
              Total Income
            </span>

            <ArrowUpCircle className="h-5 w-5 text-emerald-600" />
          </div>

          <p className="mt-2 text-2xl font-bold text-emerald-600">
            {formatCurrency(totalIncome)}
          </p>

          <p className="mt-1 text-xs text-emerald-600">
            All recorded income
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-red-600">
              Total Expenses
            </span>

            <ArrowDownCircle className="h-5 w-5 text-red-600" />
          </div>

          <p className="mt-2 text-2xl font-bold text-red-600">
            {formatCurrency(totalExpenses)}
          </p>

          <p className="mt-1 text-xs text-red-600">
            All recorded expenses
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-600">
              Current Balance
            </span>

            <Wallet className="h-5 w-5 text-blue-600" />
          </div>

          <p
            className={`mt-2 text-2xl font-bold ${
              balance >= 0 ? "text-blue-600" : "text-red-600"
            }`}
          >
            {formatCurrency(balance)}
          </p>

          <p className="mt-1 text-xs text-blue-600">
            Income minus expenses
          </p>
        </div>
      </section>

      {/* Expense Breakdown */}
      <ExpenseBreakdown
        transactions={transactions}
        formatCurrency={formatCurrency}
        loading={loading}
      />

      {/* Transaction Form */}
      <section
        id="transaction-form"
        className="scroll-mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {editingId ? "Edit Transaction" : "Add New Transaction"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {editingId
                ? "Update the details of your transaction."
                : "Record your income and expenses."}
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <X size={16} />
              Cancel Editing
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Transaction Type */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Transaction Type
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleTypeChange("income")}
                className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                  form.type === "income"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <ArrowUpCircle size={18} />
                  Income
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange("expense")}
                className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                  form.type === "expense"
                    ? "border-red-500 bg-red-50 text-red-700"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <ArrowDownCircle size={18} />
                  Expense
                </span>
              </button>
            </div>
          </div>

          {/* Amount, Category and Date */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label
                htmlFor="transaction-amount"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Amount (₦)
              </label>

              <input
                id="transaction-amount"
                type="number"
                min="0.01"
                step="0.01"
                required
                value={form.amount}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    amount: event.target.value,
                  }))
                }
                placeholder="Enter amount"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-black outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="transaction-category"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Category
              </label>

              <select
                id="transaction-category"
                required
                value={form.category}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    category: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="transaction-date"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Date
              </label>

              <input
                id="transaction-date"
                type="date"
                required
                value={form.date}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    date: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-black outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="transaction-description"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Description
            </label>

            <input
              id="transaction-description"
              type="text"
              required
              maxLength={200}
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              placeholder="e.g. Monthly salary, groceries, transportation"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-black outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Submit */}
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <RefreshCw size={17} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  {editingId ? <Pencil size={17} /> : <Plus size={17} />}
                  {editingId ? "Update Transaction" : "Add Transaction"}
                </>
              )}
            </button>

            {!editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Clear Form
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Transaction History */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Transaction History
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View, filter, edit, and manage your transactions.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadTransactions()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label
              htmlFor="type-filter"
              className="mb-2 block text-xs font-medium text-slate-500"
            >
              Transaction Type
            </label>

            <select
              id="type-filter"
              value={typeFilter}
              onChange={(event) =>
                setTypeFilter(event.target.value as TransactionTypeFilter)
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expenses</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="category-filter"
              className="mb-2 block text-xs font-medium text-slate-500"
            >
              Category
            </label>

            <select
              id="category-filter"
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">All Categories</option>

              {availableCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="date-filter"
              className="mb-2 block text-xs font-medium text-slate-500"
            >
              Date Range
            </label>

            <select
              id="date-filter"
              value={dateRangeFilter}
              onChange={(event) =>
                setDateRangeFilter(event.target.value as DateRangeFilter)
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">All Time</option>
              <option value="this-month">This Month</option>
              <option value="last-month">Last Month</option>
              <option value="this-year">This Year</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-800">
              {filteredTransactions.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-800">
              {transactions.length}
            </span>{" "}
            transactions
          </p>

          {(typeFilter !== "all" ||
            categoryFilter !== "all" ||
            dateRangeFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setTypeFilter("all");
                setCategoryFilter("all");
                setDateRangeFilter("all");
              }}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div
            role="status"
            className="flex items-center justify-center gap-3 py-12 text-sm text-slate-500"
          >
            <RefreshCw size={18} className="animate-spin" />
            Loading transactions...
          </div>
        ) : filteredTransactions.length === 0 ? (
          /* Empty State */
          <div className="rounded-xl bg-slate-50 px-5 py-12 text-center">
            <Wallet className="mx-auto h-10 w-10 text-slate-300" />

            <h3 className="mt-4 font-semibold text-slate-700">
              {transactions.length === 0
                ? "No transactions yet"
                : "No matching transactions"}
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {transactions.length === 0
                ? "Add your first income or expense using the form above."
                : "Try changing your filters to see more transactions."}
            </p>
          </div>
        ) : (
          /* Transaction Table */
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-4 py-4">
                      <span className="font-medium text-slate-900">
                        {transaction.description}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-sm text-slate-600">
                      {transaction.category}
                    </td>

                    <td className="px-4 py-4 text-sm text-slate-600">
                      {formatDate(transaction.date.slice(0, 10))}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          transaction.type === "income"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {transaction.type === "income" ? "Income" : "Expense"}
                      </span>
                    </td>

                    <td
                      className={`px-4 py-4 text-right text-sm font-semibold ${
                        transaction.type === "income"
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </td>

                    <td className="px-4 py-4">
                      {deleteId === transaction.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs text-red-600">
                            Delete?
                          </span>

                          <button
                            type="button"
                            onClick={() => void handleDelete(transaction.id)}
                            className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700"
                          >
                            Confirm
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteId(null)}
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(transaction)}
                            aria-label={`Edit ${transaction.description}`}
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteId(transaction.id)}
                            aria-label={`Delete ${transaction.description}`}
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
