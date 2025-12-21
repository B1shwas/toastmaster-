"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, PlusCircle, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MeetingCard } from "@/components/meeting";
import { BackLink } from "@/components/ui/page-layout";
import { MeetingStatus, type Meeting } from "@/lib/types/meeting";
import { useMeetings } from "@/lib/api/hooks/use-meetings";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

type FilterStatus = "ALL" | MeetingStatus;

const STATUS_FILTERS: { value: FilterStatus; label: string }[] = [
  { value: "ALL", label: "All Meetings" },
  { value: MeetingStatus.SCHEDULED, label: "Scheduled" },
  { value: MeetingStatus.IN_PROGRESS, label: "In Progress" },
  { value: MeetingStatus.COMPLETED, label: "Completed" },
  { value: MeetingStatus.CANCELLED, label: "Cancelled" },
];

function EmptyState({ onScheduleMeeting }: { onScheduleMeeting?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-700 bg-slate-800/30 px-6 py-16 text-center"
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800">
        <Calendar className="h-8 w-8 text-slate-500" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-white">
        No meetings found
      </h3>
      <p className="mb-6 max-w-sm text-sm text-slate-400">
        No meetings match your current filters. Try adjusting your search or
        schedule a new meeting.
      </p>
      {onScheduleMeeting && (
        <Button
          onClick={onScheduleMeeting}
          className="gap-2 bg-linear-to-br from-blue-500 to-cyan-400"
        >
          <PlusCircle className="h-4 w-4" />
          Schedule Meeting
        </Button>
      )}
    </motion.div>
  );
}

export default function MeetingsPage() {
  const params = useParams<{ id: string }>();
  const clubId = params.id;

  const { data: meetings, isLoading } = useMeetings(
    clubId,
    undefined,
    undefined,
    undefined,
    1,
    10
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("ALL");

  const filteredMeetings = useMemo(() => {
    if (!meetings) return [];
    return meetings
      .filter((meeting) => {
        // Filter by status
        if (statusFilter !== "ALL" && meeting.status !== statusFilter) {
          return false;
        }

        // Filter by search query
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            meeting.theme?.toLowerCase().includes(query) ||
            meeting.venue?.toLowerCase().includes(query) ||
            meeting.meetingNo.toString().includes(query)
          );
        }

        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [meetings, searchQuery, statusFilter]);

  const handleScheduleMeeting = () => {
    console.log("Schedule meeting clicked");
    // Navigate to meeting creation or open modal
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 to-slate-900 pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <BackLink href={`/club/${clubId}`} label="Back to Club" />

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">All Meetings</h1>
              <p className="text-slate-400 mt-1">
                {isLoading
                  ? "Loading..."
                  : `${meetings?.length ?? 0} total meeting${
                      (meetings?.length ?? 0) !== 1 ? "s" : ""
                    }`}
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleScheduleMeeting}
                className="gap-2 bg-linear-to-br from-blue-500 to-cyan-400"
              >
                <PlusCircle className="h-4 w-4" />
                Schedule Meeting
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by theme, venue, or meeting number..."
              className="w-full h-12 pl-12 pr-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="relative shrink-0">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
              className="h-12 pl-12 pr-8 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
            >
              {STATUS_FILTERS.map((filter) => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Meetings Grid */}
        {filteredMeetings.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredMeetings.map((meeting) => (
              <motion.div key={meeting.id} variants={itemVariants}>
                <MeetingCard meeting={meeting} clubId={clubId} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <EmptyState onScheduleMeeting={handleScheduleMeeting} />
        )}

        {filteredMeetings.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-center text-slate-500 text-sm"
          >
            Showing {filteredMeetings.length} of {meetings!.length} meetings
          </motion.div>
        )}
      </div>
    </div>
  );
}
