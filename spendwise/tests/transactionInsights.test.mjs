import test from "node:test";
import assert from "node:assert/strict";
import {
  getExpenseBreakdown,
  getFinancialSummary,
} from "../src/lib/transactionInsights.ts";

test("empty records return zero totals and no categories", () => {
  assert.deepEqual(getFinancialSummary([]), {
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
  });
  assert.deepEqual(getExpenseBreakdown([]), []);
});

test("income does not appear in expense breakdown", () => {
  const entries = [
    { type: "income", category: "Salary", amount: 200 },
    { type: "expense", category: "Food", amount: 40 },
    { type: "expense", category: "Transport", amount: 10 },
  ];
  assert.deepEqual(getFinancialSummary(entries), {
    totalIncome: 200,
    totalExpenses: 50,
    balance: 150,
  });
  assert.deepEqual(getExpenseBreakdown(entries), [
    { category: "Food", amount: 40, percentage: 80 },
    { category: "Transport", amount: 10, percentage: 20 },
  ]);
});

test("groups repeated categories and sorts largest spend first", () => {
  const entries = [
    { type: "expense", category: "Food", amount: 12.25 },
    { type: "expense", category: "Transport", amount: 20 },
    { type: "expense", category: "Food", amount: 7.75 },
  ];
  const breakdown = getExpenseBreakdown(entries);
  assert.equal(breakdown.length, 2);
  assert.deepEqual(breakdown.map(({category,amount}) => [category,amount]), [
    ["Food", 20], ["Transport", 20],
  ]);
  assert.equal(breakdown[0].percentage, 50);
  assert.equal(breakdown[1].percentage, 50);
});

test("handles cents without floating point drift", () => {
  const entries = [
    { type: "income", category: "Salary", amount: 1 },
    { type: "expense", category: "Food", amount: 0.1 },
    { type: "expense", category: "Food", amount: 0.2 },
  ];
  const summary = getFinancialSummary(entries);
  assert.equal(summary.totalExpenses, 0.3);
  assert.equal(summary.balance, 0.7);
  assert.equal(getExpenseBreakdown(entries)[0].amount, 0.3);
});

test("ignores non-finite or non-positive amounts in breakdown", () => {
  const entries = [
    { type: "expense", category: "Food", amount: Number.NaN },
    { type: "expense", category: "Food", amount: -10 },
    { type: "expense", category: "Education", amount: 15 },
    { type: "expense", category: "", amount: 5 },
  ];
  assert.deepEqual(getExpenseBreakdown(entries), [
    { category: "Education", amount: 15, percentage: 75 },
    { category: "Uncategorized", amount: 5, percentage: 25 },
  ]);
});
