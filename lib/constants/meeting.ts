import type { Meeting, Agenda, MeetingStatus } from "../types/meeting";

export const DEFAULT_AGENDA_TEMPLATE: Omit<
  Agenda,
  "id" | "meetingId" | "clubId" | "memberId"
>[] = [
  { role: "Toastmaster of the Day", allottedTime: 5, sequence: 1 },
  { role: "General Evaluator", allottedTime: 3, sequence: 2 },
  { role: "Timer", allottedTime: 2, sequence: 3 },
  { role: "Ah Counter", allottedTime: 2, sequence: 4 },
  { role: "Grammarian", allottedTime: 2, sequence: 5 },
  { role: "Table Topics Master", allottedTime: 10, sequence: 6 },
  { role: "Speaker 1", allottedTime: 7, sequence: 7 },
  { role: "Evaluator 1", allottedTime: 3, sequence: 8 },
  { role: "Speaker 2", allottedTime: 7, sequence: 9 },
  { role: "Evaluator 2", allottedTime: 3, sequence: 10 },
];

export {
  getMeetingStatusConfig,
  formatMeetingDate,
  formatMeetingTime,
  formatFullMeetingDate,
  isMeetingToday,
  isMeetingUpcoming,
  filterUpcomingMeetings,
  filterPastMeetings,
} from "../utils/meeting";
