import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

export function UpcomingMeetingsSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="mt-12"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Upcoming Meetings</h2>
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-12 text-center">
        <Calendar className="h-16 w-16 text-slate-600 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-white mb-2">
          No Upcoming Meetings
        </h3>
        <p className="text-slate-400">
          Your upcoming meetings will appear here
        </p>
      </div>
    </motion.div>
  );
}
