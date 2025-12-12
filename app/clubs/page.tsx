"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Ticket, LogIn } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ClubCard, JoinClubModal, CreateClubModal } from "@/components/clubs";
import type { CreateClubInput } from "@/components/clubs/CreateClubModal";
import { SAMPLE_CLUBS } from "@/lib/constants/clubs";
import type { Club } from "@/lib/types/club";
import type { JoinClubInput } from "@/lib/schemas/club.schema";

const useAuth = () => {
  const [isLoggedIn] = useState(true);
  return { isLoggedIn };
};

// Animation variants
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

export default function ClubsPage() {
  const { isLoggedIn } = useAuth();
  const [clubs] = useState<Club[]>(SAMPLE_CLUBS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

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

  const handleJoinClub = async (data: JoinClubInput) => {
    setIsJoining(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Joining club with code:", data.clubCode);
      // In real app: call API to join club
    } finally {
      setIsJoining(false);
    }
  };

  const handleCreateClub = async (data: CreateClubInput) => {
    setIsCreating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Creating club:", data);
      // In real app: call API to create club, then redirect to new club page
    } finally {
      setIsCreating(false);
    }
  };

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

        {/* Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clubs by name, district, or location..."
              className="w-full h-12 pl-12 pr-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Action Buttons */}
          {isLoggedIn ? (
            <div className="flex gap-3 shrink-0">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => setIsJoinModalOpen(true)}
                  className="h-12 px-5 bg-slate-800 border border-slate-700 text-white hover:bg-slate-700 gap-2"
                >
                  <Ticket className="h-4 w-4" />
                  Join Club
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="h-12 px-5 bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create Club
                </Button>
              </motion.div>
            </div>
          ) : (
            <Link href="/auth" className="shrink-0">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button className="h-12 px-5 bg-blue-600 hover:bg-blue-700 text-white gap-2">
                  <LogIn className="h-4 w-4" />
                  Sign in to Join or Create
                </Button>
              </motion.div>
            </Link>
          )}
        </motion.div>

        {/* Info Banner for non-logged-in users */}
        {!isLoggedIn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-8"
          >
            <p className="text-blue-300 text-sm">
              <span className="font-medium">
                Want to join or create a club?
              </span>{" "}
              <Link href="/auth" className="underline hover:text-blue-200">
                Sign in
              </Link>{" "}
              to get started. You can still explore clubs and view their details
              without an account.
            </p>
          </motion.div>
        )}

        {/* Clubs Grid */}
        {filteredClubs.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredClubs.map((club, index) => (
              <motion.div key={club.id} variants={itemVariants} custom={index}>
                <ClubCard club={club} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <div className="text-slate-500 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">
              No clubs found
            </h3>
            <p className="text-slate-400">
              {searchQuery
                ? "Try adjusting your search terms"
                : "No clubs available at the moment"}
            </p>
          </motion.div>
        )}

        {/* Stats Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center text-slate-500 text-sm"
        >
          Showing {filteredClubs.length} of {clubs.length} clubs
        </motion.div>
      </div>

      {/* Modals */}
      <JoinClubModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onJoin={handleJoinClub}
        isLoading={isJoining}
      />
      <CreateClubModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateClub}
        isLoading={isCreating}
      />
    </div>
  );
}
