import { create } from "zustand";
import { REPORT } from "../types/agendaReport";

type User = any;

type AuthState = {
  token: string | null;
  user: User | null;
  setAuth: (token: string | null, user?: User | null) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
  userClubs?: any[];
<<<<<<< HEAD
  upcomingMeetings?: any[];
=======
    agendaReport?: REPORT[];
    setAgendaReport: (report: REPORT[]) => void;
>>>>>>> feature/grammerian-ah_counter
};

const getInitialToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

export const useAuthStore = create<AuthState>((set, get) => ({
  token: getInitialToken(),
  user: null,
  setAuth: (token, user = null) => {
    if (typeof window !== "undefined") {
      if (token) localStorage.setItem("token", token);
      else localStorage.removeItem("token");
    }
    set({ token, user });
  },
  clearAuth: () => {
    if (typeof window !== "undefined") localStorage.removeItem("token");
    set({ token: null, user: null });
  },
  isAuthenticated: () => Boolean(get().token),
  
  
  agendaReport : [],
  setAgendaReport: (reports: REPORT[]) => {
      set({ agendaReport: reports });
  },
}));

export default useAuthStore;
