import { motion } from "framer-motion";
import { Users, Calendar } from "lucide-react";

interface WelcomeSectionProps {
  name: string;
  clubsCount: number;
  meetingsCount: number;
}

export function WelcomeSection({
  name,
  clubsCount,
  meetingsCount,
}: WelcomeSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
    >
      {/* Welcome Message */}
      <div className="bg-linear-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Welcome Back {name}!
        </h1>
        <p className="text-slate-300 text-lg">
          Ready to continue your Toastmasters journey?
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-linear-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-2xl p-6 flex flex-col items-center justify-center"
        >
          <Users className="h-8 w-8 text-emerald-400 mb-3" />
          <p className="text-slate-400 text-sm mb-1">Your Clubs</p>
          <p className="text-4xl font-bold text-white">{clubsCount}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-linear-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6 flex flex-col items-center justify-center"
        >
          <Calendar className="h-8 w-8 text-purple-400 mb-3" />
          <p className="text-slate-400 text-sm mb-1">Meetings</p>
          <p className="text-4xl font-bold text-white">{meetingsCount}</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
