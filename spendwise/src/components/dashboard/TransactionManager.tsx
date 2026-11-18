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
      // An aborted request is an expected cleanup, not a user-visible error.
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

  // Keep the all-time financial cards and category chart in sync.
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
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
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
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
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
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">
              Total Income
            </span>
            <ArrowUpCircle className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {formatCurrency(totalIncome)}
          </p>
        </div> 