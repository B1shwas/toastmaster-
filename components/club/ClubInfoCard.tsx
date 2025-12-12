"use client";

import { motion } from "framer-motion";
import { Settings, MapPin, Hash, Calendar, Users } from "lucide-react";
import type { Club } from "@/lib/types/club";
import { formatMeetingFrequency } from "@/lib/utils/club";
import { ClubCodeBadge } from "./ClubCodeBadge";

interface ClubInfoCardProps {
  club: Club;
  onSettingsClick?: () => void;
}

export function ClubInfoCard({ club, onSettingsClick }: ClubInfoCardProps) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold text-white mb-2 truncate">
            {club.name}
          </h1>
          {club.description && (
            <p className="text-slate-400 max-w-2xl line-clamp-2">
              {club.description}
            </p>
          )}
        </div>
        {onSettingsClick && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSettingsClick}
            className="p-2 bg-slate-700 rounded-lg text-slate-300 hover:text-white hover:bg-slate-600 transition shrink-0 ml-4"
            aria-label="Club settings"
          >
            <Settings className="w-5 h-5" />
          </motion.button>
        )}
      </div>

      {/* Club Details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="flex items-center gap-2 text-slate-400">
          <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-sm truncate">
            {club.district || "No District"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <Hash className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-sm truncate">
            {club.area || "No Area"} / {club.division || "No Division"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <Calendar className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-sm">
            {formatMeetingFrequency(club.meetingFrequency)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <Users className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-sm">{club.members.length} Members</span>
        </div>
      </div>

      {/* Club Code */}
      <div className="mt-6">
        <ClubCodeBadge code={club.clubCode} />
      </div>
    </div>
  );
}
