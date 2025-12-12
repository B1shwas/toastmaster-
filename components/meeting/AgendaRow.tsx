"use client";

import { memo } from "react";
import { Clock, Timer, User } from "lucide-react";
import type { AgendaWithTiming } from "@/lib/hooks/useAgendaTiming";

interface AgendaRowProps {
  agenda: AgendaWithTiming;
  index: number;
  isActive: boolean;
}

function LiveBadge() {
  return (
    <span className="flex items-center gap-1 text-xs font-medium text-emerald-400">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      LIVE
    </span>
  );
}

function AgendaRowComponent({ agenda, index, isActive }: AgendaRowProps) {
  const isAssigned = !!agenda.memberId;

  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-lg px-4 py-3 transition-colors ${
        isActive
          ? "border border-emerald-500/40 bg-emerald-500/20"
          : "bg-slate-800/40"
      }`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
            isActive
              ? "bg-emerald-500 text-white"
              : "bg-slate-700 text-slate-300"
          }`}
        >
          {index + 1}
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p
              className={`truncate font-medium ${
                isActive ? "text-emerald-400" : "text-white"
              }`}
            >
              {agenda.role}
            </p>
            {isActive && <LiveBadge />}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            {isAssigned ? (
              <>
                <User className="h-3.5 w-3.5" />
                <span>{agenda.memberName}</span>
              </>
            ) : (
              <span className="italic text-slate-500">Not assigned</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-0.5">
        <div
          className={`flex items-center gap-1.5 text-sm ${
            isActive ? "text-emerald-300" : "text-slate-300"
          }`}
        >
          <Clock className="h-3.5 w-3.5 text-slate-500" />
          <span>
            {agenda.startTime} - {agenda.endTime}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <Timer className="h-3 w-3" />
          <span>{agenda.allottedTime} min</span>
        </div>
      </div>
    </div>
  );
}

export const AgendaRow = memo(AgendaRowComponent);
