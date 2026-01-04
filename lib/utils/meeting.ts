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

export function formatMeetingDate(dateString: Date): string {
  if (!dateString) return "TBD";

  const date = new Date(dateString);

  try {
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

export function formatFullMeetingDate(date: Date): string {
  if (!date) return "TBD";

  const dateObj = new Date(date);

  try {
    if (isNaN(dateObj.getTime())) return "Invalid date";

    return dateObj.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "Invalid date";
  }
}

export function isMeetingToday(date: Date): boolean {
  const now = new Date();
  const dateObj = new Date(date);
  return (
    dateObj.getDate() === now.getDate() &&
    dateObj.getMonth() === now.getMonth() &&
    dateObj.getFullYear() === now.getFullYear()
  );
}

export function isMeetingUpcoming(date: Date): boolean {
  const now = new Date();
  const dateObj = new Date(date);
  now.setHours(0, 0, 0, 0);
  const meetingDate = new Date(
    dateObj.getFullYear(),
    dateObj.getMonth(),
    dateObj.getDate()
  );
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

// Schedule View Helpers
export const START_HOUR = 8; // 8 AM
export const END_HOUR = 20; // 8 PM
export const TOTAL_HOURS = END_HOUR - START_HOUR;

export function formatTimeRange(startHour: number, endHour: number): string {
  const formatHour = (hour: number) => {
    const h = hour % 12 || 12;
    const ampm = hour >= 12 && hour < 24 ? 'PM' : 'AM';
    return `${h}${ampm}`;
  };
  return `${formatHour(startHour)} - ${formatHour(endHour)}`;
}

