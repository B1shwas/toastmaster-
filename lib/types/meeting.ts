export enum MeetingStatus {
  DRAFT = "DRAFT",
  SCHEDULED = "SCHEDULED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum MeetingType {
  ONLINE = "ONLINE",
  PHYSICAL = "PHYSICAL",
  HYBRID = "HYBRID",
}

export interface Agenda {
  id: string;
  title: string;
  description: string | null;
  date: string;
  roleName: string;
  duration: number;
  sequence: number;
  meetingId: string;
  memberId: string | null;
  memberName: string | null;
  notes: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Meeting {
  id: string;
  clubId: string;
  meetingNo: number;
  theme: string;
  date: Date; // ISO 8601 format
  time: string; // HH:MM:SS
  venue: string;
  notes: string | null;
  socialLinks: string[] | null;
  status: MeetingStatus;
  meetingType: MeetingType;
  isDeleted: boolean;
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



type AgendaItem = {
  title: string;
  roleName: string;
  duration: number;
  sequence: number;
  notes: string | null;
}

export type MeetingSession = {
  theme: string;
  time: string;
  notes: string | null;
  agendas: AgendaItem[];
}

export interface Template {
  data: MeetingSession[] | null;
  total: number;
  page: number;
  limit: number;
}



