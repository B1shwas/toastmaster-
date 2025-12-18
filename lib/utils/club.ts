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
    const date = new Date(dateString);

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
    const date = new Date(dateString);

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

export function isLinkedMember(member: ClubMember): boolean {
  return member.isRegisteredUser;
}

export function filterMembers(
  members: ClubMember[],
  query: string
): ClubMember[] {
  if (!query.trim()) return members;

  const normalizedQuery = query.toLowerCase().trim();

  return members.filter(
    (member) =>
      member.member_member_name.toLowerCase().includes(normalizedQuery) ||
      member.member_member_email.toLowerCase().includes(normalizedQuery)
  );
}

export function sortMembersByDate(
  members: ClubMember[],
  order: "asc" | "desc" = "desc"
): ClubMember[] {
  return [...members].sort((a, b) => {
    const dateA = new Date(a.member_date_joined).getTime();
    const dateB = new Date(b.member_date_joined).getTime();
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
    (m) => m.member_member_email.toLowerCase() === email.toLowerCase()
  );
}
