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
  onClick,
  isOwner = false,
  canViewEmail = false,
}: MemberCardProps & { onClick?: (member: any) => void }) {
  const isLinked = member.isRegisteredUser;
  const memberIsOwner = member.member_role === "OWNER";
  console.log("memememe", member.member_date_joined);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      layout
      onClick={() => onClick?.(member)}
      className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:bg-slate-800/70 transition group cursor-pointer"
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${isLinked
            ? "bg-linear-to-br from-blue-500 to-cyan-400"
            : "bg-slate-600"
            }`}
        >
          {getInitials(member.member_member_name)}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-white font-semibold truncate">
              {member.member_member_name}
            </h4>
            {isLinked && (
              <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            {memberIsOwner && (
              <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full">
                Owner
              </span>
            )}
          </div>
          {canViewEmail && (
            <div className="flex items-center gap-1 text-slate-400 text-sm">
              <Mail className="w-3 h-3 shrink-0" />
              <span className="truncate">{member.member_member_email}</span>
            </div>
          )}
        </div>

        {/* Joined Date */}
        <div className="hidden sm:flex items-center gap-1 text-slate-500 text-xs shrink-0">
          <Calendar className="w-3 h-3" />
          <span>{formatMemberDate(member.member_date_joined)}</span>
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
                  onClick={() => onRemove(member.member_id)}
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
