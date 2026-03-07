import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { api, getErrorMessage } from "@/lib/api";
import type {
  Meeting,
  MeetingResponse,
  MeetingsResponse,
  Template,
} from "@/lib/types/meeting";
import { MeetingSessionForm } from "@/components/meeting/DuplicateAgenda";
import { toast as reactToast } from "react-hot-toast";

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
  limit = 10,
) {
  return useQuery({
    queryKey: meetingKeys.listByClub(clubId),
    queryFn: async () => {
      const { data } = await api.get<{ data: Meeting[] }>(
        `/meetings/club/${clubId}`,
        {
          params: { status, startDate, endDate, page, limit },
        },
      );
      return data.data;
    },
    enabled: !!clubId,
  });
}
export function useUpcomingMeetings() {
  return useQuery({
    queryKey: meetingKeys.lists(),
    queryFn: async () => {
      const { data } = await api.get<{ data: Meeting[] }>(`/meetings/upcoming`);
      return data.data;
    },
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
        { ...input, clubId },
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
        input,
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

export function useUpdateMeetingNotes() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      meetingId: string;
      notes: string;
      clubId: string;
    }) => {
      const { data } = await api.patch<{ data: Meeting }>(
        `/meetings/${input.meetingId}/notes`,
        { notes: input.notes, clubId: input.clubId },
      );
      return data.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: meetingKeys.detail(variables.meetingId),
      });
      queryClient.invalidateQueries({
        queryKey: meetingKeys.listByClub(variables.clubId),
      });
    },
  });
}

export function useDuplicateAgenda(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ["duplicate-agenda", page, limit],
    queryFn: async () => {
      const { data } = await api.get<{ data: Template }>(
        `/meetings/select-agenda?page=${page}&limit=${limit}`,
      );
      return data.data;
    },
    placeholderData: keepPreviousData,
  });
}

export function useCreateMeetingWithTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: MeetingSessionForm) => {
      const { data } = await api.post(`/meetings/create-with-templet`, input);
      return data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: meetingKeys.listByClub(data.clubId),
      });
      reactToast.success("Meeting Created Successfully With Template");
    },
    onError: (error) => {
        reactToast.error("Unable to create meeting with template");
        console.error("Failed to create meeting:", getErrorMessage(error));
    },
  });
}
