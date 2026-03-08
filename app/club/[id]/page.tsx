"use client";

import { use, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MeetingStatus, type Meeting } from "@/lib/types/meeting";
import { getErrorMessage } from "@/lib/api";

import {
  AddMemberModal,
  ClubInfoCard,
  ClubSettingsModal,
  MemberListSection,
  MemberRoleReportModal,
} from "@/components/club";
import { MeetingListSection, ScheduleMeetingModal } from "@/components/meeting";
import {
  useClub,
  useClubMembers,
  useClubRole,
  useClubStats,
  useAddMember,
} from "@/lib/api";
import { useCreateMeeting, useMeetings } from "@/lib/api/hooks/use-meetings";
import type { CreateMeetingInput } from "@/lib/api/hooks/use-meetings";
import { useAuth } from "@/lib/hooks/useAuth";
import type { AddMemberInput, ClubSettingsInput, JoinClubInput } from "@/lib/schemas/club.schema";
import { useRouter } from "next/navigation";
import { JoinClubModal } from "@/components/clubs/JoinClubModal";
import { useClubPendingMembers, useJoinClub, usePendingRequestDecision, useRemoveMember, useRequestJoinClub, useUpdateClub, useUserClubStatus } from "@/lib/api/hooks/use-clubs";
import { useToast } from "@/hooks/use-toast";
import { ListAllAgendas } from "@/components/agendaReport/ListAllAgendas";

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
  const {
    data: club,
    isLoading: isClubLoading,
    isError: isClubError,
  } = useClub(clubId);
  const { data: clubStats, isLoading: isStatsLoading } = useClubStats(clubId);
  const { data: roleData, isLoading: isRoleLoading } = useClubRole(
    clubId,
    user?.id ?? "",
  );
  const { data: clubMembers } = useClubMembers(clubId);
  const { data: meetings } = useMeetings(
    clubId,
    MeetingStatus.SCHEDULED,
    undefined,
    undefined,
    1,
    3,
  );
  const addMemberMutation = useAddMember(clubId);
  const removeMemberMutation = useRemoveMember(clubId);
  const updateClubMutation = useUpdateClub(clubId);
  const requestJoinClubMutation = useRequestJoinClub();
  const pendingDecisionMutation = usePendingRequestDecision();
  const createMeetingMutation = useCreateMeeting();

  const router = useRouter();
  const { toast } = useToast();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isScheduleMeetingOpen, setIsScheduleMeetingOpen] = useState(false);
  const [selectedMemberForReport, setSelectedMemberForReport] = useState<
    any | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");

  const isLoading = isClubLoading || isStatsLoading || isRoleLoading;
  const role = roleData?.role;
  const isMember = roleData?.role !== null;
  const canSeeCode = role === "OWNER" || role === "ADMIN";
  const canManageMembers = role === "OWNER" || role === "ADMIN";

  const { data: pendingMembersList } = useClubPendingMembers(clubId, canManageMembers);

  const existingEmails = useMemo(
    () =>
      Array.isArray(clubMembers)
        ? clubMembers.map((m) => m.member_member_email)
        : [],
    [clubMembers],
  );

  const pendingMembersForClub = useMemo(() => {
    if (!pendingMembersList || !canManageMembers) return [];
    return pendingMembersList.map((m: any) => ({
      member_id: m.id,
      member_member_name: m.memberName,
      member_member_email: m.memberEmail,
      member_date_joined: m.dateJoined,
      member_role: "Member" as const,
      isRegisteredUser: false,
      isPending: true,
    }));
  }, [pendingMembersList, canManageMembers]);

  const allMembers = useMemo(
    () => [...(clubMembers ?? []), ...pendingMembersForClub],
    [clubMembers, pendingMembersForClub],
  );

  const nextMeetingNo = useMemo(() => {
    if (!Array.isArray(meetings) || meetings.length === 0) return 1;
    return Math.max(...meetings.map((m) => m.meetingNo)) + 1;
  }, [meetings]);

  // const upcomingMeetings = useMemo(
  //   () => sortMeetingsByDate(filterUpcomingMeetings(meetings ?? [])),
  //   [meetings]
  // );

  // Event handlers
  const handleSettingsClick = () => setIsSettingsOpen(true);

  const handleSaveSettings = async (data: ClubSettingsInput) => {
    await updateClubMutation.mutateAsync(data);
  };

  const handleScheduleMeeting = () => {
    setIsScheduleMeetingOpen(true);
  };

  const handleCreateMeeting = async (
    data: Omit<CreateMeetingInput, "clubId">,
  ) => {
    const meetingData: CreateMeetingInput = {
      ...data,
      clubId,
      date: new Date(data.date).toISOString(),
    };

    const meeting = await createMeetingMutation.mutateAsync(meetingData);
    // Navigate to the created meeting page
    router.push(`/club/${clubId}/meetings/${meeting.id}`);
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      await removeMemberMutation.mutateAsync(memberId);
      toast({
        title: "Member removed",
        description: "The member has been removed from this club.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to remove member",
        description: getErrorMessage(error),
      });
    }
  };

  const handleAddMember = async (data: AddMemberInput) => {
    await addMemberMutation.mutateAsync(data);
    // Modal will close automatically after successful addition
  };

  const handleJoinClub = async (data: JoinClubInput) => {
    await requestJoinClubMutation.mutateAsync(data);
  };

  const handleAcceptMember = async (memberId: string) => {
    pendingDecisionMutation.mutate({ clubId, memberId, decision: true });
    setSelectedMemberForReport(null);
  };

  if (isClubError) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-white bg-linear-to-b from-slate-950 to-slate-900">
        <h1 className="text-2xl font-bold mb-4">Club Not Found</h1>
        <p className="text-slate-400">
          The club you are looking for does not exist or has been removed.
        </p>
      </div>
    );
  }

  // Loading state
  if (isLoading || !club || !clubStats) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 to-slate-900 pt-24 pb-12 px-4">
      <motion.div
        variants={ANIMATION_CONFIG.container}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Club Summary */}
        <motion.div variants={ANIMATION_CONFIG.item}>
          <ClubInfoCard
            club={club}
            onSettingsClick={handleSettingsClick}
            totalMembers={clubStats.totalMembers}
            pendingMembers={clubStats.pendingMembers}
            canSeeCode={canSeeCode}
            isMember={isMember}
            compact
            onJoinClick={async () =>
              await handleJoinClub({ clubCode: club.clubCode as any })
            }
            onPendingClick={() =>
              document.getElementById("members-section")?.scrollIntoView({ behavior: "smooth" })
            }
          />
        </motion.div>
        

        {/* Upcoming Meetings */}
        <motion.div variants={ANIMATION_CONFIG.item}>
          <MeetingListSection
            meetings={meetings ?? []}
            clubId={club.id}
            maxDisplay={3}
            onScheduleMeeting={
              canManageMembers ? handleScheduleMeeting : undefined
            }
          />
        </motion.div>

        {/* Members Section */}
        <motion.div id="members-section" variants={ANIMATION_CONFIG.item}>
          <MemberListSection
            members={allMembers}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onAddMember={() => setIsAddMemberOpen(true)}
            onRemoveMember={handleRemoveMember}
            onMemberClick={setSelectedMemberForReport}
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

      {/* Schedule Meeting Modal */}
      {canManageMembers && (
        <ScheduleMeetingModal
          isOpen={isScheduleMeetingOpen}
          onClose={() => setIsScheduleMeetingOpen(false)}
          onSubmit={handleCreateMeeting}
          isLoading={createMeetingMutation.isPending}
          nextMeetingNo={nextMeetingNo}
        />
      )}

      {/* Club Settings Modal */}
      {canManageMembers && (
        <ClubSettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onSave={handleSaveSettings}
          club={club}
          isLoading={updateClubMutation.isPending}
        />
      )}

      <MemberRoleReportModal
        isOpen={!!selectedMemberForReport}
        onClose={() => setSelectedMemberForReport(null)}
        member={selectedMemberForReport}
        clubId={clubId}
        onRemoveMember={async (memberId) => {
          if (selectedMemberForReport?.isPending) {
            pendingDecisionMutation.mutate({ clubId, memberId, decision: false });
          } else {
            await handleRemoveMember(memberId);
          }
          setSelectedMemberForReport(null);
        }}
        onAcceptMember={canManageMembers ? handleAcceptMember : undefined}
        canRemoveMember={canManageMembers}
        isRemovingMember={removeMemberMutation.isPending || pendingDecisionMutation.isPending}
        isAcceptingMember={pendingDecisionMutation.isPending}
      />
    </div>
  );
}
