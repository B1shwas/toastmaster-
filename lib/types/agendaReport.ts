export enum REPORT_TYPE {
    GRAMMARIAN = "GRAMMARIAN",
    AH_COUNTER = "AH_COUNTER",
}

interface MEMBER_EVALUATION {
    examples: string[];
    grammer_issue: string;
    word_usage_count: number;
}

interface FILLER_WORD_COUNTS {
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
    filler_word_counts: FILLER_WORD_COUNTS | null;
}
