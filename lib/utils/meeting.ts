import type { Meeting, MeetingStatus } from "../types/meeting";

const STATUS_CONFIG: Record<
  MeetingStatus,
  { label: string; color: string; bgColor: string }
> = {
  DRAFT: {
    label: "Draft",
    color: "#78716c",
    bgColor: "rgba(120, 113, 108, 0.25)",
  },
  SCHEDULED: {
    label: "Scheduled",
    color: "#60a5fa",
    bgColor: "rgba(96, 165, 250, 0.25)",
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "#4ade80",
    bgColor: "rgba(74, 222, 128, 0.25)",
  },
  COMPLETED: {
    label: "Completed",
    color: "#22d3ee",
    bgColor: "rgba(34, 211, 238, 0.25)",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "#f87171",
    bgColor: "rgba(248, 113, 113, 0.25)",
  },
};

export function getMeetingStatusConfig(status: MeetingStatus) {
  return STATUS_CONFIG[status] || STATUS_CONFIG.DRAFT;
}

export function formatMeetingDate(dateString: string): string {
  if (!dateString) return "TBD";

  try {
    const date = new Date(dateString + "T00:00:00");
    if (isNaN(date.getTime())) return "Invalid date";

    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Invalid date";
  }
}

export function formatMeetingTime(time24: string): string {
  if (!time24) return "";

  try {
    const [hours, minutes] = time24.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  } catch {
    return time24;
  }
}

export function formatFullMeetingDate(dateString: string): string {
  if (!dateString) return "TBD";

  try {
    const date = new Date(dateString + "T00:00:00");
    if (isNaN(date.getTime())) return "Invalid date";

    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "Invalid date";
  }
}

export function isMeetingToday(dateString: string): boolean {
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(now.getDate()).padStart(2, "0")}`;
  return dateString === today;
}

export function isMeetingUpcoming(dateString: string): boolean {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const meetingDate = new Date(dateString + "T00:00:00");
  return meetingDate >= now;
}

export function filterUpcomingMeetings(meetings: Meeting[]): Meeting[] {
  return meetings.filter(
    (m) =>
      isMeetingUpcoming(m.date) &&
      m.status !== "CANCELLED" &&
      m.status !== "COMPLETED"
  );
}

export function filterPastMeetings(meetings: Meeting[]): Meeting[] {
  return meetings.filter(
    (m) => !isMeetingUpcoming(m.date) || m.status === "COMPLETED"
  );
}
