
"use client";

import Link from "next/link";
import { useState } from "react";
import {
  LayoutDashboard,
  ChartNoAxesCombined,
  Wallet,
  Settings,
  CircleHelp,
  Menu,
  X,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
];

const upcomingFeatures = [
  { name: "Reports", icon: ChartNoAxesCombined },
  { name: "Budgets", icon: Wallet },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
        className="fixed left-4 top-5 z-50 rounded-lg border border-slate-200 bg-white p-2 text-slate-700 shadow-sm lg:hidden"
      >
        <Menu size={22} />
      </button>

      {/* Mobile backdrop */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:fixed lg:top-0 lg:z-30 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              <Wallet size={22} />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                SpendWise
              </h1>
              <p className="text-xs text-slate-500">
                Personal Finance
              </p>
            </div>
          </div>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation menu"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <X size={21} />
          </button>
        </div>

        {/* Navigation */}
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-8">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </p>

          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700"
                >
                  <Icon size={19} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <p className="mb-4 mt-9 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Coming Soon
          </p>

          <div className="space-y-2">
            {upcomingFeatures.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.name}
                  className="flex cursor-not-allowed items-center justify-between rounded-xl px-4 py-3 text-sm text-slate-400"
                  title="Planned for a future sprint"
                >
                  <span className="flex items-center gap-3">
                    <Icon size={19} />
                    {item.name}
                  </span>

                  <span className="text-[10px] font-medium">
                    SOON
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 p-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-500">
              <CircleHelp size={19} />
              Help &amp; Support
            </div>

            <div className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-500">
              <Settings size={19} />
              Settings
            </div>
          </div>

          <p className="mt-4 px-4 text-xs text-slate-400">
            SpendWise © 2026
          </p>
        </div>
      </aside>
    </>
  );
}
