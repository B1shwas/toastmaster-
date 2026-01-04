import { motion } from "framer-motion";
import { Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ClubCard } from "@/components/clubs";
import type { Club } from "@/lib/types/club";

interface YourClubsSectionProps {
  clubs: Club[];
  onJoinClick: () => void;
  onCreateClick: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function YourClubsSection({
  clubs,
  onJoinClick,
  onCreateClick,
}: YourClubsSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Your Clubs</h2>
        <Link href="/clubs">
          <Button
            variant="ghost"
            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
          >
            View All Clubs →
          </Button>
        </Link>
      </div>

      {Array.isArray(clubs) && clubs.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {clubs.map((club) => (
            <motion.div key={club.id} variants={itemVariants}>
              <ClubCard club={club} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-12 text-center">
          <Users className="h-16 w-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">
            {!Array.isArray(clubs) ? "Failed to Load Clubs" : "No Clubs Yet"}
          </h3>
          <p className="text-slate-400 mb-6">
            {!Array.isArray(clubs)
              ? "There was an error fetching your clubs. Please try again later."
              : "Join or create your first club to get started"}
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={onJoinClick}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Join Club
            </Button>
            <Button
              onClick={onCreateClick}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Create Club
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
