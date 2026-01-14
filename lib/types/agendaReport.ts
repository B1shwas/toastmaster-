export enum REPORT_TYPE {
    GRAMMARIAN = "Grammarian",
    AH_COUNTER = "Ah Counter",
}

export interface MEMBER_EVALUATION {
    memberId: string;
    memberName: string;
    wordUsageCount: number;
    examples: string[];
    grammarIssues: string;
    role?: string;
}

export interface FILLER_WORD_COUNT {
    memberId: string;
    memberName: string;
    ahs: number;
    ums: number;
    likes: number;
    other: number;
    notes: string;
    role?: string;
}

export interface REPORT {
    id: string;
    agendaId: string;
    clubId: string;
    meetingId: string;
    reportType: REPORT_TYPE | string;
    wordOfTheDay: string | null;
    memberId: string | null;
    wordOfTheDayDefinition: string | null;
    grammarNotes: string | null;
    overallNotes: string | null;
    memberEvaluation: MEMBER_EVALUATION | null;
    fillerWordCounts: FILLER_WORD_COUNT | null;
}

export interface FORDREPORT extends Omit<REPORT, 'memberEvaluation' | 'fillerWordCounts' > {
    memberEvaluation: MEMBER_EVALUATION[] | null;
    fillerWordCounts: FILLER_WORD_COUNT[] | null;
}

// export interface USERS_IN_MEETING {
//     memberId: string;
//     memberName: string;
//     userId: string;
//     role: string;
// }

export interface MemberReportData {
    memberId: string;
    memberName: string;
    userId?: string;
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
    role?: string;
}

export interface CAN_CREATE {
    roleName: string;
    status: string;
    meeting?: MemberReportData[] | null;
    report?: AgendaReport  | null;     
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



export interface AgendaReport  {
    id: string;
    reportType: "GRAMMARIAN" | "AH_COUNTER";
    wordOfTheDay: string;
    wordOfTheDayDefinition: string;
    grammarNotes?: string;
    memberEvaluations?: MEMBER_EVALUATION[];
    fillerWordCounts?: FILLER_WORD_COUNT[];
    overallNotes: string;
    createdAt: string;
    updatedAt: string;
}

export interface ViewAgendaReportProps {
    reportData: {
        roleName: string;
        status: string;
        report: AgendaReport ;
    };
}
