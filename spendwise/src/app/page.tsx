
import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import {
  Wallet,
  ShieldCheck,
  ChartNoAxesCombined,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Receipt,
  Sparkles,
  ArrowUpRight,
  CircleDollarSign,
} from "lucide-react";

async function AuthRedirect() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return null;
}

export const instant = false;

export default function HomePage() {
  const chartBars = [35, 55, 42, 75, 48, 90, 65];

  return (
    <>
      <Suspense fallback={null}>
        <AuthRedirect />
      </Suspense>

      <main className="overflow-hidden bg-white text-slate-900">
      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(35px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes floatCard {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }

        @keyframes chartGrow {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }

        @keyframes glow {
          0%, 100% { opacity: .4; }
          50% { opacity: .8; }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-fade-up {
          animation: fadeUp .9s cubic-bezier(.2,.8,.2,1) both;
        }

        .animate-fade-up-delay {
          animation: fadeUp .9s .2s cubic-bezier(.2,.8,.2,1) both;
        }

        .animate-fade-up-late {
          animation: fadeUp .9s .4s cubic-bezier(.2,.8,.2,1) both;
        }

        .animate-float {
          animation: floatCard 6s ease-in-out infinite;
        }

        .animate-chart {
          transform-origin: bottom;
          animation: chartGrow 1.2s cubic-bezier(.2,.8,.2,1) both;
        }

        .animate-glow {
          animation: glow 4s ease-in-out infinite;
        }

        .feature-card {
          transition: transform .35s ease, box-shadow .35s ease,
            border-color .35s ease;
        }

        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 25px 60px -20px rgba(37,99,235,.2);
          border-color: rgba(59,130,246,.3);
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-fade-up,
          .animate-fade-up-delay,
          .animate-fade-up-late,
          .animate-float,
          .animate-chart,
          .animate-glow {
            animation: none !important;
          }

          .feature-card {
            transition: none;
          }
        }
      `}</style>

      {/* HERO SECTION */}
      <section className="relative isolate min-h-[780px] overflow-hidden bg-slate-950 text-white">

        {/* Background image */}
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/spendwise_hero_img.jpg')",
          }}
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-950/95 via-blue-950/75 to-slate-950/65" />

        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30" />

        {/* Decorative glow */}
        <div className="animate-glow absolute -right-40 top-32 -z-10 h-96 w-96 rounded-full bg-blue-500/20 blur-[120px]" />

        {/* Navigation */}
        <nav className="border-b border-white/10">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">

            <Link href="/" className="group flex items-center gap-3">
              <div className="rounded-xl bg-blue-600 p-3 shadow-lg shadow-blue-600/30 transition duration-300 group-hover:rotate-6 group-hover:scale-110">
                <Wallet size={24} />
              </div>

              <span className="text-2xl font-extrabold tracking-tight">
                Spend<span className="text-blue-400">Wise</span>
              </span>
            </Link>

            <div className="flex items-center gap-5 sm:gap-8">
              <Link
                href="/login"
                className="text-sm font-semibold text-white/80 transition hover:text-white"
              >
                Sign In
              </Link>

              <Link
                href="/register"
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition duration-300 hover:-translate-y-1 hover:bg-blue-500 hover:shadow-blue-500/40 sm:px-7"
              >
                Get Started
              </Link>
            </div>

          </div>
        </nav>

        {/* Hero content */}
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 py-20 lg:grid-cols-2 lg:px-10 lg:py-28">

          {/* Left content */}
          <div className="animate-fade-up">

            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-xs font-semibold tracking-wide text-blue-200 backdrop-blur-md">
              <Sparkles size={15} className="text-blue-400" />
              YOUR PERSONAL FINANCE COMPANION
            </div>

            <h1 className="mt-8 max-w-2xl text-5xl font-black leading-[1.12] tracking-tight sm:text-6xl lg:text-7xl">
              Make smarter

              <span className="mt-2 block bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                financial decisions.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
              Take control of your money with SpendWise.
              Organize your income, track your expenses,
              and understand your financial habits in one
              simple, powerful platform.
            </p>

            {/* Buttons */}
            <div className="mt-10 flex flex-wrap gap-4">

              <Link
                href="/register"
                className="group inline-flex items-center gap-3 rounded-xl bg-blue-600 px-7 py-4 font-bold text-white shadow-xl shadow-blue-600/30 transition duration-300 hover:-translate-y-1 hover:bg-blue-500"
              >
                Create Free Account

                <ArrowRight
                  size={20}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/login"
                className="rounded-xl border border-white/20 bg-white/10 px-7 py-4 font-bold text-white backdrop-blur-md transition duration-300 hover:bg-white/20"
              >
                Sign In
              </Link>

            </div>

            {/* Trust indicators */}
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 text-sm text-slate-300">

              <div className="flex items-center gap-2">
                <ShieldCheck size={19} className="text-emerald-400" />
                Secure accounts
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 size={19} className="text-emerald-400" />
                Simple management
              </div>

            </div>
          </div>

          {/* Dashboard preview */}
          <div className="animate-fade-up-delay relative mx-auto w-full max-w-lg lg:ml-auto">

            {/* Glow behind dashboard */}
            <div className="absolute inset-8 rounded-[40px] bg-blue-500/30 blur-[70px]" />

            <div className="animate-float relative rounded-3xl border border-white/60 bg-white/95 p-5 text-slate-900 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">

              {/* Dashboard header */}
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Financial Overview
                  </p>

                  <h2 className="mt-1 text-2xl font-extrabold tracking-tight">
                    Your Dashboard
                  </h2>
                </div>

                <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
                  <ChartNoAxesCombined size={28} />
                </div>

              </div>

              {/* Income and expenses */}
              <div className="mt-8 grid grid-cols-2 gap-4">

                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 sm:p-5">

                  <div className="flex items-center gap-2 text-emerald-700">
                    <TrendingUp size={17} />
                    <span className="text-xs font-semibold">
                      Total Income
                    </span>
                  </div>

                  <p className="mt-4 text-2xl font-black text-emerald-700 sm:text-3xl">
                    0.00
                  </p>

                  <p className="mt-1 text-xs text-emerald-600">
                    Income overview
                  </p>

                </div>

                <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 sm:p-5">

                  <div className="flex items-center gap-2 text-rose-700">
                    <Receipt size={17} />
                    <span className="text-xs font-semibold">
                      Expenses
                    </span>
                  </div>

                  <p className="mt-4 text-2xl font-black text-rose-700 sm:text-3xl">
                    0.00
                  </p>

                  <p className="mt-1 text-xs text-rose-600">
                    Spending overview
                  </p>

                </div>

              </div>

              {/* Activity chart */}
              <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-5">

                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-800">
                    Financial Activity
                  </h3>

                  <span className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                    This week
                  </span>
                </div>

                <div className="mt-7 flex h-36 items-end justify-between gap-3 border-b border-slate-100 pb-1">

                  {chartBars.map((height, index) => (
                    <div
                      key={index}
                      className="animate-chart w-full rounded-t-lg bg-gradient-to-t from-blue-600 to-cyan-400 transition-all duration-300 hover:brightness-110"
                      style={{
                        height: `${height}%`,
                        animationDelay: `${index * 100}ms`,
                      }}
                    />
                  ))}

                </div>

                <div className="mt-3 flex justify-between text-[11px] font-medium text-slate-400">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (day) => (
                      <span key={day}>{day}</span>
                    )
                  )}
                </div>

                <p className="mt-5 text-center text-xs text-slate-400">
                  Illustrative dashboard preview
                </p>

              </div>

              {/* Bottom indicator */}
              <div className="mt-5 flex items-center justify-between rounded-xl bg-blue-50 p-4">

                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-white p-2 text-blue-600">
                    <CircleDollarSign size={21} />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Financial clarity
                    </p>
                    <p className="text-xs text-slate-500">
                      Everything in one place
                    </p>
                  </div>
                </div>

                <CheckCircle2 size={21} className="text-blue-600" />

              </div>

            </div>
          </div>

        </div>

        {/* Bottom decorative transition */}
        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600" />

      </section>

      {/* FEATURES SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white px-6 py-24 lg:py-32">

        {/* Decorative circles */}
        <div className="absolute -left-32 top-32 h-72 w-72 rounded-full bg-blue-100/60 blur-[100px]" />
        <div className="absolute -right-32 bottom-10 h-72 w-72 rounded-full bg-cyan-100/60 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl">

          <div className="mx-auto max-w-3xl text-center">

            <span className="text-xs font-extrabold tracking-[.25em] text-blue-600">
              WHY SPENDWISE?
            </span>

            <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Everything starts with understanding{" "}
              <span className="text-blue-600">your money.</span>
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-slate-500">
              A smarter and simpler way to organize your
              personal finances, monitor spending, and
              build better financial habits.
            </p>

          </div>

          {/* Feature cards */}
          <div className="mt-16 grid gap-7 md:grid-cols-3">

            {/* Income */}
            <div className="feature-card group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

              <div className="inline-flex rounded-2xl bg-emerald-50 p-4 text-emerald-600 transition duration-300 group-hover:scale-110 group-hover:bg-emerald-100">
                <Wallet size={30} />
              </div>

              <h3 className="mt-7 text-xl font-extrabold text-slate-900">
                Income Tracking
              </h3>

              <p className="mt-4 text-sm leading-7 text-slate-500">
                Organize your income sources and monitor
                the money you receive. Keep your earnings
                visible and your finances organized.
              </p>

              <div className="mt-7 inline-flex rounded-full bg-emerald-50 p-3 text-emerald-600 transition duration-300 group-hover:translate-x-2">
                <ArrowUpRight size={21} />
              </div>

            </div>

            {/* Expenses */}
            <div className="feature-card group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

              <div className="inline-flex rounded-2xl bg-rose-50 p-4 text-rose-600 transition duration-300 group-hover:scale-110 group-hover:bg-rose-100">
                <Receipt size={30} />
              </div>

              <h3 className="mt-7 text-xl font-extrabold text-slate-900">
                Expense Management
              </h3>

              <p className="mt-4 text-sm leading-7 text-slate-500">
                Keep track of your spending, categorize
                expenses, and understand where your
                money goes.
              </p>

              <div className="mt-7 inline-flex rounded-full bg-rose-50 p-3 text-rose-600 transition duration-300 group-hover:translate-x-2">
                <ArrowUpRight size={21} />
              </div>

            </div>

            {/* Overview */}
            <div className="feature-card group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

              <div className="inline-flex rounded-2xl bg-blue-50 p-4 text-blue-600 transition duration-300 group-hover:scale-110 group-hover:bg-blue-100">
                <ChartNoAxesCombined size={30} />
              </div>

              <h3 className="mt-7 text-xl font-extrabold text-slate-900">
                Financial Overview
              </h3>

              <p className="mt-4 text-sm leading-7 text-slate-500">
                View your financial information in one
                straightforward dashboard and gain a
                clearer picture of your money.
              </p>

              <div className="mt-7 inline-flex rounded-full bg-blue-50 p-3 text-blue-600 transition duration-300 group-hover:translate-x-2">
                <ArrowUpRight size={21} />
              </div>

            </div>

          </div>

          {/* CTA banner */}
          <div className="relative mt-20 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 px-8 py-12 text-white shadow-2xl shadow-blue-200 sm:px-12 lg:flex lg:items-center lg:justify-between">

            <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full border-[35px] border-white/10" />
            <div className="absolute -bottom-40 right-1/3 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />

            <div className="relative max-w-xl">

              <div className="flex items-center gap-2 text-sm font-bold text-blue-200">
                <Sparkles size={18} />
                YOUR FINANCIAL JOURNEY STARTS HERE
              </div>

              <h2 className="mt-5 text-3xl font-black leading-tight sm:text-4xl">
                Ready to take control of your financial future?
              </h2>

              <p className="mt-4 leading-7 text-blue-100">
                Start organizing your finances and make
                more informed decisions with SpendWise.
              </p>

            </div>

            <div className="relative mt-8 lg:mt-0">

              <Link
                href="/register"
                className="group inline-flex items-center gap-3 rounded-xl bg-white px-7 py-4 font-bold text-blue-700 shadow-xl transition duration-300 hover:-translate-y-1 hover:bg-blue-50"
              >
                Get Started — It&apos;s Free

                <ArrowRight
                  size={20}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 px-6 py-14 text-white">

        <div className="mx-auto max-w-7xl">

          <div className="grid gap-12 border-b border-white/10 pb-12 sm:grid-cols-2 lg:grid-cols-4">

            {/* Branding */}
            <div>

              <Link href="/" className="inline-flex items-center gap-3">
                <div className="rounded-xl bg-blue-600 p-3">
                  <Wallet size={23} />
                </div>

                <span className="text-2xl font-extrabold">
                  Spend<span className="text-blue-400">Wise</span>
                </span>
              </Link>

              <p className="mt-5 max-w-xs text-sm leading-7 text-slate-400">
                Personal finance made simpler.
                Make smarter decisions and take control
                of your financial future.
              </p>

            </div>

            {/* Product links */}
            <div>
              <h3 className="font-bold">Product</h3>

              <div className="mt-5 flex flex-col gap-4 text-sm text-slate-400">
                <Link href="/register" className="transition hover:text-white">Get Started</Link>
                <Link href="/login" className="transition hover:text-white">Sign In</Link>
                <Link href="/register" className="transition hover:text-white">Create Account</Link>
              </div>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-bold">About</h3>

              <div className="mt-5 flex flex-col gap-4 text-sm text-slate-400">
                <a href="#features" className="transition hover:text-white">Features</a>
                <a href="#features" className="transition hover:text-white">Our Platform</a>
                <Link href="/register" className="transition hover:text-white">Join SpendWise</Link>
              </div>
            </div>

            {/* Security */}
            <div>
              <h3 className="font-bold">Your Finances</h3>

              <div className="mt-5 flex flex-col gap-4 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={17} className="text-emerald-400" />
                  Secure accounts
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 size={17} className="text-emerald-400" />
                  Organized finances
                </div>
              </div>
            </div>

          </div>

          {/* Copyright */}
          <div className="flex flex-col justify-between gap-4 pt-8 text-sm text-slate-500 sm:flex-row sm:items-center">

            <p>
  © 2026 SpendWise. All rights reserved.
</p>

            <p>
              Built to make personal finance simpler.
            </p>

          </div>

        </div>

      </footer>

         </main>
    </>
  );
}