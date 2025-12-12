"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import type { MemberCardProps } from "@/lib/types/club";
import {
  formatMemberDate,
  getInitials,
  isLinkedMember,
} from "@/lib/utils/club";
import { UserCheck, Mail, Calendar, MoreVertical, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function MemberCardComponent({
  member,
  onRemove,
  onEdit,
  isOwner = false,
}: MemberCardProps) {
  const isLinked = isLinkedMember(member);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      layout
      className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:bg-slate-800/70 transition group"
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${
            isLinked
              ? "bg-linear-to-br from-blue-500 to-cyan-400"
              : "bg-slate-600"
          }`}
        >
          {getInitials(member.memberName)}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-white font-semibold truncate">
              {member.memberName}
            </h4>
            {isLinked && (
              <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            {isOwner && (
              <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full">
                Owner
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-slate-400 text-sm">
            <Mail className="w-3 h-3 shrink-0" />
            <span className="truncate">{member.memberEmail}</span>
          </div>
        </div>

        {/* Joined Date */}
        <div className="hidden sm:flex items-center gap-1 text-slate-500 text-xs shrink-0">
          <Calendar className="w-3 h-3" />
          <span>{formatMemberDate(member.dateJoined)}</span>
        </div>

        {/* Actions Dropdown */}
        {(onRemove || onEdit) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-slate-500 hover:text-white p-1 opacity-0 group-hover:opacity-100 transition focus:opacity-100">
                <MoreVertical className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-slate-800 border-slate-700"
            >
              {onRemove && (
                <DropdownMenuItem
                  onClick={() => onRemove(member.id)}
                  className="text-red-400 focus:text-red-400 focus:bg-red-500/10 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove Member
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </motion.div>
  );
}

// Memoize to prevent unnecessary re-renders
export const MemberCard = memo(MemberCardComponent);
