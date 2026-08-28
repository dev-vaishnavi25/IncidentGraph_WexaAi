"use client";

import {
  Search,
  Sun,
} from "lucide-react";

export default function Topbar() {
  return (
    <header className="fixed left-[240px] right-0 top-0 z-30 h-[72px] border-b border-slate-800/80 bg-[#020817]/95 backdrop-blur">
      <div className="flex h-full items-center justify-between px-8">
        {/* Search */}
        <div className="relative w-full max-w-[440px]">
          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            placeholder="Search incidents..."
            className="h-10 w-full rounded-lg border border-slate-700 bg-slate-900/60 pl-11 pr-16 text-sm text-white outline-none placeholder:text-slate-500 focus:border-violet-500/70"
          />

          <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-slate-700 px-2 py-0.5 text-xs text-slate-500">
            ⌘K
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Connection */}
          <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#22c55e]" />

            <span className="text-sm font-medium text-emerald-400">
              CognoDB Connected
            </span>
          </div>

          {/* Theme */}
          <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 transition hover:text-white">
            <Sun size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}