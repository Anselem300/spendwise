
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  amount: string;
  description: string;
  icon: LucideIcon;
  color: "green" | "red" | "blue";
}

const colorStyles = {
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

export default function StatCard({
  title,
  amount,
  description,
  icon: Icon,
  color,
}: StatCardProps) {
  const styles = colorStyles[color];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">
          {title}
        </p>

        <div className={`rounded-xl p-3 ${styles.icon}`}>
          <Icon size={21} />
        </div>
      </div>

      <h3 className={`mt-5 text-3xl font-bold ${styles.amount}`}>
        {amount}
      </h3>

      <p className="mt-2 text-xs text-slate-400">
        {description}
      </p>
    </div>
  );
}
