import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  Meeting,
  MeetingResponse,
  MeetingsResponse,
} from "@/lib/types/meeting";

export const meetingKeys = {
  all: ["meetings"] as const,
  lists: () => [...meetingKeys.all, "list"] as const,
  listByClub: (clubId: string) => [...meetingKeys.lists(), { clubId }] as const,
  details: () => [...meetingKeys.all, "detail"] as const,
  detail: (id: string) => [...meetingKeys.details(), id] as const,
};

export function useMeetings(clubId: string) {
  return useQuery({
    queryKey: meetingKeys.listByClub(clubId),
    queryFn: async () => {
      const { data } = await api.get<MeetingsResponse>(
        `/clubs/${clubId}/meetings`
      );
      return data.data;
    },
    enabled: !!clubId,
  });
}

export function useMeeting(id: string) {
  return useQuery({
    queryKey: meetingKeys.detail(id),
    queryFn: async () => {
      const { data } = await api.get<MeetingResponse>(`/meetings/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

interface CreateMeetingInput {
  clubId: string;
  theme: string;
  date: string;
  startTime: string;
  venue: string;
  tmodNotes?: string;
}

export function useCreateMeeting(clubId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateMeetingInput) => {
      const { data } = await api.post<MeetingResponse>(
        `/clubs/${clubId}/meetings`,
        input
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: meetingKeys.listByClub(clubId),
      });
    },
  });
}

export function useUpdateMeeting(meetingId: string, clubId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: Partial<Meeting>) => {
      const { data } = await api.patch<MeetingResponse>(
        `/meetings/${meetingId}`,
        input
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: meetingKeys.detail(meetingId),
      });
      queryClient.invalidateQueries({
        queryKey: meetingKeys.listByClub(clubId),
      });
    },
  });
}

export function useDeleteMeeting(clubId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (meetingId: string) => {
      await api.delete(`/meetings/${meetingId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: meetingKeys.listByClub(clubId),
      });
    },
  });
}
