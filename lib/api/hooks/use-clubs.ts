import useAuthStore from "@/lib/stores/useAuthStore";
import {
	useQuery,
	useMutation,
	useQueryClient,
	keepPreviousData,
} from "@tanstack/react-query";
import { api, getErrorMessage } from "@/lib/api";
import type {
	Club,
	ClubMember,
	ClubResponse,
	ClubMembersResponse,
	ClubStats,
  PendingClubGroup,
  ApiResponsePendingClubGroup,
} from "@/lib/types/club";
import type {
	AddMemberInput,
	CreateClubInput,
	JoinClubInput,
} from "@/lib/schemas/club.schema";
import { toast as reactToast } from "react-hot-toast";
import { AxiosError } from "axios";

export const clubKeys = {
	all: ["clubs"] as const,
	lists: () => [...clubKeys.all, "list"] as const,
	list: (page: number, limit: number) =>
		[...clubKeys.lists(), page, limit] as const,
	details: () => [...clubKeys.all, "detail"] as const,
	detail: (id: string) => [...clubKeys.details(), id] as const,
	members: (clubId: string) => [...clubKeys.detail(clubId), "members"] as const,
	stats: (clubId: string) => ["club-stats", clubId] as const,
	role: (clubId: string, userId: string) =>
		["club-role", clubId, userId] as const,
	code: (clubId: string) => ["club-code", clubId] as const,
};

export function useClubs(page = 1, limit = 8) {
	return useQuery({
		queryKey: clubKeys.list(page, limit),
		queryFn: async () => {
			const { data } = await api.get<{ data: Club[] }>("/club/all/list", {
				params: { page, limit },
			});
			return data.data;
		},
		placeholderData: keepPreviousData,
		staleTime: 5 * 60 * 1000,
	});
}

export function useClub(id: string) {
	return useQuery({
		queryKey: clubKeys.detail(id),
		queryFn: async () => {
			const { data } = await api.get<ClubResponse>(`/club/${id}`);
			return data.data;
		},
		enabled: !!id,
	});
}

export function useClubMembers(clubId: string) {
	return useQuery({
		queryKey: clubKeys.members(clubId),
		queryFn: async () => {
			const { data } = await api.get<{ data: ClubMember[] }>(
				`/club/${clubId}/members`
			);
			return data.data;
		},
		enabled: !!clubId,
	});
}

export function useCreateClub() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (input: CreateClubInput) => {
			const { data } = await api.post<ClubResponse>("/club/create", input);
			return data.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: clubKeys.lists(),
				exact: false,
			});
			queryClient.invalidateQueries({
				queryKey: ["user-clubs"],
				exact: false,
			});
		},
		onError: (error) => {
			console.error("Failed to create club:", getErrorMessage(error));
		},
	});
}

export function useJoinClub() {
	const queryClient = useQueryClient();
	const { user } = useAuthStore.getState();

	return useMutation({
		mutationFn: async (input: JoinClubInput) => {
			const { data } = await api.post<ClubResponse>("/club/join", input);
			return data.data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: clubKeys.lists(),
				exact: false,
			});
			queryClient.invalidateQueries({
				queryKey: ["user-clubs"],
				exact: false,
			});
			if (!!data && !!user?.id) {
				queryClient.invalidateQueries({
					queryKey: clubKeys.role(data.id, user.id),
				});
			}
		},
	});
}

export function useAddMember(clubId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (input: AddMemberInput) => {
			const { data } = await api.post<{ data: ClubMember }>(
				`/club/${clubId}/member/add`,
				input
			);
			return data.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: clubKeys.detail(clubId) });
			queryClient.invalidateQueries({ queryKey: clubKeys.members(clubId) });
			queryClient.invalidateQueries({ queryKey: clubKeys.stats(clubId) });
		},
		onError: (error) => {
			console.error("Failed to add member:", getErrorMessage(error));
		},
	});
}

