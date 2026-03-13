"use client";

import { memo } from "react";
import Link from "next/link";
import { Calendar, ArrowRight, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MeetingCard } from "./MeetingCard";
import type { Meeting } from "@/lib/types/meeting";
import { useProfile } from "@/lib/api";

interface MeetingListSectionProps {
  meetings: Meeting[];
  clubId: string;
  maxDisplay?: number;
  onScheduleMeeting?: () => void;
}

function EmptyState({ onScheduleMeeting }: { onScheduleMeeting?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-700 bg-slate-800/30 px-6 py-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-800">
        <Calendar className="h-7 w-7 text-slate-500" />
      </div>
      <h3 className="mb-1 text-base font-semibold text-white">
        No upcoming meetings
      </h3>
      <p className="mb-4 max-w-sm text-sm text-slate-400">
        Schedule your first meeting to get your club started.
      </p>
      {onScheduleMeeting && (
        <Button
          onClick={onScheduleMeeting}
          size="sm"
          className="gap-2 bg-linear-to-br from-blue-500 to-cyan-400"
        >
          <PlusCircle className="h-4 w-4" />
          Schedule Meeting
        </Button>
      )}
    </div>
  );
}

function MeetingListSectionComponent({
  meetings,
  clubId,
  maxDisplay = 3,
  onScheduleMeeting,
}: MeetingListSectionProps) {
  const isMeetingsArray = Array.isArray(meetings);
  const { data: userData } = useProfile();

  const memberOf = new Set<string>([
    ...(userData?.member_of?.map((u: { id: string }) => u.id) ?? []),
    ...(userData?.owned_clubs?.map((u: { id: string }) => u.id) ?? []),
    ...(userData?.admin_of?.map((u: { id: string }) => u.id) ?? []),
  ]);
  const isMemberOf = Boolean(userData) && memberOf.has(clubId);
  // if (memberOf.has(clubId)) {
  //   setIsMemberOf(true)
  // }
  // console.log("memberOf :: ", memberOf);
  // console.log("clubId :: ", clubId)
  // if (memberOf?.includes(clubId)) {
  //   console.log("true yar xa")
  // }

  // Filter meetings visible to the current viewer: non-members only see upcoming meetings
  const now = new Date();
  const visibleMeetings = isMeetingsArray
    ? isMemberOf
      ? meetings
      : meetings.filter((m) => new Date(m.date) >= now)
    : [];

  const displayMeetings = visibleMeetings.slice(0, maxDisplay);
  const meetingCount = visibleMeetings.length;

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Upcoming Meetings
          </h2>
          <p className="text-sm text-slate-400">
            {!isMeetingsArray
              ? "Failed to load meetings"
              : meetingCount === 0
                ? "No meetings scheduled"
                : `${meetingCount} meeting${
                    meetingCount === 1 ? "" : "s"
                  } scheduled`}
          </p>
        </div>
          <div className="flex items-center gap-2">
          {onScheduleMeeting && meetingCount > 0 && (
            <Button
              onClick={onScheduleMeeting}
              size="sm"
              className="hidden gap-1.5 sm:flex bg-linear-to-br from-blue-500 to-cyan-400"
            >
              <PlusCircle className="h-4 w-4" />
              New Meeting
            </Button>
          )}
          {isMemberOf && (
            <Link href={`/club/${clubId}/meetings`}>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-slate-400 hover:text-white hover:bg-slate-800"
              >
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Meeting Cards */}
      {!isMeetingsArray || meetingCount === 0 ? (
        <EmptyState onScheduleMeeting={onScheduleMeeting} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {displayMeetings.map((meeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} clubId={clubId} />
          ))}
        </div>
      )}

      {/* Mobile Schedule Button */}
      {onScheduleMeeting && meetingCount > 0 && (
        <div className="flex flex-col gap-2 sm:hidden">
          <Button
            onClick={onScheduleMeeting}
            className="w-full gap-2 bg-linear-to-br from-blue-500 to-cyan-400"
          >
            <PlusCircle className="h-4 w-4 " />
            Schedule New Meeting
          </Button>
            </div>
      )}
    </section>
  );
}

export const MeetingListSection = memo(MeetingListSectionComponent);
