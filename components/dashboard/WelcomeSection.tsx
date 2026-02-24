import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatMeetingFrequency } from "@/lib/utils/club";
import type { Club } from "@/lib/types/club";

interface WelcomeSectionProps {
  name: string;
  meetingsCount: number;
  clubs?: Club[];
}

export function WelcomeSection({ name, meetingsCount, clubs = [] }: WelcomeSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-center">
        {/* Welcome Message */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="md:col-span-2 bg-linear-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg px-4 py-3 flex flex-col justify-center h-36"
        >
          <h1 className="text-lg md:text-xl font-bold text-white mb-1">Welcome Back {name}!</h1>
          <p className="text-slate-300 text-sm">Ready to continue your Toastmasters journey?</p>
        </motion.div>

        {/* Meetings Card */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="md:col-span-2 bg-linear-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg px-4 py-3 flex flex-col items-center justify-center h-36"
        >
          <Calendar className="h-8 w-8 text-purple-400 mb-2" />
          <p className="text-slate-400 text-sm mb-1">Meetings</p>
        </motion.div>

        {/* Clubs Card */}
        {clubs.length > 0 && (
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="md:col-span-2 bg-linear-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-lg p-3 h-36 flex flex-col"
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-slate-300">Your Clubs</h3>
              <Link href="/clubs">
                <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 h-auto px-2 py-1 text-xs">
                  View All →
                </Button>
              </Link>
            </div>

            <div className="flex flex-col flex-1 overflow-hidden">
              {clubs.slice(0, 1).map((club) => (
                <div key={club.id} className="relative bg-slate-800/60 border border-emerald-500/20 rounded-lg p-2.5 flex-1 grid grid-cols-2 gap-3 overflow-hidden">
                  {/* Subtle accent glow */}
                  <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/60 rounded-l-lg" />

                  {/* Left column: name + description */}
                  <div className="flex flex-col justify-between min-w-0 pl-1">
                    <div>
                      <p className="text-sm font-bold text-white leading-tight truncate">{club.name}</p>
                      <p className="text-slate-400 text-xs leading-tight line-clamp-2 mt-1">
                        {club.description || "No description available"}
                      </p>
                    </div>
                  </div>

                  {/* Right column: meta + View Details */}
                  <div className="flex flex-col justify-between min-w-0">
                    <div className="space-y-1">
                      {club.district && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <MapPin className="h-3 w-3 shrink-0 text-emerald-400" />
                          <span className="truncate">
                            {club.district}
                            {club.division && ` • ${club.division}`}
                            {club.area && ` • ${club.area}`}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Calendar className="h-3 w-3 shrink-0 text-emerald-400" />
                        <span>{formatMeetingFrequency(club.meetingFrequency)}</span>
                      </div>
                    </div>
                    <Link
                      href={`/club/${club.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors group/link"
                    >
                      View Details
                      <ArrowRight className="h-3 w-3 group-hover/link:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
    
  );
}