"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { LoginFormData, SignupFormData } from "@/lib/schemas/auth.schema";
import { ResponseFormat } from "../../types/response.format";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { useRouter } from "next/navigation";

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
    mutationFn: async (input: Omit<SignupFormData, "confirmPassword">) => {
      await api.post("/user/register", input);
      return true;
    },
  });
}

// i don't have created a logupt api in backend as jwt are stateless, so handling by just removing the token from ls
export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => true,
    onSuccess: () => {
      useAuthStore.getState().clearAuth();
      queryClient.clear();
      router.push("/auth");
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
      const { data } = await api.get<ResponseFormat<any>>("/user/me");

      console.log(data.data);

      setAuth(token, {
        name: data.data.user_full_name,
        email: data.data.user_email,
        id: data.data.user_id,
        clubCount:
          (data.data.member_of?.length ?? 0) +
          (data.data.admin_of?.length ?? 0) +
          (data.data.owned_clubs?.length ?? 0),
      });

      return data.data;
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
