
"use client";

import { useEffect, useState, type FormEvent } from "react";
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

type DateRangeFilter =
  | "all"
  | "this-month"
  | "last-month"
  | "this-year";

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

  async function loadTransactions() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/transactions");
      const data: {
        transactions?: Transaction[];
        message?: string;
      } = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load transactions.");
      }

      setTransactions(data.transactions ?? []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading transactions."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
  let isMounted = true;

  const fetchTransactions = async () => {
    try {
      await loadTransactions();
    } finally {
      if (!isMounted) {
        return;
      }
    }
  };

  void fetchTransactions();

  return () => {
    isMounted = false;
  };
}, []);
  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const balance = totalIncome - totalExpenses;

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

const filteredTransactions = transactions.filter((transaction) => {
  const transactionDate = transaction.date.slice(0, 10);

  const matchesType =
    typeFilter === "all" || transaction.type === typeFilter;

  const matchesCategory =
    categoryFilter === "all" ||
    transaction.category === categoryFilter;

  let matchesDate = true;

  if (dateRangeFilter === "this-month") {
    matchesDate = transactionDate >= thisMonthStart &&
      transactionDate <= toDateKey(today);
  } else if (dateRangeFilter === "last-month") {
    matchesDate = transactionDate >= lastMonthStart &&
      transactionDate <= lastMonthEnd;
  } else if (dateRangeFilter === "this-year") {
    matchesDate = transactionDate >= thisYearStart &&
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
      {/* Financial Summary */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            Financial Summary
          </h2>

          <span className="text-xs text-slate-400">
            All-time overview
          </span>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <SummaryCard
            title="Total Income"
            amount={formatCurrency(totalIncome)}
            icon={ArrowDownCircle}
            color="green"
          />

          <SummaryCard
            title="Total Expenses"
            amount={formatCurrency(totalExpenses)}
            icon={ArrowUpCircle}
            color="red"
          />

          <SummaryCard
            title="Remaining Balance"
            amount={formatCurrency(balance)}
            icon={Wallet}
            color="blue"
          />
        </div>
      </section>

      {/* Transaction Form */}
      <section
        id="transaction-form"
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {editingId ? "Edit Transaction" : "Add Transaction"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Record your income and expenses.
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-500 transition hover:bg-slate-100"
            >
              <X size={16} />
              Cancel
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Transaction Type
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleTypeChange("income")}
                className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                  form.type === "income"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
              >
                <ArrowDownCircle size={19} />
                Income
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange("expense")}
                className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                  form.type === "expense"
                    ? "border-red-500 bg-red-50 text-red-700"
                    : "border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
              >
                <ArrowUpCircle size={19} />
                Expense
              </button>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="amount"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Amount (₦)
              </label>

              <input
                id="amount"
                type="number"
                min="0.01"
                step="0.01"
                required
                value={form.amount}
                onChange={(event) =>
                  setForm({ ...form, amount: event.target.value })
                }
                placeholder="Enter amount"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-black outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Category
              </label>

              <select
                id="category"
                required
                value={form.category}
                onChange={(event) =>
                  setForm({ ...form, category: event.target.value })
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
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Description
              </label>

              <input
                id="description"
                type="text"
                required
                minLength={2}
                maxLength={200}
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
                placeholder="What was this transaction for?"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-black outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="date"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Transaction Date
              </label>

              <input
                id="date"
                type="date"
                required
                value={form.date}
                onChange={(event) =>
                  setForm({ ...form, date: event.target.value })
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-black outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          {success && (
            <p
              role="status"
              className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700"
            >
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {saving ? (
              <RefreshCw size={17} className="animate-spin" />
            ) : (
              <Plus size={17} />
            )}

            {saving
              ? "Saving..."
              : editingId
                ? "Update Transaction"
                : "Save Transaction"}
          </button>
        </form>
      </section>

      {/* Transaction History */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">
              Transaction History
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Your recorded income and expenses
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadTransactions()}
            disabled={loading}
            aria-label="Refresh transactions"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 disabled:opacity-50"
          >
            <RefreshCw
              size={18}
              className={loading ? "animate-spin" : ""}
            />
          </button>
        </div>

        {/* Transaction Filters */}
<div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
  <div>
    <label
      htmlFor="type-filter"
      className="mb-2 block text-sm font-medium text-slate-700"
    >
      Transaction Type
    </label>

    <select
      id="type-filter"
      value={typeFilter}
      onChange={(event) =>
        setTypeFilter(event.target.value as TransactionTypeFilter)
      }
      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    >
      <option value="all">All Transactions</option>
      <option value="income">Income</option>
      <option value="expense">Expense</option>
    </select>
  </div>

  <div>
    <label
      htmlFor="category-filter"
      className="mb-2 block text-sm font-medium text-slate-700"
    >
      Category
    </label>

    <select
      id="category-filter"
      value={categoryFilter}
      onChange={(event) => setCategoryFilter(event.target.value)}
      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
      className="mb-2 block text-sm font-medium text-slate-700"
    >
      Date Range
    </label>

    <select
      id="date-filter"
      value={dateRangeFilter}
      onChange={(event) =>
        setDateRangeFilter(event.target.value as DateRangeFilter)
      }
      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    >
      <option value="all">All Time</option>
      <option value="this-month">This Month</option>
      <option value="last-month">Last Month</option>
      <option value="this-year">This Year</option>
    </select>
  </div>

  <div className="flex items-end">
    <button
      type="button"
      onClick={() => {
        setTypeFilter("all");
        setCategoryFilter("all");
        setDateRangeFilter("all");
      }}
      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
    >
      Reset Filters
    </button>
  </div>
</div>

        {loading ? (
          <div className="flex min-h-40 items-center justify-center">
            <p className="text-sm text-slate-500">
              Loading transactions...
            </p>
          </div>
        ) : filteredTransactions.length === 0 ? (
         <div className="flex min-h-40 flex-col items-center justify-center text-center">
           <h3 className="font-semibold text-slate-800">
             No matching transactions
           </h3>

           <p className="mt-2 text-sm text-slate-500">
             Try changing your filters to see more transactions.
           </p>
         </div>
      ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-3 py-3 font-medium">Description</th>
                  <th className="px-3 py-3 font-medium">Category</th>
                  <th className="px-3 py-3 font-medium">Date</th>
                  <th className="px-3 py-3 font-medium">Amount</th>
                  <th className="px-3 py-3 text-right font-medium">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b border-slate-50 last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`rounded-lg p-2 ${
                            transaction.type === "income"
                              ? "bg-green-50 text-green-600"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {transaction.type === "income" ? (
                            <ArrowDownCircle size={19} />
                          ) : (
                            <ArrowUpCircle size={19} />
                          )}
                        </div>

                        <div>
                          <p className="text-sm font-medium text-slate-800">
                            {transaction.description}
                          </p>

                          <p className="text-xs capitalize text-slate-400">
                            {transaction.type}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-3 py-4 text-sm text-slate-600">
                      {transaction.category}
                    </td>

                    <td className="px-3 py-4 text-sm text-slate-500">
                      {formatDate(transaction.date)}
                    </td>

                    <td
                      className={`px-3 py-4 text-sm font-semibold ${
                        transaction.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </td>

                    <td className="px-3 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(transaction)}
                          aria-label={`Edit ${transaction.description}`}
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Pencil size={16} />
                        </button>

                        {deleteId === transaction.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => void handleDelete(transaction.id)}
                              className="rounded-lg px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                            >
                              Confirm
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeleteId(null)}
                              className="rounded-lg px-2 py-1 text-xs text-slate-500 hover:bg-slate-100"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeleteId(transaction.id)}
                            aria-label={`Delete ${transaction.description}`}
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
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

interface SummaryCardProps {
  title: string;
  amount: string;
  icon: typeof Wallet;
  color: "green" | "red" | "blue";
}

function SummaryCard({
  title,
  amount,
  icon: Icon,
  color,
}: SummaryCardProps) {
  const styles = {
    green: {
      icon: "bg-green-50 text-green-600",
      amount: "text-green-700",
    },
    red: {
      icon: "bg-red-50 text-red-600",
      amount: "text-red-700",
    },
    blue: {
      icon: "bg-blue-50 text-blue-600",
      amount: "text-blue-700",
    },
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">
          {title}
        </p>

        <div className={`rounded-xl p-3 ${styles[color].icon}`}>
          <Icon size={21} />
        </div>
      </div>

      <h3 className={`mt-5 break-words text-2xl font-bold ${styles[color].amount}`}>
        {amount}
      </h3>

      <p className="mt-2 text-xs text-slate-400">
        Calculated from your transactions
      </p>
    </div>
  );
}
