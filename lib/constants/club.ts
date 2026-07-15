import { Club, ClubMeetingFrequency } from "../types/club";

export const SAMPLE_CLUB: Club = {
	id: "1",
	name: "Sunrise Toastmasters",
	clubCode: '10101',
	description:
		"A vibrant community of speakers and leaders dedicated to improving communication and leadership skills.",
	district: "District 41",
	area: "Area 12",
	division: "Division B",
	ownerId: "user-1",
	meetingFrequency: ClubMeetingFrequency.WEEKLY,
	createdAt: "2024-01-01",
	updatedAt: "2024-12-01",
};

export {
	formatMeetingFrequency,
	formatMemberDate,
	getInitials,
	filterMembers,
	copyToClipboard,
	isLinkedMember,
} from "../utils/club";
