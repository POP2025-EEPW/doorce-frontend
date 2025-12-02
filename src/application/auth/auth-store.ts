import { create } from "zustand";
import type { Role } from "@/domain/auth/auth.type";

interface AuthState {
  username: string | null;
  token: string | null;
  roles: Role[];
  login: (token: string, username: string, roles: Role[]) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  username: localStorage.getItem("username"),
  token: localStorage.getItem("token"),
  roles: localStorage.getItem("roles")
    ? JSON.parse(localStorage.getItem("roles") ?? "[]")
    : [],

  login: (token, username, roles) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("roles", JSON.stringify(roles));
    set({ username, token, roles });
  },
  logout: () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    set({ username: null, token: null });
  },
}));
