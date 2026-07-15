"use client";

import React from "react";
import type { ClubMember } from "@/lib/types/club";

interface AssignmentSelectorProps {
  register: any;
  watch: any;
  fieldName: string;
  members: ClubMember[];
}

export function AssignmentSelector({
  register,
  watch,
  fieldName,
  members,
}: AssignmentSelectorProps) {
  const assignmentType = watch(
    `${fieldName}.assignmentType` || "assignmentType"
  );

  return (
    <div className="space-y-3">
      {/* Radio: Member */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          value="member"
          {...register(
            fieldName ? `${fieldName}.assignmentType` : "assignmentType"
          )}
          className="w-4 h-4 text-cyan-500"
        />
        <span className="text-white text-sm">Club Member</span>
      </label>

      {assignmentType === "member" && (
        <select
          {...register(fieldName ? `${fieldName}.memberId` : "memberId")}
          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
        >
          <option value="">Select member</option>
          {members.map((member) => (
            <option key={member.member_id} value={member.member_id}>
              {member.memberName}
            </option>
          ))}
        </select>
      )}

      {/* Radio: Guest */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          value="guest"
          {...register(
            fieldName ? `${fieldName}.assignmentType` : "assignmentType"
          )}
          className="w-4 h-4 text-cyan-500"
        />
        <span className="text-white text-sm">Guest</span>
      </label>

      {assignmentType === "guest" && (
        <input
          type="text"
          {...register(fieldName ? `${fieldName}.memberName` : "memberName")}
          placeholder="Enter guest name"
          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
      )}
    </div>
  );
}

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FormField({
  label,
  error,
  required,
  children,
}: FormFieldProps) {
  return (
    <div>
      <label className="block text-white text-sm font-medium mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
}
