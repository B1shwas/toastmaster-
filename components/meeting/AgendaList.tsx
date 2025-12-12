"use client";

import { memo } from "react";
import { Users } from "lucide-react";
import { AgendaRow } from "./AgendaRow";
import type { AgendaWithTiming } from "@/lib/hooks/useAgendaTiming";

interface AgendaListProps {
  agendas: AgendaWithTiming[];
  activeIndex: number;
  totalTime: number;
}

function EmptyAgendaState() {
  return (
    <div className="rounded-xl border-2 border-dashed border-slate-700 bg-slate-800/20 px-6 py-10 text-center">
      <Users className="mx-auto mb-3 h-8 w-8 text-slate-600" />
      <p className="text-slate-400">No agenda items yet</p>
      <p className="mt-1 text-sm text-slate-500">
        Add roles to build your meeting agenda
      </p>
    </div>
  );
}

function AgendaListComponent({
  agendas,
  activeIndex,
  totalTime,
}: AgendaListProps) {
  const hasAgendas = agendas.length > 0;

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Agenda</h2>
        {hasAgendas && (
          <span className="text-sm text-slate-400">Total: {totalTime} min</span>
        )}
      </div>

      {/* Content */}
      {!hasAgendas ? (
        <EmptyAgendaState />
      ) : (
        <div className="space-y-2">
          {agendas.map((agenda, index) => (
            <AgendaRow
              key={agenda.id}
              agenda={agenda}
              index={index}
              isActive={index === activeIndex}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export const AgendaList = memo(AgendaListComponent);
