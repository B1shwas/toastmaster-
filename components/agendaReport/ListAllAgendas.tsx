import { useAgendaReport } from "@/lib/api/hooks/use-agenda-report";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "../ui/accordion";
import { FORDREPORT } from "@/lib/types/agendaReport";

export const ListAllAgendas = ({
	club_id,
	meeting_id,
}: {
	club_id?: string;
	meeting_id?: string;
}) => {
    const { data, isLoading } = useAgendaReport();

    if (isLoading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
                <div className="bg-neutral-900 border border-neutral-700 rounded-2xl px-8 py-6 shadow-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <p className="text-white text-lg font-medium">
                            Loading reports...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const filteredData = (data as FORDREPORT[] ?? [])?.filter(
        (d:FORDREPORT) =>
            (!club_id || d?.club_id === club_id) &&
            (!meeting_id || d?.meeting_id === meeting_id),
    );

    return (
        <div className="flex flex-col gap-y-6 md:gap-y-8 my-6 md:my-10 px-4 md:px-0">
            <div className="flex flex-col gap-2">
                <h1 className="text-white text-2xl md:text-3xl font-bold tracking-tight">
                    Your Reports
                </h1>
                <p className="text-neutral-400 text-sm md:text-base">
                    {filteredData?.length === 0
                        ? "No reports found"
                        : `${filteredData?.length} ${filteredData?.length === 1 ? "report" : "reports"} available`}
                </p>
            </div>

            {filteredData?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 md:py-24 border border-dashed border-neutral-700 rounded-2xl">
                    <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mb-4">
                        <svg
                            className="w-8 h-8 text-neutral-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-neutral-300 text-lg font-semibold mb-2">
                        No Reports Found
                    </h3>
                    <p className="text-neutral-500 text-sm text-center max-w-sm">
                        Reports will appear here once you attend meetings. Check
                        back after your next session.
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-4 md:gap-5">
                    {filteredData?.map((d, index) => (
                        <div
                            key={d?.id}
                            className="group `bg-linear-to-br from-neutral-900 to-neutral-900/50 border border-neutral-800 hover:border-neutral-700 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/20"
                        >
                            <div className="p-5 md:p-7">bg-linear-to-br
                                {/* Header Section */}
                                <div className="flex items-start justify-between mb-5 pb-5 border-b border-neutral-800">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-blue-500/20">
                                            <span className="text-blue-400 font-bold text-sm">
                                                #{index + 1}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-white font-semibold text-base md:text-lg">
                                                {d?.report_type || "Report"}
                                            </p>
                                            <p className="text-neutral-500 text-xs md:text-sm mt-0.5">
                                                Meeting Report
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Main Content Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-5">
                                    {/* Word of the Day Card */}
                                    {d?.word_of_the_day && (
                                        <div className="bg-neutral-800/50 rounded-xl p-4 border border-neutral-700/50">
                                            <p className="text-neutral-400 text-xs uppercase tracking-wider font-medium mb-2">
                                                Word of the Day
                                            </p>
                                            <p className="text-white font-semibold text-lg mb-2">
                                                {d.word_of_the_day}
                                            </p>
                                            {d?.word_of_the_day_definition && (
                                                <p className="text-neutral-300 text-sm leading-relaxed">
                                                    {
                                                        d.word_of_the_day_definition
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Grammar Notes Card */}
                                    {d?.grammar_notes && (
                                        <div className="bg-neutral-800/50 rounded-xl p-4 border border-neutral-700/50">
                                            <p className="text-neutral-400 text-xs uppercase tracking-wider font-medium mb-2">
                                                Grammar Notes
                                            </p>
                                            <p className="text-neutral-300 text-sm leading-relaxed">
                                                {d.grammar_notes}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Overall Notes Section */}
                                {d?.overall_notes && (
                                    <div className="bg-neutral-800/30 rounded-xl p-4 border border-neutral-700/30 mb-5">
                                        <p className="text-neutral-400 text-xs uppercase tracking-wider font-medium mb-2">
                                            Overall Notes
                                        </p>
                                        <p className="text-neutral-300 text-sm leading-relaxed">
                                            {d.overall_notes}
                                        </p>
                                    </div>
                                )}

                                {/* Expandable Details */}
                                {(d?.member_evaluation?.[0]?.examples ||
                                    (d?.filler_word_counts?.length ?? 0) > 0) && (
                                    <Accordion
                                        type="single"
                                        collapsible
                                        className="w-full"
                                    >
                                        <AccordionItem
                                            value="details"
                                            className="border-none"
                                        >
                                            <AccordionTrigger className="text-neutral-300 hover:text-white text-sm font-medium py-3 hover:no-underline">
                                                <div className="flex items-center gap-2">
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                        />
                                                    </svg>
                                                    <span>
                                                        View Detailed Feedback
                                                    </span>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="pt-3">
                                                <div className="flex flex-col gap-5">
                                                    {/* Member Evaluations */}
                                                    {d?.member_evaluation?.[0]
                                                        ?.examples && (
                                                        <div className="bg-neutral-800/30 rounded-xl p-4 border border-neutral-700/30">
                                                            <h4 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                                Member
                                                                Evaluations
                                                            </h4>
                                                            <div className="flex flex-col gap-2">
                                                              {d?.member_evaluation?.[0]?.examples?.map(
                                                                    (
                                                                        example,
                                                                        idx,
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                idx
                                                                            }
                                                                            className="bg-neutral-900/50 rounded-lg p-3 border border-neutral-700/50"
                                                                        >
                                                                            <p className="text-neutral-300 text-sm leading-relaxed">
                                                                                {
                                                                                    example
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    ),
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Filler Words */}
                                                    {(d?.filler_word_counts
                                                        ?.length ?? 0) > 0 && (
                                                        <div className="bg-neutral-800/30 rounded-xl p-4 border border-neutral-700/30">
                                                            <h4 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                                                Filler Word
                                                                Analysis
                                                            </h4>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                {d?.filler_word_counts?.map(
                                                                    (
                                                                        count,
                                                                        idx,
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                idx
                                                                            }
                                                                            className="bg-neutral-900/50 rounded-lg p-4 border border-neutral-700/50"
                                                                        >
                                                                            <div className="grid grid-cols-2 gap-3 mb-3">
                                                                                <div>
                                                                                    <p className="text-neutral-500 text-xs mb-1">
                                                                                        Ahs
                                                                                    </p>
                                                                                    <p className="text-white font-bold text-lg">
                                                                                        {
                                                                                            count?.ahs
                                                                                        }
                                                                                    </p>
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-neutral-500 text-xs mb-1">
                                                                                        Ums
                                                                                    </p>
                                                                                    <p className="text-white font-bold text-lg">
                                                                                        {
                                                                                            count?.ums
                                                                                        }
                                                                                    </p>
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-neutral-500 text-xs mb-1">
                                                                                        Likes
                                                                                    </p>
                                                                                    <p className="text-white font-bold text-lg">
                                                                                        {
                                                                                            count?.likes
                                                                                        }
                                                                                    </p>
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-neutral-500 text-xs mb-1">
                                                                                        Other
                                                                                    </p>
                                                                                    <p className="text-white font-bold text-lg">
                                                                                        {
                                                                                            count?.other
                                                                                        }
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                            {count?.notes && (
                                                                                <div className="pt-3 border-t border-neutral-700/50">
                                                                                    <p className="text-neutral-400 text-xs mb-1">
                                                                                        Notes
                                                                                    </p>
                                                                                    <p className="text-neutral-300 text-sm">
                                                                                        {
                                                                                            count?.notes
                                                                                        }
                                                                                    </p>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    ),
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