export function useRemoveMember(clubId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (memberId: string) => {
			await api.delete(`/club/${clubId}/member/remove/${memberId}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: clubKeys.detail(clubId) });
			queryClient.invalidateQueries({ queryKey: clubKeys.members(clubId) });
		},
	});
}

export function useClubStats(clubId: string) {
	return useQuery({
		queryKey: clubKeys.stats(clubId),
		queryFn: async () => {
			const { data } = await api.get<{ data: ClubStats }>(`/club/stats`, {
				params: { clubId },
			});
			return data.data;
		},
		enabled: !!clubId,
	});
}

export function useClubRole(clubId: string, userId: string) {
	return useQuery({
		queryKey: clubKeys.role(clubId, userId),
		queryFn: async () => {
			const { data } = await api.get<{
				data: {
					member: boolean;
					role: "OWNER" | "ADMIN" | "MEMBER";
				};
			}>("/club/member/role", {
				params: { clubId, userId },
			});
			return data.data;
		},
		enabled: !!clubId && !!userId,
	});
}

export function useClubCode(clubId: string, enabled: boolean) {
	return useQuery({
		queryKey: clubKeys.code(clubId),
		queryFn: async () => {
			const { data } = await api.get<{ data: { code: string } }>("/club/code", {
				params: { clubId },
			});
			return data.data;
		},
		enabled: enabled && !!clubId,
	});
}

export function useRegenerateClubCode() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (clubId: string) => {
			const { data } = await api.post<{ data: { code: string } }>(
				"/club/code/regenerate",
				{},
				{ params: { clubId } }
			);
			return data.data;
		},
		onSuccess: (data, variables) => {
			queryClient.setQueryData(clubKeys.code(variables), data);
		},
		onError: (error) => {
			console.error("Failed to regenerate club code:", getErrorMessage(error));
		},
	});
}

export function useRequestJoinClub() {
	const queryClient = useQueryClient();
	const { user } = useAuthStore.getState();

	return useMutation({
		mutationFn: async (input: JoinClubInput) => {
			const { data } = await api.post<ClubResponse>("/club/request-join", input);
			return data.data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: clubKeys.lists(),
				exact: false,
			});
			queryClient.invalidateQueries({
				queryKey: ["user-clubs"],
				exact: false,
			});
			if (!!data && !!user?.id) {
				queryClient.invalidateQueries({
					queryKey: clubKeys.role(data.id, user.id),
				});
      }
      reactToast.success("Your Request to join club Successfully Send.")
    },
    onError: (error) => {
      const axiosError = error as AxiosError<any>;
      const message =
          axiosError.response?.data?.error?.message ??
          "Something went wrong. Please try again.";
      
      reactToast.error(message);
    }
	});
}

export function useGetPendingRequest() {
	return useQuery({
		queryKey: ['club-join-pending-request'],
		queryFn: async () => {
			const { data } = await api.get<ApiResponsePendingClubGroup>(`/club/request-join`);
			return data.data ?? [];
		},
		retry: false,
	});
}

export function usePendingRequestDecision() {
	const queryClient = useQueryClient();
	const { user } = useAuthStore.getState();

	return useMutation({
  mutationFn: async (input: {clubId:string,memberId:string, decision:boolean}) => {
    const { data } = await api.patch("/club/request-join", input);
    return data.data;
  },
  onSuccess: (response) => {
    queryClient.invalidateQueries({
      queryKey: clubKeys.lists(),
      exact: false,
    });
    queryClient.invalidateQueries({
      queryKey: ["club-join-pending-request"],
      exact: false,
    });
    
    const clubData = response.data;
    if (!!clubData && !!user?.id) {
      queryClient.invalidateQueries({
        queryKey: clubKeys.role(clubData.id, user.id),
      });
    }
    console.log(response)
    const message = response.message ?? "Club join request processed successfully.";
    reactToast.success(message);
  },
  onError: (error) => {
    const axiosError = error as AxiosError<any>;
    const message =
      axiosError.response?.data?.error?.message ??
      "Something went wrong. Please try again.";

    reactToast.error(message);
  },
});
}

export function useUserClubStatus() {
	return useQuery({
		queryKey: ['user-club-status'],
		queryFn: async () => {
			const { data } = await api.get<{data:{clubId:string,status:string}[]}>(`/club/user-status`);
			return data.data;
		},
	});
}
