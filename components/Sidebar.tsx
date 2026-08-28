"use client";

import {
  LayoutDashboard,
  AlertCircle,
  Boxes,
  GitBranch,
  BarChart3,
  Settings,
  Network,
  ShieldCheck,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface SidebarProps {
  active?: string;
}

export default function Sidebar({
  active,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      name: "Incidents",
      icon: AlertCircle,
      path: "/incidents",
    },
    {
      name: "Services",
      icon: Boxes,
      path: "/services",
    },
    {
      name: "Dependencies",
      icon: GitBranch,
      path: "/dependencies",
    },
    {
      name: "Reports",
      icon: BarChart3,
      path: "/reports",
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[240px] flex-col border-r border-slate-800/80 bg-[#020b1a]">

      {/* Logo */}
      <div className="flex h-[72px] items-center gap-3 border-b border-slate-800/80 px-6">
        <div className="relative flex h-9 w-9 items-center justify-center">
          <Network
            size={34}
            strokeWidth={1.5}
            className="text-violet-400"
          />

          <div className="absolute h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_12px_#8b5cf6]" />
        </div>

        <h1 className="text-xl font-bold tracking-tight text-white">
          Incident
          <span className="text-violet-400">
            Graph
          </span>
        </h1>
      </div>

      {/* Description */}
      <div className="px-5 pt-8">
        <p className="text-sm leading-6 text-slate-400">
          Explore production incidents through
          connected system relationships.
        </p>
      </div>

      {/* Navigation */}
      <nav className="mt-8 space-y-1 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            active === item.name ||
            pathname === item.path ||
            pathname.startsWith(`${item.path}/`);

          return (
            <button
              key={item.name}
              onClick={() => router.push(item.path)}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${
                isActive
                  ? "bg-violet-600/30 text-white shadow-[inset_0_0_20px_rgba(139,92,246,0.08)]"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <Icon size={18} />

              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom info */}
      <div className="mt-auto px-4 pb-5">

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">

          <div className="mb-4 flex items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-violet-500/10">
              <ShieldCheck
                size={38}
                className="text-violet-400"
              />
            </div>
          </div>

          <p className="text-center text-xs leading-5 text-slate-400">
            IncidentGraph helps engineering teams
            resolve incidents faster with the power
            of relationships.
          </p>

        </div>

        <p className="mt-5 px-2 text-xs text-slate-600">
          v1.0.0
        </p>

      </div>

    </aside>
  );
}