
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

import Sidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import TransactionManager from "@/components/dashboard/TransactionManager";

async function DashboardContent() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="min-w-0 flex-1 lg:ml-64">
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

          {/* Transaction Management */}
          <TransactionManager />

          {/* Sprint Information */}
          <section className="mt-8 rounded-2xl bg-blue-600 p-6 text-white sm:p-8">
            <h2 className="text-xl font-bold">
              Take control of your finances.
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">
              SpendWise helps you organize your financial
              activities and build better money management
              habits. Track your income, manage expenses,
              and monitor your financial progress.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <p className="text-sm text-slate-500">
            Loading your dashboard...
          </p>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
