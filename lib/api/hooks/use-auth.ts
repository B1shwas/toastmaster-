import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  LoginFormData,
  SignupFormData,
  UpdateProfileData,
  ChangePasswordData,
  ProfileData,
} from "@/lib/schemas/auth.schema";
import { ResponseFormat } from "../../types/response.format";
import { useAuthStore } from "@/lib/stores/useAuthStore";

interface LoginResponse {
  token: string;
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginFormData) => {
      const { data } = await api.post<ResponseFormat<LoginResponse>>(
        "/auth/login",
        credentials
      );
      return data.data;
    },
    onSuccess: (data) => {
      useAuthStore.getState().setAuth(data.token, null);
      queryClient.clear();
    },
  });
}

export function useSignup() {
  return useMutation({
    mutationFn: async (
      input: Omit<SignupFormData, "confirmPassword" | "agreeToTerms">
    ) => {
      await api.post("/user/register", input);
      return true;
    },
  });
}

// i don't have created a logupt api in backend as jwt are stateless, so handling by just removing the token from ls
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => true,
    onSuccess: () => {
      useAuthStore.getState().clearAuth();
      queryClient.clear();
      if (typeof window !== "undefined") window.location.href = "/auth";
    },
  });
}
export function useProfile() {
  const token = useAuthStore((s) => s.token);
  const setAuth = useAuthStore((s) => s.setAuth);

  return useQuery({
    queryKey: ["profile"],
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,

    queryFn: async () => {
      const { data } = await api.get<ResponseFormat<ProfileData>>("/user/me");

      const payload = data.data;

      setAuth(token, {
        name: payload.user_full_name,
        email: payload.user_email,
        id: payload.user_id,
        clubCount:
          (payload.member_of?.length ?? 0) +
          (payload.admin_of?.length ?? 0) +
          (payload.owned_clubs?.length ?? 0),
      });

      return payload;
    },
  });
}
export function useUserClub() {
  return useQuery({
    queryKey: ["user-clubs"],
    queryFn: async () => {
      const { data } = await api.get<ResponseFormat<any>>("/user/my-clubs");
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation<
    ProfileData,
    Error,
    UpdateProfileData
  >({
    mutationFn: async (input) => {
      const { data } = await api.patch<ResponseFormat<ProfileData>>("/user/me", input);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["clubs", "detail"], exact: false });
    },
  });
}

export function useChangePassword() {
  return useMutation<
    { success: boolean },
    Error,
    ChangePasswordData
  >({
    mutationFn: async (input) => {
      const { data } = await api.patch<ResponseFormat<{ success: boolean }>>("/user/me/password", input);
      return data.data;
    },
  });
}
