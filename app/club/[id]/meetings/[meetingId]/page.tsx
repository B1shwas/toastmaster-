"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import type { Meeting } from "@/lib/types/meeting";
import { useAgendaTiming } from "@/lib/hooks/useAgendaTiming";
import { useMeeting } from "@/lib/api/hooks/use-meetings";
import {
  MeetingHeader,
  MeetingDetailsCard,
  MeetingNotesCard,
  AgendaList,
} from "@/components/meeting";
import {
  PageWrapper,
  BackLink,
  NotFoundState,
} from "@/components/ui/page-layout";

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

function MeetingContent({
  meeting,
  clubId,
}: {
  meeting: Meeting;
  clubId: string;
}) {
  const agendas = meeting.agendas || [];

  const { agendaWithTimes, activeAgendaIndex, totalTime, assignedCount } =
    useAgendaTiming({
      agendas,
      meetingStartTime: meeting.time,
      meetingDate: meeting.date,
      meetingStatus: meeting.status,
    });

  return (
    <PageWrapper>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        <motion.div variants={itemVariants}>
          <BackLink href={`/club/${clubId}`} label="Back to Club" />
        </motion.div>

        <motion.div variants={itemVariants}>
          <MeetingHeader meeting={meeting} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <MeetingDetailsCard
            meeting={meeting}
            assignedCount={assignedCount}
            totalRoles={agendas.length}
          />
        </motion.div>

        {meeting.notes && (
          <motion.div variants={itemVariants}>
            <MeetingNotesCard notes={meeting.notes} />
          </motion.div>
        )}

        <motion.div variants={itemVariants}>
          <AgendaList
            agendas={agendaWithTimes}
            activeIndex={activeAgendaIndex}
            totalTime={totalTime}
          />
        </motion.div>
      </motion.div>
    </PageWrapper>
  );
}

export default function MeetingPage() {
  const params = useParams<{ id: string; meetingId: string }>();
  const { data: meeting, isLoading } = useMeeting(params.meetingId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-slate-950 to-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400">Loading meeting...</p>
        </div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <NotFoundState
        title="Meeting not found"
        message="The meeting you're looking for doesn't exist."
        backHref={`/club/${params.id}`}
        backLabel="Back to Club"
      />
    );
  }

  return <MeetingContent meeting={meeting} clubId={params.id} />;
}
