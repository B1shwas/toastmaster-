import { Club, ClubMeetingFrequency } from "../types/club";

// ============================================
// Sample Data (for development only)
// ============================================
export const SAMPLE_CLUB: Club = {
  id: "1",
  name: "Sunrise Toastmasters",
  description:
    "A vibrant community of speakers and leaders dedicated to improving communication and leadership skills.",
  district: "District 41",
  area: "Area 12",
  division: "Division B",
  ownerId: "user-1",
  meetingFrequency: ClubMeetingFrequency.WEEKLY,
  clubCode: "TM-2024-001",
  members: [
    {
      id: "m1",
      userId: "user-1",
      clubId: "1",
      memberName: "John Smith",
      memberEmail: "john.smith@email.com",
      dateJoined: "2024-01-15",
    },
    {
      id: "m2",
      userId: "user-2",
      clubId: "1",
      memberName: "Sarah Johnson",
      memberEmail: "sarah.j@email.com",
      dateJoined: "2024-02-20",
    },
    {
      id: "m3",
      userId: null,
      clubId: "1",
      memberName: "Mike Chen",
      memberEmail: "mike.chen@email.com",
      dateJoined: "2024-03-10",
    },
    {
      id: "m4",
      userId: "user-4",
      clubId: "1",
      memberName: "Emily Davis",
      memberEmail: "emily.d@email.com",
      dateJoined: "2024-04-05",
    },
    {
      id: "m5",
      userId: null,
      clubId: "1",
      memberName: "David Wilson",
      memberEmail: "david.w@email.com",
      dateJoined: "2024-05-18",
    },
    {
      id: "m6",
      userId: "user-6",
      clubId: "1",
      memberName: "Lisa Anderson",
      memberEmail: "lisa.a@email.com",
      dateJoined: "2024-06-22",
    },
    {
      id: "m7",
      userId: "user-7",
      clubId: "1",
      memberName: "Tom Brown",
      memberEmail: "tom.b@email.com",
      dateJoined: "2024-07-30",
    },
    {
      id: "m8",
      userId: null,
      clubId: "1",
      memberName: "Anna Lee",
      memberEmail: "anna.l@email.com",
      dateJoined: "2024-08-14",
    },
  ],
  createdAt: "2024-01-01",
  updatedAt: "2024-12-01",
};

// ============================================
// Re-export utilities for backward compatibility
// ============================================
export {
  formatMeetingFrequency,
  formatMemberDate,
  getInitials,
  calculateClubStats,
  filterMembers,
  copyToClipboard,
  isLinkedMember,
  isDuplicateMember,
} from "../utils/club";
