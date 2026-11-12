
import { redirect } from "next/navigation";
import {
  getCurrentUser,
} from "@/lib/auth";

import Sidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatCard from "@/components/dashboard/StatCard";

import {
  ArrowDownCircle,
  ArrowUpCircle,
  Wallet,
  Clock3,
  TrendingUp,
} from "lucide-react";

export const instant = false;

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <DashboardHeader
          name={user.name}
          email={user.email}
        />

        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
          {/* Welcome Section */}
          <section className="mb-8">
            <p className="text-sm font-medium text-blue-600">
              YOUR FINANCIAL SPACE
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Welcome back, {user.name.split(" ")[0]}!
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Here is an overview of your financial activities.
            </p>
          </section>

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
              <StatCard
                title="Total Income"
                amount="0.00"
                description="No income recorded yet"
                icon={ArrowDownCircle}
                color="green"
              />

              <StatCard
                title="Total Expenses"
                amount="0.00"
                description="No expenses recorded yet"
                icon={ArrowUpCircle}
                color="red"
              />

              <StatCard
                title="Remaining Balance"
                amount="0.00"
                description="Income minus expenses"
                icon={Wallet}
                color="blue"
              />
            </div>
          </section>

          {/* Activity and Spending Overview */}
          <section className="mt-9 grid gap-6 xl:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-slate-900">
                    Recent Transactions
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Your latest financial activities
                  </p>
                </div>

                <Clock3 size={20} className="text-slate-400" />
              </div>

              <div className="flex min-h-64 flex-col items-center justify-center text-center">
                <div className="rounded-full bg-blue-50 p-5">
                  <ArrowUpCircle
                    size={30}
                    className="text-blue-600"
                  />
                </div>

                <h3 className="mt-5 font-semibold text-slate-800">
                  No transactions yet
                </h3>

                <p className="mt-2 max-w-sm text-sm text-slate-500">
                  Your income and expenses will appear here
                  when transaction tracking becomes available.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <TrendingUp size={20} className="text-blue-600" />

                <h2 className="font-semibold text-slate-900">
                  Spending Overview
                </h2>
              </div>

              <div className="flex min-h-64 flex-col items-center justify-center text-center">
                <div className="rounded-full bg-purple-50 p-5">
                  <TrendingUp
                    size={30}
                    className="text-purple-600"
                  />
                </div>

                <h3 className="mt-5 font-semibold text-slate-800">
                  Insights coming soon
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Your spending patterns and category
                  breakdowns will be displayed here.
                </p>
              </div>
            </div>
          </section>

          {/* Sprint Information */}
          <section className="mt-8 rounded-2xl bg-blue-600 p-6 text-white sm:p-8">
            <h2 className="text-xl font-bold">
              Take control of your finances.
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">
              SpendWise helps you organize your financial
              activities and build better money management
              habits. Start by setting up your financial records
              as transaction tracking becomes available.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
