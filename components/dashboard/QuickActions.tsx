import { motion } from "framer-motion";
import { Plus, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuickActionsProps {
  onJoinClick: () => void;
  onCreateClick: () => void;
}

export function QuickActions({
  onJoinClick,
  onCreateClick,
}: QuickActionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="mb-12"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Join Club Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onJoinClick}
          className="bg-linear-to-br from-blue-500/10 to-cyan-500/10 border-2 border-blue-500/30 rounded-2xl p-8 cursor-pointer hover:border-blue-500/50 transition-all group"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-500/20 rounded-xl group-hover:bg-blue-500/30 transition-colors">
              <Ticket className="h-8 w-8 text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">Join a Club</h3>
              <p className="text-slate-400 mb-4">
                Have a club code? Join an existing Toastmasters club and start
                your journey.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Enter Club Code
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Create Club Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCreateClick}
          className="bg-linear-to-br from-emerald-500/10 to-green-500/10 border-2 border-emerald-500/30 rounded-2xl p-8 cursor-pointer hover:border-emerald-500/50 transition-all group"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-500/20 rounded-xl group-hover:bg-emerald-500/30 transition-colors">
              <Plus className="h-8 w-8 text-emerald-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">
                Create a Club
              </h3>
              <p className="text-slate-400 mb-4">
                Start your own Toastmasters club and lead others on their
                speaking journey.
              </p>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Create New Club
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
