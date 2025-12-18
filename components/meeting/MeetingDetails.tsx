"use client";

import { memo } from "react";
import { Calendar, Clock, MapPin, Users, FileText } from "lucide-react";
import type { Meeting } from "@/lib/types/meeting";
import {
  getMeetingStatusConfig,
  formatFullMeetingDate,
  formatMeetingTime,
} from "@/lib/utils/meeting";

interface MeetingHeaderProps {
  meeting: Meeting;
}

interface MeetingDetailsCardProps {
  meeting: Meeting;
  assignedCount: number;
  totalRoles: number;
}

interface MeetingNotesCardProps {
  notes: string;
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800">
        <Icon className="h-4 w-4 text-slate-400" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">
          {label}
        </p>
        <p className="text-white">{value}</p>
      </div>
    </div>
  );
}

function MeetingHeaderComponent({ meeting }: MeetingHeaderProps) {
  const statusConfig = getMeetingStatusConfig(meeting.status);

  return (
    <header className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-slate-400">
          Meeting #{meeting.meetingNo}
        </span>
        <span
          className="rounded-full px-2.5 py-1 text-xs font-medium"
          style={{
            backgroundColor: statusConfig.bgColor,
            color: statusConfig.color,
          }}
        >
          {statusConfig.label}
        </span>
      </div>
      <h1 className="text-2xl font-bold text-white sm:text-3xl">
        {meeting.theme || "Untitled Meeting"}
      </h1>
    </header>
  );
}

function MeetingDetailsCardComponent({
  meeting,
  assignedCount,
  totalRoles,
}: MeetingDetailsCardProps) {
  const rolesValue =
    totalRoles > 0 ? `${assignedCount}/${totalRoles} assigned` : "No roles";

  return (
    <section className="space-y-5 rounded-xl border border-slate-700/50 bg-slate-800/30 p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
        Details
      </h2>
      <div className="grid gap-5 sm:grid-cols-2">
        {[
          {
            icon: Calendar,
            label: "Date",
            value: formatFullMeetingDate(meeting.date),
          },
          {
            icon: Clock,
            label: "Time",
            value: formatMeetingTime(meeting.time),
          },
          { icon: MapPin, label: "Venue", value: meeting.venue || "TBD" },
          { icon: Users, label: "Roles", value: rolesValue },
        ].map((item) => (
          <InfoItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            value={item.value}
          />
        ))}
      </div>
    </section>
  );
}

function MeetingNotesCardComponent({ notes }: MeetingNotesCardProps) {
  return (
    <section className="space-y-3 rounded-xl border border-slate-700/50 bg-slate-800/30 p-6">
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-slate-400" />
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          TMOD Notes
        </h2>
      </div>
      <p className="leading-relaxed text-slate-300">{notes}</p>
    </section>
  );
}

export const MeetingHeader = memo(MeetingHeaderComponent);
export const MeetingDetailsCard = memo(MeetingDetailsCardComponent);
export const MeetingNotesCard = memo(MeetingNotesCardComponent);
