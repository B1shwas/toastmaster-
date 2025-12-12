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
      className="group bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-slate-600 hover:bg-slate-800/70 h-full"
    >
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
            {club.name}
          </h3>
          <p className="text-slate-400 text-sm mb-4 line-clamp-2">
            {club.description || "No description available"}
          </p>

          <div className="space-y-2 mb-4">
            {club.district && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <MapPin className="h-4 w-4" />
                <span>
                  {club.district}
                  {club.division && ` • ${club.division}`}
                  {club.area && ` • ${club.area}`}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Calendar className="h-4 w-4" />
              <span>{formatMeetingFrequency(club.meetingFrequency)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Users className="h-4 w-4" />
              <span>{club.members.length} members</span>
            </div>
          </div>
        </div>

        <Link
          href={`/club/${club.id}`}
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
        >
          View Details
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
