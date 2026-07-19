"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";
import type { ClubMember } from "@/lib/types/club";
import { useSearchToastmasters } from "@/lib/api/hooks/use-clubs";

export interface ToastmasterSuggestion {
  memberId: string | null;
  userId: string;
  memberName: string;
  toastmasterId: string | null;
  isClubMember: boolean;
}

interface ToastmasterAutocompleteProps {
  clubId: string;
  value: string;
  onChange: (toastmasterId: string, memberId: string, userId: string) => void;
  error?: boolean;
  focusColor?: "blue" | "emerald";
  placeholder?: string;
}

const getInputStyles = (
  error?: boolean,
  focusColor: "blue" | "emerald" = "blue"
) => {
  const focusRing =
    focusColor === "emerald" ? "focus:ring-emerald-500" : "focus:ring-blue-500";
  const borderColor = error ? "border-red-500" : "border-slate-700";
  return cn(
    "w-full px-4 py-3 bg-slate-800 border rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
    borderColor,
    focusRing
  );
};

function formatToastmasterId(id?: string | null) {
  return id ? id : "—";
}

export function ToastmasterAutocomplete({
  clubId,
  value,
  onChange,
  error,
  focusColor = "emerald",
  placeholder = "Search by Toastmasters ID",
}: ToastmasterAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query), 350);
    return () => clearTimeout(timer);
  }, [query]);

  const { data: suggestions = [], isFetching } = useSearchToastmasters(
    clubId,
    debounced
  );

  return (
    <div className="relative">
      <input
        type="text"
        className={getInputStyles(error, focusColor)}
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      />
      {open && (
        <ul className="absolute z-20 mt-1 w-full max-h-56 overflow-y-auto rounded-lg border border-slate-700 bg-slate-900 shadow-lg">
          {isFetching && (
            <li className="px-4 py-2 text-sm text-slate-400">Searching…</li>
          )}
          {!isFetching && suggestions.length === 0 && (
            <li className="px-4 py-2 text-sm text-slate-400">
              No matching Toastmasters found
            </li>
          )}
          {!isFetching &&
            suggestions.map((s) => (
              <li key={s.memberId}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-2 px-4 py-2 text-left text-sm text-slate-200 hover:bg-slate-700/60"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setQuery(
                      `${s.memberName} (${formatToastmasterId(s.toastmasterId)})`
                    );
                    setOpen(false);
                    onChange(s.toastmasterId ?? "", s.memberId ?? "", s.userId);
                  }}
                >
                  <span>{s.memberName}</span>
                  <span className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">
                      {formatToastmasterId(s.toastmasterId)}
                    </span>
                    {!s.isClubMember && (
                      <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-medium text-amber-300">
                        Add to club
                      </span>
                    )}
                  </span>
                </button>
              </li>
            ))}
        </ul>
      )}
      {value && (
        <p className="mt-1 text-xs text-emerald-400">
          Selected Toastmasters ID: {value}
        </p>
      )}
    </div>
  );
}
