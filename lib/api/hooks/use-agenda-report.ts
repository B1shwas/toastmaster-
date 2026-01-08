import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, getErrorMessage } from "@/lib/api";
import useAuthStore from "@/lib/stores/useAuthStore";
import { CreateClubInput } from "@/lib/schemas/club.schema";
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
                agenda_id: a?.agenda_id,
                club_id: a?.club_id,
                meeting_id: a?.meeting_id,
                report_type: a?.report_type,
                word_of_the_day: a?.word_of_the_day ? a?.word_of_the_day : null,
                word_of_the_day_definition: a?.word_of_the_day_definition
                    ? a?.word_of_the_day_definition
                    : null,
                grammar_notes: a?.grammar_notes ? a?.grammar_notes : null,
                overall_notes: a?.overall_notes ? a?.overall_notes : null,
                member_evaluation:
                    a?.member_evaluations?.length > 0
                        ? a?.member_evaluations
                        : null,
                filler_word_counts:
                    a?.filler_word_counts?.length > 0
                        ? a?.filler_word_counts
                        : null,
                member_id:
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
        queryKey: ["can-user-create-report",meetingId],
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
    // const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: AgendaReportPayload) => {
            const { data } = await api.post<ClubResponse>(
                `/agenda-report/${meetingId}`,
                input,
            );
            return data.data;
        },
        onSuccess: () => {
            reactToast.success("Report Created Successfully");
        },
        onError: (error) => {
            reactToast.error("Unable to create report");
            console.error("Failed to create club:", getErrorMessage(error));
        },
    });
}
