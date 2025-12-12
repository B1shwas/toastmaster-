export enum MeetingStatus {
  DRAFT = "DRAFT",
  SCHEDULED = "SCHEDULED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface Agenda {
  id: string;
  meetingId: string;
  clubId: string;
  role: string;
  memberId: string | null;
  memberName?: string;
  allottedTime: number;
  sequence: number;
}

export interface Meeting {
  id: string;
  clubId: string;
  meetingNo: number;
  theme: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  venue: string;
  tmodNotes: string | null;
  status: MeetingStatus;
  createdAt?: string;
  updatedAt?: string;
  // Populated from relations
  agendas?: Agenda[];
}

export interface MeetingWithAgendaCount extends Omit<Meeting, "agendas"> {
  agendaCount: number;
  assignedCount: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error?: string;
  message?: string;
}

export type MeetingResponse = ApiResponse<Meeting>;
export type MeetingsResponse = ApiResponse<Meeting[]>;
export type AgendaResponse = ApiResponse<Agenda>;
