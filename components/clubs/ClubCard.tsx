"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Calendar, Users, ArrowRight } from "lucide-react";
import type { Club } from "@/lib/types/club";
import { formatMeetingFrequency } from "@/lib/utils/club";

interface ClubCardProps {
  club: Club;
}

export function ClubCard({ club }: ClubCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="group bg-slate-800/50 border border-slate-700 rounded-xl p-3 hover:border-slate-600 hover:bg-slate-800/70 h-full"
    >
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">
            <Link href={`/club/${club.id}`} className="hover:underline">
              {club.name}
            </Link>
          </h3>
          <p className="text-slate-400 text-xs mb-2 line-clamp-2 sm:min-h-10">
            {club.description || "No description available"}
          </p>

          <div className="space-y-1 mb-3">
            {club.district && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <MapPin className="h-3 w-3" />
                <span>
                  {club.district}
                  {club.division && ` • ${club.division}`}
                  {club.area && ` • ${club.area}`}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Calendar className="h-3 w-3" />
              <span>{formatMeetingFrequency(club.meetingFrequency)}</span>
            </div>
          </div>
        </div>


      </div>
    </motion.div>
  );
}
