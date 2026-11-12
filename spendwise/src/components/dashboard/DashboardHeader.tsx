
import LogoutButton from "@/components/auth/LogoutButton";
import { Bell, UserCircle } from "lucide-react";

interface DashboardHeaderProps {
  name: string;
  email: string;
}

export default function DashboardHeader({
  name,
  email,
}: DashboardHeaderProps) {
  return (
    <header className="flex min-h-20 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Overview
        </h2>
        <p className="hidden text-xs text-slate-500 sm:block">
          Manage your money with confidence.
        </p>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <button
          type="button"
          aria-label="Notifications"
          title="Notifications coming soon"
          className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100"
        >
          <Bell size={20} />
        </button>

        <div className="hidden items-center gap-3 border-l border-slate-200 pl-5 sm:flex">
          <UserCircle size={34} className="text-blue-600" />

          <div>
            <p className="max-w-32 truncate text-sm font-semibold text-slate-800">
              {name}
            </p>
            <p className="max-w-40 truncate text-xs text-slate-500">
              {email}
            </p>
          </div>
        </div>

        <LogoutButton />
      </div>
    </header>
  );
}
