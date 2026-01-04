"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { ClubCard } from "@/components/clubs";
import type { Club } from "@/lib/types/club";
import { useClubs } from "@/lib/api";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
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

export default function ClubsPage() {
  const [page, setPage] = useState(1);
  const limit = 6;
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, isError, isFetching } = useClubs(page, limit);

  const clubs: Club[] = Array.isArray(data) ? data : [];

  const filteredClubs = clubs.filter((club) => {
    const query = searchQuery.toLowerCase();
    return (
      club.name.toLowerCase().includes(query) ||
      club.description?.toLowerCase().includes(query) ||
      club.district?.toLowerCase().includes(query) ||
      club.division?.toLowerCase().includes(query) ||
      club.area?.toLowerCase().includes(query)
    );
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading clubs...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        Failed to load clubs
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 to-slate-900 pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Explore Clubs
          </h1>
          <p className="text-slate-400">
            Discover Toastmasters clubs and start your public speaking journey
          </p>
        </motion.div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clubs by name, district, or location..."
            className="w-full h-12 pl-12 pr-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Grid */}
        {filteredClubs.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredClubs.map((club) => (
              <motion.div key={club.id} variants={itemVariants}>
                <ClubCard club={club} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16 text-slate-400">No clubs found</div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-12">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 rounded-lg bg-slate-700 text-white disabled:opacity-40"
          >
            Previous
          </button>

          <span className="text-slate-400">
            Page {page} {isFetching && "(Loading...)"}
          </span>

          <button
            disabled={clubs.length < limit}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded-lg bg-slate-700 text-white disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
