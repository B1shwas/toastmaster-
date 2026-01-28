export enum ClubMeetingFrequency {
	WEEKLY = "WEEKLY",
	BIWEEKLY = "BIWEEKLY",
	MONTHLY = "MONTHLY",
}

export interface ClubMember {
	member_id: string;
	member_member_name: string;
	member_member_email: string;
	member_date_joined: string;
	member_role: "OWNER" | "ADMIN" | "MEMBER";
	isRegisteredUser: boolean;
}

export interface Club {
	id: string;
	name: string;
	description: string | null;
	district: string | null;
	clubCode: string | null;
	area: string | null;
	division: string | null;
	ownerId: string;
	meetingFrequency: ClubMeetingFrequency;
	createdAt?: string;
	updatedAt?: string;
}

export interface ClubStats {
	totalMembers: number;
	registeredUsers: number;
	guestMembers: number;
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
	canViewEmail?: boolean;
}

export interface MemberListProps {
	members: ClubMember[];
	searchQuery: string;
	onSearchChange: (query: string) => void;
	onAddMember: () => void;
	onRemoveMember?: (memberId: string) => void;
	isLoading?: boolean;
	canManageMembers?: boolean;
}

export type {
	AddMemberInput,
	ClubSettingsInput,
	JoinClubInput,
} from "../schemas/club.schema";


export type MemberStatus = "pending" | "active" | "inactive";

export interface Member {
  id: string;
  memberName: string;
  memberEmail: string;
  dateJoined: string;
  status: MemberStatus;
  role: string;
}

export interface PendingClubGroup {
  id: string;
  name: string;
  description: string;
  members: Member[];
}

export interface ApiResponsePendingClubGroup {
  data: PendingClubGroup[];
  statusCode: number;
  timestamp: string;
}


