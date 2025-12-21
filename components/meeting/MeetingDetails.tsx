"use client";

import { memo, useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  FileText,
  Edit2,
  Plus,
} from "lucide-react";
import type { Meeting } from "@/lib/types/meeting";
import { useUpdateMeetingNotes } from "@/lib/api/hooks/use-meetings";
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
  notes: string | null;
  meetingId: string;
  clubId: string;
  canManageNotes: boolean;
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

function MeetingNotesCardComponent({
  notes,
  meetingId,
  clubId,
  canManageNotes,
}: MeetingNotesCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [noteText, setNoteText] = useState(notes || "");
  const updateNotesMutation = useUpdateMeetingNotes();

  const handleSave = () => {
    updateNotesMutation.mutate(
      { meetingId, notes: noteText, clubId },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  const handleCancel = () => {
    setNoteText(notes || "");
    setIsEditing(false);
  };

  if (!notes && !canManageNotes) {
    return null;
  }

  return (
    <section className="space-y-3 rounded-xl border border-slate-700/50 bg-slate-800/30 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-slate-400" />
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Meeting Notes
          </h2>
        </div>
        {canManageNotes && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-sm text-cyan-400 transition-colors hover:bg-slate-700"
          >
            {notes ? (
              <>
                <Edit2 className="h-3.5 w-3.5" />
                Edit Notes
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" />
                Add Notes
              </>
            )}
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Enter meeting notes..."
            className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
            rows={6}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={updateNotesMutation.isPending}
              className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50"
            >
              {updateNotesMutation.isPending ? "Saving..." : "Save Notes"}
            </button>
            <button
              onClick={handleCancel}
              disabled={updateNotesMutation.isPending}
              className="rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-700 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="leading-relaxed text-slate-300 whitespace-pre-wrap">
          {notes || (
            <span className="italic text-slate-500">No notes added yet</span>
          )}
        </p>
      )}
    </section>
  );
}

export const MeetingHeader = memo(MeetingHeaderComponent);
export const MeetingDetailsCard = memo(MeetingDetailsCardComponent);
export const MeetingNotesCard = memo(MeetingNotesCardComponent);
