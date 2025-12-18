import useAuthStore from "../stores/useAuthStore";

export function useAuth() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  console.log(token, user);

  return {
    user,
    isAuthenticated: Boolean(token),
    isLoading: token && !user, // important
  };
}
