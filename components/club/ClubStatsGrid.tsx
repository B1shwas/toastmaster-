"use client";

import { memo } from "react";
import type { ClubStats } from "@/lib/types/club";

interface StatsCardProps {
  value: number;
  label: string;
  colorClass?: string;
}

function StatsCardComponent({
  value,
  label,
  colorClass = "text-white",
}: StatsCardProps) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
      <div className={`text-4xl font-bold mb-2 ${colorClass}`}>{value}</div>
      <div className="text-slate-400">{label}</div>
    </div>
  );
}

const StatsCard = memo(StatsCardComponent);

interface ClubStatsGridProps {
  stats: ClubStats;
}

export function ClubStatsGrid({ stats }: ClubStatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        {
          value: stats.totalMembers,
          label: "Total Members",
          colorClass: "text-white",
        },
        {
          value: stats.registeredUsers,
          label: "Linked Accounts",
          colorClass: "text-emerald-400",
        },
        {
          value: stats.guestMembers,
          label: "Pending Invites",
          colorClass: "text-orange-400",
        },
      ].map((stat, index) => (
        <StatsCard
          key={index}
          value={stat.value}
          label={stat.label}
          colorClass={stat.colorClass}
        />
      ))}
    </div>
  );
}
