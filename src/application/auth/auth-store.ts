import { create } from "zustand";
import type { Role } from "@/domain/auth/auth.type";
import type { ID } from "@/domain/common.types.ts";

interface AuthState {
  userId: ID | null;
  username: string | null;
  token: string | null;
  roles: Role[];
  login: (userId: ID, token: string, username: string, roles: Role[]) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  userId: localStorage.getItem("userId"),
  username: localStorage.getItem("username"),
  token: localStorage.getItem("token"),
  roles: localStorage.getItem("roles")
    ? JSON.parse(localStorage.getItem("roles") ?? "[]")
    : [],

  login: (userId, token, username, roles) => {
    localStorage.setItem("userId", userId);
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("roles", JSON.stringify(roles));
    set({ userId, username, token, roles });
  },
  logout: () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    localStorage.removeItem("roles");
    set({ userId: null, username: null, token: null, roles: [] });
  },
}));
