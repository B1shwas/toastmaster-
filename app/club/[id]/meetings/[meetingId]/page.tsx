"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import type { Meeting } from "@/lib/types/meeting";
import { SAMPLE_MEETINGS } from "@/lib/constants/meeting";
import { useAgendaTiming } from "@/lib/hooks/useAgendaTiming";
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
      meetingStartTime: meeting.startTime,
      meetingDate: meeting.date,
      meetingStatus: meeting.status,
    });

  return (
    <PageWrapper>
      <BackLink href={`/club/${clubId}`} label="Back to Club" />

      <MeetingHeader meeting={meeting} />

      <MeetingDetailsCard
        meeting={meeting}
        assignedCount={assignedCount}
        totalRoles={agendas.length}
      />

      {meeting.tmodNotes && <MeetingNotesCard notes={meeting.tmodNotes} />}

      <AgendaList
        agendas={agendaWithTimes}
        activeIndex={activeAgendaIndex}
        totalTime={totalTime}
      />
    </PageWrapper>
  );
}

export default function MeetingPage() {
  const params = useParams<{ id: string; meetingId: string }>();


  const meeting = useMemo(() => {
    return SAMPLE_MEETINGS.find((m) => m.id === params.meetingId) || null;
  }, [params.meetingId]);

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
