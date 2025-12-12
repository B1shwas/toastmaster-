"use client";

import { useState, useMemo, useCallback } from "react";
import type { Club, ClubMember, AddMemberInput } from "@/lib/types/club";
import type { Meeting } from "@/lib/types/meeting";
import { SAMPLE_CLUB } from "@/lib/constants/club";
import { SAMPLE_MEETINGS } from "@/lib/constants/meeting";
import { calculateClubStats } from "@/lib/utils/club";
import {
  filterUpcomingMeetings,
  sortMeetingsByDate,
} from "@/lib/utils/meeting";
import {
  ClubInfoCard,
  ClubStatsGrid,
  MemberListSection,
  AddMemberModal,
} from "@/components/club";
import { MeetingListSection } from "@/components/meeting";

interface ClubPageProps {
  params: Promise<{ id: string }>;
}

export default function ClubPage({ params }: ClubPageProps) {
  // In real app, fetch club data using the id from params
  // const { id } = use(params);
  // const { data: club, isLoading } = useClub(id);

  const [club, setClub] = useState<Club>(SAMPLE_CLUB);
  const [meetings] = useState<Meeting[]>(SAMPLE_MEETINGS);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Memoized stats calculation
  const stats = useMemo(() => calculateClubStats(club.members), [club.members]);

  // Memoized upcoming meetings (sorted by date)
  const upcomingMeetings = useMemo(
    () => sortMeetingsByDate(filterUpcomingMeetings(meetings)),
    [meetings]
  );

  // Existing emails for duplicate validation
  const existingEmails = useMemo(
    () => club.members.map((m) => m.memberEmail),
    [club.members]
  );

  // Handlers
  const handleAddMember = useCallback(
    async (data: AddMemberInput) => {
      setIsAddingMember(true);

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        const newMember: ClubMember = {
          id: `m${Date.now()}`,
          userId: null,
          clubId: club.id,
          memberName: data.memberName,
          memberEmail: data.memberEmail,
          dateJoined: new Date().toISOString().split("T")[0],
        };

        setClub((prev) => ({
          ...prev,
          members: [...prev.members, newMember],
        }));
      } finally {
        setIsAddingMember(false);
      }
    },
    [club.id]
  );

  const handleRemoveMember = useCallback((memberId: string) => {
    // In real app, show confirmation dialog first
    setClub((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.id !== memberId),
    }));
  }, []);

  const handleSettingsClick = useCallback(() => {
    // Navigate to settings or open settings modal
    console.log("Settings clicked");
  }, []);

  const handleScheduleMeeting = useCallback(() => {
    // Navigate to meeting creation or open modal
    console.log("Schedule meeting clicked");
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 to-slate-900 pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Club Info Card */}
        <ClubInfoCard club={club} onSettingsClick={handleSettingsClick} />

        {/* Stats Grid */}
        <ClubStatsGrid stats={stats} />

        {/* Upcoming Meetings Section */}
        <MeetingListSection
          meetings={upcomingMeetings}
          clubId={club.id}
          maxDisplay={3}
          onScheduleMeeting={handleScheduleMeeting}
        />

        {/* Members Section */}
        <MemberListSection
          members={club.members}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddMember={() => setIsAddMemberOpen(true)}
          onRemoveMember={handleRemoveMember}
          ownerId={club.ownerId}
        />
      </div>

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        onSubmit={handleAddMember}
        isLoading={isAddingMember}
        existingEmails={existingEmails}
      />
    </div>
  );
}
