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

export function useMeetings(
  clubId: string,
  status?: string,
  startDate?: string,
  endDate?: string,
  page = 1,
  limit = 10
) {
  return useQuery({
    queryKey: meetingKeys.listByClub(clubId),
    queryFn: async () => {
      const { data } = await api.get<{ data: Meeting[] }>(
        `/meetings/club/${clubId}`,
        {
          params: { status, startDate, endDate, page, limit },
        }
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
      const { data } = await api.get<{ data: Meeting }>(`/meetings/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export interface CreateMeetingInput {
  meetingNo: number;
  theme: string;
  date: string; // ISO 8601 format
  time: string; // HH:MM:SS
  venue: string;
  clubId: string;
}

export function useCreateMeeting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateMeetingInput) => {
      const { data } = await api.post<{ data: Meeting }>(`/meetings`, input);
      return data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: meetingKeys.listByClub(data.clubId),
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

export function useUpdateMeetingStatus(meetingId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { status: string }) => {
      const { data } = await api.patch<{ data: Meeting }>(
        `/meetings/${meetingId}/status`,
        input
      );
      return data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: meetingKeys.detail(meetingId),
      });
      queryClient.invalidateQueries({
        queryKey: meetingKeys.listByClub(data.clubId),
      });
    },
  });
}

export function useUpdateMeetingNotes(meetingId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { notes: string }) => {
      const { data } = await api.patch<{ data: Meeting }>(
        `/meetings/${meetingId}/notes`,
        input
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: meetingKeys.detail(meetingId),
      });
    },
  });
}
