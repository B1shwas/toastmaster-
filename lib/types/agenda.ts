export interface AgendaTemplate {
  id: string;
  name: string;
  description: string | null;
  clubId: string | null;
  isDefault: boolean;
  items: AgendaTemplateItem[];
  createdAt: string;
  updatedAt: string;
}

export interface AgendaRole {
  id: string;
  key: string;
  type: string;
  category?: string;
  isAdmin?: boolean;
}

export interface AgendaTemplateItem {
  id: string;
  title: string;
  systemRole: SystemRole;
  customRole: string | null;
  duration: number;
  sequence: number;
  agendaTemplateId: string;
}

export enum SystemRole {
  PRESIDENT = "PRESIDENT",
  VICE_PRESIDENT_EDUCATION = "VICE_PRESIDENT_EDUCATION",
  VICE_PRESIDENT_MEMBERSHIP = "VICE_PRESIDENT_MEMBERSHIP",
  VICE_PRESIDENT_PUBLIC_RELATIONS = "VICE_PRESIDENT_PUBLIC_RELATIONS",
  SECRETARY = "SECRETARY",
  TREASURER = "TREASURER",
  SERGEANT_AT_ARMS = "SERGEANT_AT_ARMS",
  TOASTMASTER = "TOASTMASTER",
  GENERAL_EVALUATOR = "GENERAL_EVALUATOR",
  TIMER = "TIMER",
  AH_COUNTER = "AH_COUNTER",
  GRAMMARIAN = "GRAMMARIAN",
  TABLE_TOPIC_MASTER = "TABLE_TOPIC_MASTER",
  SPEAKER = "SPEAKER",
  EVALUATOR = "EVALUATOR",
  TOPICSPEAKER = "TOPICSPEAKER",
  GUEST = "GUEST",
}

export interface Agenda {
  id: string;
  title: string;
  description: string | null;
  date: string;
  roleName: string | null;
  roleId?: string | null;
  duration: number;
  sequence: number;
  meetingId: string;
  memberId: string | null;
  memberName: string | null;
  notes: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAgendaPayload {
  title: string;
  // description?: string;
  // date: string;
  roleName?: string;
  roleId?: string;
  duration: number;
  sequence: number;
  meetingId: string;
  memberId?: string;
  memberName?: string;
  toastmasterId?: string;
  notes?: string;
  clubId: string;
}

export interface CreateAgendaFromTemplatePayload {
  templateId: string;
  meetingId: string;
  roleAssignments: RoleAssignment[];
}

export interface RoleAssignment {
  templateItemId: string;
  memberId?: string;
  memberName?: string;
}

export const ROLE_LABELS: Record<SystemRole, string> = {
  [SystemRole.PRESIDENT]: "President",
  [SystemRole.VICE_PRESIDENT_EDUCATION]: "VP Education",
  [SystemRole.VICE_PRESIDENT_MEMBERSHIP]: "VP Membership",
  [SystemRole.VICE_PRESIDENT_PUBLIC_RELATIONS]: "VP Public Relations",
  [SystemRole.SECRETARY]: "Secretary",
  [SystemRole.TREASURER]: "Treasurer",
  [SystemRole.SERGEANT_AT_ARMS]: "Sergeant at Arms",
  [SystemRole.TOASTMASTER]: "Toastmaster",
  [SystemRole.GENERAL_EVALUATOR]: "General Evaluator",
  [SystemRole.TIMER]: "Timer",
  [SystemRole.AH_COUNTER]: "Ah-Counter",
  [SystemRole.GRAMMARIAN]: "Grammarian",
  [SystemRole.TABLE_TOPIC_MASTER]: "Table Topic Master",
  [SystemRole.SPEAKER]: "Speaker",
  [SystemRole.EVALUATOR]: "Evaluator",
  [SystemRole.TOPICSPEAKER]: "Topic Speaker",
  [SystemRole.GUEST]: "Guest",
};

export interface RoleCount {
  role: string;
  memberName: string;
  count: number;
}
