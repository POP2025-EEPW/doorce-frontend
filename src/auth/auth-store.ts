import { create } from "zustand";

interface AuthState {
  userId: string | null;
  login: (userId: string) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  userId: localStorage.getItem("userId"),
  login: (userId) => {
    localStorage.setItem("userId", userId);
    set({ userId });
  },
  logout: () => {
    localStorage.removeItem("userId");
    set({ userId: null });
  },
}));
