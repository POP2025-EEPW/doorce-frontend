import { create } from "zustand";

interface AuthState {
  username: string | null;
  token: string | null;
  login: (token: string, username: string) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  username: localStorage.getItem("username"),
  token: localStorage.getItem("token"),

  login: (token, username) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    set({ username, token });
  },
  logout: () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    set({ username: null, token: null });
  },
}));
