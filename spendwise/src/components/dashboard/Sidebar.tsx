
import Link from "next/link";
import {
  LayoutDashboard,
  ArrowLeftRight,
  ChartNoAxesCombined,
  Wallet,
  Settings,
  CircleHelp,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    active: true,
  },
];

const upcomingFeatures = [
  { name: "Transactions", icon: ArrowLeftRight },
  { name: "Reports", icon: ChartNoAxesCombined },
  { name: "Budgets", icon: Wallet },
];

export default function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
      <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-7">
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

      <div className="flex-1 px-4 py-8">
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

      <div className="border-t border-slate-100 p-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-500">
            <CircleHelp size={19} />
            Help & Support
          </div>

          <div className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-500">
            <Settings size={19} />
            Settings
          </div>
        </div>

        <p className="mt-5 px-4 text-xs text-slate-400">
          SpendWise © 2026
        </p>
      </div>
    </aside>
  );
}
