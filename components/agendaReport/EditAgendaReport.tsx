import { ScrollArea } from "../ui/scroll-area";

interface MemberEvaluation {
    examples: string[];
    memberId: string;
    memberName: string;
    grammarIssues: string;
    wordUsageCount: number;
}

interface FillerWordCount {
    memberId: string;
    memberName: string;
    ahs: number;
    ums: number;
    likes: number;
    other: number;
    notes: string;
}

interface Report {
    id: string;
    reportType: "GRAMMARIAN" | "AH_COUNTER";
    wordOfTheDay: string;
    wordOfTheDayDefinition: string;
    grammarNotes?: string;
    memberEvaluations?: MemberEvaluation[];
    fillerWordCounts?: FillerWordCount[];
    overallNotes: string;
    createdAt: string;
    updatedAt: string;
}

interface ViewAgendaReportProps {
    reportData: {
        roleName: string;
        status: string;
        report: Report;
    };
}

export const ViewAgendaReport = ({ reportData }: ViewAgendaReportProps) => {
    const { report, roleName } = reportData;
    const isGrammarian = report?.reportType === "GRAMMARIAN";
    const isAhCounter = report?.reportType === "AH_COUNTER";

    const totalWordUsage =
        report?.memberEvaluations?.reduce(
            (sum, member) => sum + member?.wordUsageCount,
            0,
        ) || 0;

    const totalFillers =
        report?.fillerWordCounts?.reduce(
            (sum, member) =>
                sum + member?.ahs + member?.ums + member?.likes + member?.other,
            0,
        ) || 0;

    return (
        <div className="flex flex-col gap-y-4 text-white">
            <h1 className="text-2xl font-extrabold">{roleName} Report</h1>

            {/* Word of the Day Section */}
            <div className="bg-neutral-800/50 rounded-xl p-4 border border-neutral-700/50">
                <p className="text-neutral-400 text-xs uppercase tracking-wider font-medium mb-2">
                    Word of the Day
                </p>
                <p className="text-white font-semibold text-lg mb-2">
                    {report?.wordOfTheDay}
                </p>
                {report?.wordOfTheDayDefinition && (
                    <p className="text-neutral-300 text-sm leading-relaxed">
                        {
                            report?.wordOfTheDayDefinition
                        }
                    </p>
                )}
            </div>

            {/* Statistics */}
            <div className="flex flex-col gap-y-2 border border-neutral-700/50 rounded-xl bg-neutral-800/50 p-4">
              <p className="text-neutral-400 text-xs uppercase tracking-wider font-medium mb-2">
                  Summary
              </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <p className="text-neutral-300 font-semibold text-lg mb-2">
                            Members Evaluated
                        </p>
                        <p className="text-2xl font-bold">
                            {isGrammarian
                                ? report?.memberEvaluations?.length || 0
                                : report?.fillerWordCounts?.length || 0}
                        </p>
                    </div>
                    <div>
                        <p className="text-neutral-300 font-semibold text-lg mb-2">
                            {isGrammarian
                                ? "Total Word Usage"
                                : "Total Filler Words"}
                        </p>
                        <p className="text-2xl font-bold">
                            {isGrammarian ? totalWordUsage : totalFillers}
                        </p>
                    </div>
                    <div>
                        <p className="text-neutral-300 font-semibold text-lg mb-2">
                            Average per Member
                        </p>
                        <p className="text-2xl font-bold">
                            {isGrammarian
                                ? (
                                      totalWordUsage /
                                      (report?.memberEvaluations?.length || 1)
                                  )?.toFixed(1)
                                : (
                                      totalFillers /
                                      (report?.fillerWordCounts?.length || 1)
                                  )?.toFixed(1)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Grammar Notes (Grammarian only) */}
            {isGrammarian && report?.grammarNotes && (
                <div className="flex flex-col gap-y-2 border bg-neutral-800/50 border-neutral-700/50 rounded-xl p-4">
                    <h2 className="text-neutral-400 text-xs uppercase tracking-wider font-medium mb-2">Grammar Notes</h2>
                    <p className="">{report?.grammarNotes}</p>
                </div>
            )}

            {/* Member Evaluations */}
            <div className="flex flex-col gap-y-2 border border-stone-600 bg-neutral-800/50 rounded-xl p-2">
                <h2 className="text-neutral-400 text-xs uppercase tracking-wider font-medium mb-2 m-2">Member Evaluations</h2>
                <ScrollArea className="h-[500px]">
                    <div className="flex flex-col gap-y-2 p-2">
                        {isGrammarian &&
                            report?.memberEvaluations?.map((member) => (
                                <div
                                    key={member?.memberId}
                                    className="border border-stone-400 bg-black p-2 md:p-4 rounded-xl"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <p className="font-bold text-white">
                                                {member?.memberName}
                                            </p>
                                            <p className="text-sm ">
                                                Word Usage:{" "}
                                                <span className="font-bold text-white">
                                                    {member?.wordUsageCount}
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Examples */}
                                    {member?.examples &&
                                        member?.examples?.length > 0 && (
                                            <div className="mb-3">
                                                <p className="text-neutral-400 text-xs uppercase tracking-wider font-medium mb-2">
                                                    Examples:
                                                </p>
                                                <div className="flex flex-col gap-y-1">
                                                    {member?.examples?.map(
                                                        (example, idx) => (
                                                            <p
                                                                key={idx}
                                                                className="text-sm"
                                                            >
                                                                • &quot;
                                                                {example}&quot;
                                                            </p>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                    {/* Grammar Issues */}
                                    {member?.grammarIssues && (
                                        <div>
                                            <p className="text-neutral-400 text-xs uppercase tracking-wider font-medium mb-2">
                                                Grammar Notes:
                                            </p>
                                            <p className="">
                                                {member?.grammarIssues}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}

                        {isAhCounter &&
                            report?.fillerWordCounts?.map((member) => (
                                <div
                                    key={member?.memberId}
                                    className="border border-stone-400 p-2 md:p-4 rounded-xl"
                                >
                                    <div className="mb-3">
                                        <p className="font-bold text-white">
                                            {member?.memberName}
                                        </p>
                                        <p className="text-sm text-neutral-500">
                                            Total Fillers:{" "}
                                            <span className="font-bold text-white">
                                                {member?.ahs +
                                                    member?.ums +
                                                    member?.likes +
                                                    member?.other}
                                            </span>
                                        </p>
                                    </div>

                                    {/* Filler Word Breakdown */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                                        <div className="border border-stone-500 rounded p-2">
                                            <p className="text-xl font-bold">
                                                {member?.ahs}
                                            </p>
                                            <p className="text-xs text-neutral-500">
                                                Ahs
                                            </p>
                                        </div>
                                        <div className="border border-stone-500 rounded p-2">
                                            <p className="text-xl font-bold">
                                                {member?.ums}
                                            </p>
                                            <p className="text-xs text-neutral-500">
                                                Ums
                                            </p>
                                        </div>
                                        <div className="border border-stone-500 rounded p-2">
                                            <p className="text-xl font-bold">
                                                {member?.likes}
                                            </p>
                                            <p className="text-xs text-neutral-500">
                                                Likes
                                            </p>
                                        </div>
                                        <div className="border border-stone-500 rounded p-2">
                                            <p className="text-xl font-bold">
                                                {member?.other}
                                            </p>
                                            <p className="text-xs text-neutral-500">
                                                Other
                                            </p>
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    {member?.notes && (
                                        <div>
                                            <p className="text-sm font-semibold mb-1">
                                                Notes:
                                            </p>
                                            <p className="text-sm text-neutral-400">
                                                {member?.notes}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Overall Notes */}
            <div className="bg-neutral-800/50 rounded-xl p-4 border border-neutral-700/50">
                <p className="text-neutral-400 text-xs uppercase tracking-wider font-medium mb-2">
                    Grammar Notes
                </p>
                <p className="text-neutral-300 text-sm leading-relaxed">
                    {report?.grammarNotes}
                </p>
            </div>
        </div>
    );
};
