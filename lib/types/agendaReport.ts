export enum REPORT_TYPE {
    GRAMMARIAN = "Grammarian",
    AH_COUNTER = "Ah Counter",
}

interface MEMBER_EVALUATION {
    memberId: string;
    memberName: string;
    wordUsageCount: number;
    examples: string[];
    grammarIssues: string;
}

interface FILLER_WORD_COUNT {
    memberId: string;
    memberName: string;
    ahs: number;
    ums: number;
    likes: number;
    other: number;
    notes: string;
}

export interface REPORT {
    id: string;
    agenda_id: string;
    club_id: string;
    meeting_id: string;
    report_type: REPORT_TYPE;
    word_of_the_day: string | null;
    member_id: string;
    word_of_the_day_definition: string | null;
    grammar_notes: string | null;
    overall_notes: string | null;
    member_evaluation: MEMBER_EVALUATION | null;
    filler_word_counts: FILLER_WORD_COUNT | null;
}

export interface USERS_IN_MEETING {
    memberId: string;
    memberName: string;
    userId: string;
    role: string;
}

export interface CAN_CREATE {
    roleName: string;
    status: string;
    meeting: USERS_IN_MEETING[];
}

export interface AgendaReportPayload {
    reportType: REPORT_TYPE;
    wordOfTheDay: string;
    wordOfTheDayDefinition: string;
    grammarNotes: string;
    memberEvaluations: MEMBER_EVALUATION[];
    fillerWordCounts: FILLER_WORD_COUNT[];
    overallNotes: string;
}


export interface MemberReportData {
    memberId: string;
    memberName: string;
    // For GRAMMARIAN
    wordUsageCount?: number;
    examples?: string[];
    grammarIssues?: string;
    // For AH_COUNTER
    ahs?: number;
    ums?: number;
    likes?: number;
    other?: number;
    notes?: string;
}