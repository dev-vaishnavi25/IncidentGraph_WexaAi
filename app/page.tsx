"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import StatsCard from "@/components/StatsCard";
import IncidentList from "@/components/IncidentList";

export default function Home() {
 const router = useRouter();

  const stats = useMemo(
    () => ({
      total: 11,
      high: 4,
      resolved: 9,
      avgTime: "2.3h",
    }),
    []
  );

  return (
    <div className="min-h-screen bg-[#020817] text-white">
      <Sidebar active="Dashboard" />

      <Topbar />

      <main className="ml-[240px] min-h-screen pt-[72px]">
        <div className="px-8 py-8">
          {/* Heading */}
          <div className="mb-7">
            <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">
              Operations
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">
              Production Incidents
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Investigate incidents by tracing affected services,
              APIs, databases, errors, root causes and resolutions.
            </p>
          </div>

          {/* Stats */}
          <div className="mb-7 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatsCard
              title="Total Incidents"
              value={String(stats.total)}
              subtitle="Last 30 days"
              type="total"
            />

            <StatsCard
              title="High Severity"
              value={String(stats.high)}
              subtitle="Requires attention"
              type="high"
            />

            <StatsCard
              title="Resolved"
              value={String(stats.resolved)}
              subtitle="Last 30 days"
              type="resolved"
            />

            <StatsCard
              title="Avg. Resolution Time"
              value={stats.avgTime}
              subtitle="Last 30 days"
              type="time"
            />
          </div>

          {/* Incidents */}
      <IncidentList
  onSelect={(id) => {
    router.push(`/incidents/${id}`);
  }}
/>
        </div>
      </main>
    </div>
  );
}