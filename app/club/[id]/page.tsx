"use client";

import { use, useState, useMemo } from "react";
import { motion } from "framer-motion";
import type { Meeting } from "@/lib/types/meeting";
import { SAMPLE_MEETINGS } from "@/lib/constants/meeting";
import {
  filterUpcomingMeetings,
  sortMeetingsByDate,
} from "@/lib/utils/meeting";
import {
  AddMemberModal,
  ClubInfoCard,
  ClubStatsGrid,
  MemberListSection,
} from "@/components/club";
import { MeetingListSection } from "@/components/meeting";
import {
  useClub,
  useClubMembers,
  useClubRole,
  useClubStats,
  useAddMember,
} from "@/lib/api";
import { useAuth } from "@/lib/hooks/useAuth";
import type { AddMemberInput } from "@/lib/schemas/club.schema";

const ANIMATION_CONFIG = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  },
} as const;

interface ClubPageProps {
  params: Promise<{ id: string }>;
}

export function LoadingState() {
  return (
    <div className="min-h-screen flex justify-center items-center text-white bg-linear-to-b from-slate-950 to-slate-900">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400">Loading...</p>
      </div>
    </div>
  );
}

export default function ClubPage({ params }: ClubPageProps) {
  const { id: clubId } = use(params);
  const { user } = useAuth();

  const { data: club, isLoading: isClubLoading } = useClub(clubId);
  const { data: clubStats, isLoading: isStatsLoading } = useClubStats(clubId);
  const { data: roleData, isLoading: isRoleLoading } = useClubRole(
    clubId,
    user?.id ?? ""
  );
  const { data: clubMembers } = useClubMembers(clubId);
  const addMemberMutation = useAddMember(clubId);

  const [meetings] = useState<Meeting[]>(SAMPLE_MEETINGS);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isLoading = isClubLoading || isStatsLoading || isRoleLoading;
  const role = roleData?.role;
  const canSeeCode = role === "OWNER" || role === "ADMIN";
  const canManageMembers = role === "OWNER" || role === "ADMIN";

  const existingEmails = useMemo(
    () => clubMembers?.map((m) => m.member_member_email) ?? [],
    [clubMembers]
  );

  const upcomingMeetings = useMemo(
    () => sortMeetingsByDate(filterUpcomingMeetings(meetings)),
    [meetings]
  );

  // Event handlers
  const handleSettingsClick = () => {
    console.log("Navigate to settings");
    // TODO: Implement settings navigation
  };

  const handleScheduleMeeting = () => {
    console.log("Open schedule meeting modal");
    // TODO: Implement meeting scheduling
  };

  const handleRemoveMember = () => {
    console.log("Remove member");
  };

  const handleAddMember = async (data: AddMemberInput) => {
    await addMemberMutation.mutateAsync(data);
    // Modal will close automatically after successful addition
  };

  // Loading state
  if (isLoading || !club || !clubStats) {
    return <LoadingState />;
  }

  console.log("Club Members:", clubMembers);

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 to-slate-900 pt-24 pb-12 px-4">
      <motion.div
        variants={ANIMATION_CONFIG.container}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Club Information */}
        <motion.div variants={ANIMATION_CONFIG.item}>
          <ClubInfoCard
            club={club}
            onSettingsClick={handleSettingsClick}
            totalMembers={clubStats.totalMembers}
            canSeeCode={canSeeCode}
          />
        </motion.div>

        {/* Statistics Grid */}
        <motion.div variants={ANIMATION_CONFIG.item}>
          <ClubStatsGrid stats={clubStats} />
        </motion.div>

        {/* Upcoming Meetings */}
        <motion.div variants={ANIMATION_CONFIG.item}>
          <MeetingListSection
            meetings={upcomingMeetings}
            clubId={club.id}
            maxDisplay={3}
            onScheduleMeeting={handleScheduleMeeting}
          />
        </motion.div>

        {/* Members Section */}
        <motion.div variants={ANIMATION_CONFIG.item}>
          <MemberListSection
            members={clubMembers ?? []}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onAddMember={() => setIsAddMemberOpen(true)}
            onRemoveMember={handleRemoveMember}
            ownerId={club.ownerId}
            canManageMembers={canManageMembers}
          />
        </motion.div>
      </motion.div>

      {/* Add Member Modal */}
      {canManageMembers && (
        <AddMemberModal
          isOpen={isAddMemberOpen}
          onClose={() => setIsAddMemberOpen(false)}
          onSubmit={handleAddMember}
          isLoading={addMemberMutation.isPending}
          existingEmails={existingEmails}
        />
      )}
    </div>
  );
}
