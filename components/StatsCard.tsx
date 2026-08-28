import {
  AlertCircle,
  Flame,
  CheckCircle2,
  Clock3,
  LucideIcon,
} from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  subtitle: string;
  type: "total" | "high" | "resolved" | "time";
}

const config = {
  total: {
    icon: AlertCircle,
    iconClass: "text-red-400",
    bgClass: "bg-red-500/10",
    borderClass: "border-red-500/20",
  },
  high: {
    icon: Flame,
    iconClass: "text-orange-400",
    bgClass: "bg-orange-500/10",
    borderClass: "border-orange-500/20",
  },
  resolved: {
    icon: CheckCircle2,
    iconClass: "text-emerald-400",
    bgClass: "bg-emerald-500/10",
    borderClass: "border-emerald-500/20",
  },
  time: {
    icon: Clock3,
    iconClass: "text-blue-400",
    bgClass: "bg-blue-500/10",
    borderClass: "border-blue-500/20",
  },
};

export default function StatsCard({
  title,
  value,
  subtitle,
  type,
}: StatsCardProps) {
  const item = config[type];

  const Icon: LucideIcon = item.icon;

  return (
    <div className="rounded-xl border border-slate-800 bg-[#0b1424]/80 p-5 transition hover:border-slate-700">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border ${item.borderClass} ${item.bgClass}`}
        >
          <Icon
            size={26}
            className={item.iconClass}
          />
        </div>

        <div>
          <p className="text-3xl font-bold text-white">
            {value}
          </p>

          <p className="mt-0.5 text-sm font-medium text-slate-300">
            {title}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}