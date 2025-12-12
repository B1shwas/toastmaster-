import type {
  Club,
  ClubMember,
  ClubMeetingFrequency,
  ClubStats,
} from "../types/club";

const MEETING_FREQUENCY_LABELS: Record<ClubMeetingFrequency, string> = {
  WEEKLY: "Weekly",
  BIWEEKLY: "Bi-weekly",
  MONTHLY: "Monthly",
};

export function formatMeetingFrequency(
  frequency: ClubMeetingFrequency
): string {
  return MEETING_FREQUENCY_LABELS[frequency] || frequency;
}

export function formatMemberDate(dateString: string): string {
  if (!dateString) return "Unknown";

  try {
    const date = new Date(dateString + "T00:00:00");

    if (isNaN(date.getTime())) {
      return "Invalid date";
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "Invalid date";
  }
}

export function formatFullDate(dateString: string): string {
  if (!dateString) return "Unknown";

  try {
    const date = new Date(dateString + "T00:00:00");

    if (isNaN(date.getTime())) {
      return "Invalid date";
    }

    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "Invalid date";
  }
}

export function getInitials(name: string): string {
  if (!name || typeof name !== "string") return "??";

  return (
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "??"
  );
}

export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

export function calculateClubStats(members: ClubMember[]): ClubStats {
  if (!Array.isArray(members)) {
    return { totalMembers: 0, linkedMembers: 0, pendingMembers: 0 };
  }

  const totalMembers = members.length;
  const linkedMembers = members.filter((m) => m.userId !== null).length;
  const pendingMembers = totalMembers - linkedMembers;

  return { totalMembers, linkedMembers, pendingMembers };
}

export function isLinkedMember(member: ClubMember): boolean {
  return member.userId !== null;
}

export function filterMembers(
  members: ClubMember[],
  query: string
): ClubMember[] {
  if (!query.trim()) return members;

  const normalizedQuery = query.toLowerCase().trim();

  return members.filter(
    (member) =>
      member.memberName.toLowerCase().includes(normalizedQuery) ||
      member.memberEmail.toLowerCase().includes(normalizedQuery)
  );
}

export function sortMembersByDate(
  members: ClubMember[],
  order: "asc" | "desc" = "desc"
): ClubMember[] {
  return [...members].sort((a, b) => {
    const dateA = new Date(a.dateJoined).getTime();
    const dateB = new Date(b.dateJoined).getTime();
    return order === "desc" ? dateB - dateA : dateA - dateB;
  });
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const success = document.execCommand("copy");
    document.body.removeChild(textArea);
    return success;
  } catch {
    return false;
  }
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isDuplicateMember(
  members: ClubMember[],
  email: string
): boolean {
  return members.some(
    (m) => m.memberEmail.toLowerCase() === email.toLowerCase()
  );
}
