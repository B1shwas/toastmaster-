export enum ClubMeetingFrequency {
  WEEKLY = "WEEKLY",
  BIWEEKLY = "BIWEEKLY",
  MONTHLY = "MONTHLY",
}

export interface ClubMember {
  id: string;
  userId: string | null;
  clubId: string;
  memberName: string;
  memberEmail: string;
  dateJoined: string;
}

export interface Club {
  id: string;
  name: string;
  description: string | null;
  district: string | null;
  area: string | null;
  division: string | null;
  ownerId: string;
  meetingFrequency: ClubMeetingFrequency;
  clubCode: string;
  members: ClubMember[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ClubStats {
  totalMembers: number;
  linkedMembers: number;
  pendingMembers: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error?: string;
  message?: string;
}

export type ClubResponse = ApiResponse<Club>;
export type ClubMemberResponse = ApiResponse<ClubMember>;
export type ClubMembersResponse = ApiResponse<ClubMember[]>;

export interface ClubInfoProps {
  club: Club;
  onSettingsClick?: () => void;
}

export interface ClubCodeProps {
  code: string;
  onCopy?: () => void;
}

export interface MemberCardProps {
  member: ClubMember;
  onRemove?: (memberId: string) => void;
  onEdit?: (member: ClubMember) => void;
  isOwner?: boolean;
}

export interface MemberListProps {
  members: ClubMember[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddMember: () => void;
  onRemoveMember?: (memberId: string) => void;
  isLoading?: boolean;
}

export type {
  AddMemberInput,
  ClubSettingsInput,
  JoinClubInput,
} from "../schemas/club.schema";
