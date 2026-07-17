"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils/cn";
import type { ClubMember } from "@/lib/types/club";

interface ToastmasterAutocompleteProps {
  members: ClubMember[];
  value: string;
  onChange: (toastmasterId: string, memberId: string) => void;
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
  members,
  value,
  onChange,
  error,
  focusColor = "emerald",
  placeholder = "Search by Toastmasters ID or name",
}: ToastmasterAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter((member) => {
      const tmId = (member.member_toastmaster_id ?? "").toLowerCase();
      const name = (member.memberName ?? "").toLowerCase();
      return tmId.includes(q) || name.includes(q);
    });
  }, [members, query]);

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
      {open && suggestions.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full max-h-56 overflow-y-auto rounded-lg border border-slate-700 bg-slate-900 shadow-lg">
          {suggestions.map((member) => (
            <li key={member.member_id}>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-2 px-4 py-2 text-left text-sm text-slate-200 hover:bg-slate-700/60"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setQuery(
                    `${member.memberName} (${formatToastmasterId(
                      member.member_toastmaster_id
                    )})`
                  );
                  setOpen(false);
                  onChange(
                    member.member_toastmaster_id ?? "",
                    member.userId ?? ""
                  );
                }}
              >
                <span>{member.memberName}</span>
                <span className="text-xs text-slate-400">
                  {formatToastmasterId(member.member_toastmaster_id)}
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
