"use client";

import {
  Activity,
  Bell,
  Box,
  Database,
  Gauge,
  User,
  ShoppingCart,
  CreditCard,
  Clock3,
} from "lucide-react";

interface Incident {
  id: string;
  title: string;
  description?: string;
  severity: string;
  status: string;
  createdAt: string;
}

interface IncidentCardProps {
  incident: Incident;
  onClick: () => void;
}

function getIcon(title: string) {
  const value = title.toLowerCase();

  if (value.includes("payment")) {
    return CreditCard;
  }

  if (value.includes("redis")) {
    return Database;
  }

  if (value.includes("order")) {
    return ShoppingCart;
  }

  if (value.includes("inventory")) {
    return Box;
  }

  if (value.includes("authentication")) {
    return User;
  }

  if (value.includes("notification")) {
    return Bell;
  }

  if (value.includes("latency")) {
    return Gauge;
  }

  if (value.includes("delay")) {
    return Clock3;
  }

  return Activity;
}

function getSeverityStyle(severity: string) {
  switch (severity) {
    case "CRITICAL":
      return "bg-red-500/15 text-red-400 border-red-500/20";

    case "HIGH":
      return "bg-red-500/10 text-red-400 border-red-500/20";

    case "MEDIUM":
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";

    case "LOW":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";

    default:
      return "bg-slate-500/10 text-slate-400 border-slate-500/20";
  }
}

function getIconStyle(severity: string) {
  switch (severity) {
    case "HIGH":
    case "CRITICAL":
      return "border-red-500/60 bg-red-500/5 text-red-400";

    case "MEDIUM":
      return "border-yellow-500/60 bg-yellow-500/5 text-yellow-400";

    case "LOW":
      return "border-emerald-500/60 bg-emerald-500/5 text-emerald-400";

    default:
      return "border-violet-500/60 bg-violet-500/5 text-violet-400";
  }
}

export default function IncidentCard({
  incident,
  onClick,
}: IncidentCardProps) {
  const Icon = getIcon(incident.title);

  return (
    <button
      onClick={onClick}
      className="group relative w-full overflow-hidden rounded-xl border border-slate-800 bg-[#0b1424]/90 p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-violet-500/50 hover:shadow-[0_10px_40px_rgba(0,0,0,0.25)]"
    >
      <div className="flex gap-4">
        {/* Icon */}
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border ${getIconStyle(
            incident.severity
          )}`}
        >
          <Icon size={23} />
        </div>

        {/* Main */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <span className="text-xs font-semibold text-slate-400">
              {incident.id}
            </span>

            <span
              className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold ${getSeverityStyle(
                incident.severity
              )}`}
            >
              {incident.severity}
            </span>
          </div>

          <h3 className="mt-2 truncate text-[15px] font-semibold text-white">
            {incident.title}
          </h3>

          <p className="mt-2 line-clamp-2 min-h-[40px] text-xs leading-5 text-slate-400">
            {incident.description}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#22c55e]" />

          <span className="text-[11px] font-semibold text-slate-300">
            {incident.status}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <Clock3 size={13} />

          {incident.createdAt}
        </div>
      </div>
    </button>
  );
}