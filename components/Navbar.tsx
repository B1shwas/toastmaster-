"use client";
import { easeInOut, motion } from "framer-motion";

function Navbar() {
  return (
    <div>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-lg border-b border-white/10 z-50 h-fit"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3"
          >
            <span className="text-2xl md:text-3xl font-bold bg-linear-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
              Toastmaster Manager
            </span>
          </motion.div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:block bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-2 rounded-lg text-white font-semibold hover:bg-white/20 transition"
            >
              Sign In
            </motion.button>
          </div>
        </div>
      </motion.nav>
    </div>
  );
}

export default Navbar;
