import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, getErrorMessage } from "@/lib/api";
import useAuthStore from "@/lib/stores/useAuthStore";
import { ClubResponse } from "@/lib/types/club";
import { toast as reactToast } from "react-hot-toast";
import { AgendaReportPayload } from "@/lib/types/agendaReport";

export function useAgendaReport() {
    const setAgendaReport = useAuthStore((state) => state.setAgendaReport);

    return useQuery({
        queryKey: ["agenda-report"],
        queryFn: async () => {
            const { data } = await api.get("/agenda-report");
            // console.log(data)
            const reports = data.data.map((a: any) => ({
                id: a?.id,
                agendaId: a?.agenda_id,
                clubId: a?.club_id,
                meetingId: a?.meeting_id,
                reportType: a?.report_type,
                wordOfTheDay: a?.word_of_the_day ? a?.word_of_the_day : null,
                wordOfTheDayDefinition: a?.word_of_the_day_definition
                    ? a?.word_of_the_day_definition
                    : null,
                grammarNotes: a?.grammar_notes ? a?.grammar_notes : null,
                overallNotes: a?.overall_notes ? a?.overall_notes : null,
                memberEvaluation:
                    a?.member_evaluations?.length > 0
                        ? a?.member_evaluations
                        : null,
                fillerWordCounts:
                    a?.filler_word_counts?.length > 0
                        ? a?.filler_word_counts
                        : null,
                memberId:
                    a?.member_evaluations?.length > 0
                        ? a?.member_evaluations[0].memberId
                        : null,
            }));
            // console.log(reports)
            setAgendaReport(reports);
            return reports;
        },
        staleTime: 5 * 60 * 1000,
    });
}

export function useCanUserCreateReport(meetingId: string) {
    return useQuery({
        queryKey: ["can-user-create-report", meetingId],
        queryFn: async () => {
            const { data } = await api.get(
                `/agenda-report/can-edit/${meetingId}`,
            );
            return data.data;
        },
        enabled: !!meetingId,
    });
}

export function useCreateReport(meetingId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: AgendaReportPayload) => {
            const { data } = await api.post<ClubResponse>(
                `/agenda-report/${meetingId}`,
                input,
            );
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["can-user-create-report", meetingId],
            });
            reactToast.success("Report Created Successfully");
        },
        onError: (error) => {
            reactToast.error("Unable to create report");
            console.error("Failed to create club:", getErrorMessage(error));
        },
    });
}
