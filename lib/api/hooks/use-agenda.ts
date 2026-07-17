import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../axios";
import type {
  AgendaTemplate,
  CreateAgendaPayload,
  Agenda,
  RoleCount,
} from "@/lib/types/agenda";
import type { ApiResponse } from "@/lib/types/meeting";
import type { AgendaRole } from "@/lib/types/agenda";

export function useSystemTemplates() {
  return useQuery<ApiResponse<AgendaTemplate[]>>({
    queryKey: ["system-templates"],
    queryFn: async () => {
      const response = await api.get("/agenda-templates/system");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useClubTemplates(clubId: string) {
  return useQuery<ApiResponse<AgendaTemplate[]>>({
    queryKey: ["club-templates", clubId],
    queryFn: async () => {
      const response = await api.get(`/clubs/${clubId}/agenda-templates`);
      return response.data;
    },
    enabled: !!clubId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useMeetingAgendas(meetingId: string) {
  return useQuery<ApiResponse<Agenda[]>>({
    queryKey: ["meeting-agendas", meetingId],
    queryFn: async () => {
      const response = await api.get(`/agenda/meeting/${meetingId}`);
      return response.data;
    },
    enabled: !!meetingId,
  });
}

export function useCreateAgenda() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateAgendaPayload) => {
      const response = await api.post("/agenda/create", payload);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["meeting-agendas", variables.meetingId],
      });
    },
  });
}

export function useCreateAgendasBulk() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      clubId: string;
      meetingId: string;
      agendas: CreateAgendaPayload[];
    }) => {
      const response = await api.post(
        `/agenda/bulk-create?clubId=${payload.clubId}`,
        payload.agendas
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["meeting-agendas", variables.meetingId],
      });
    },
  });
}

export function useDeleteAllAgendas(meetingId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.delete(`/agenda/meeting/${meetingId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["meeting-agendas", meetingId],
      });
    },
  });
}

export function useUpdateAgenda(meetingId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      id: string;
      data: Partial<CreateAgendaPayload>;
    }) => {
      const response = await api.patch(`/agenda/${payload.id}`, payload.data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["meeting-agendas", meetingId],
      });
    },
  });
}

export function useDeleteAgenda(meetingId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { agendaId: string; clubId: string }) => {
      const response = await api.delete(
        `/agenda/${payload.agendaId}?clubId=${payload.clubId}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["meeting-agendas", meetingId],
      });
    },
  });
}

export function useReorderAgendas(meetingId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { agendaIds: string[]; clubId: string }) => {
      const response = await api.patch(`/agenda/meeting/${meetingId}/reorder`, {
        agendaOrder: payload.agendaIds,
        clubId: payload.clubId,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["meeting-agendas", meetingId],
      });
    },
  });
}

export function useRoleCounts(clubId: string) {
  return useQuery<ApiResponse<RoleCount[]>>({
    queryKey: ["role-counts", clubId],
    queryFn: async () => {
      const response = await api.get(`/agenda/role-counts/club/${clubId}`);
      return response.data;
    },
    enabled: !!clubId,
  });
}

export function useAgendaRoles() {
  return useQuery<ApiResponse<AgendaRole[]>>({
    queryKey: ["agenda-roles"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<AgendaRole[]>>("/roles", {
        params: { category: "AGENDA" },
      });
      return response.data;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}
