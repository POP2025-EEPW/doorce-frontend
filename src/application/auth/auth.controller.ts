import { useCallback, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import AuthUseCase from "@/domain/auth/auth.uc";
import { apiClient } from "@/api/client";
import type { Role } from "@/domain/auth/auth.type";
import { useAuth } from "./auth-store";
import AuthPresenter from "./auth.presenter";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function useAuthController() {
  const {
    username,
    token,
    login: loginToStore,
    logout: logoutFromStore,
  } = useAuth();
  const navigate = useNavigate();
  const deps = useRef<{
    useCase: AuthUseCase;
    presenter: AuthPresenter;
  } | null>(null);
  deps.current ??= {
    useCase: new AuthUseCase(apiClient),
    presenter: new AuthPresenter(),
  };

  const { useCase, presenter } = deps.current;

  const loginMutation = useMutation({
    mutationFn: ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => useCase.login({ username, password }),
    onSuccess: (token, variables) => {
      // Persist returned token as userId for now; adjust when backend returns explicit userId
      loginToStore(token, variables.username);
      navigate("/");
    },
    onError: (error) => {
      toast.error(presenter.getErrorMessage(error));
    },
  });

  const registerMutation = useMutation({
    mutationFn: ({
      username,
      password,
      roles,
    }: {
      username: string;
      password: string;
      roles: Role[];
    }) => useCase.register({ username, password, roles }),
    onSuccess: (token, variables) => {
      // Auto-login after successful registration
      loginToStore(token, variables.username);
      navigate("/");
    },
    onError: (error) => {
      console.log("register error", error);
      toast.error(presenter.getErrorMessage(error));
      console.error("register error", error);
    },
  });

  const login = useCallback(
    (username: string, password: string) => {
      loginMutation.mutate({ username, password });
    },
    [loginMutation],
  );

  const register = useCallback(
    (username: string, password: string, roles: Role[]) => {
      registerMutation.mutate({ username, password, roles });
    },
    [registerMutation],
  );

  const logout = useCallback(() => {
    logoutFromStore();
  }, [logoutFromStore]);

  return {
    username,
    token,
    isAuthenticated: Boolean(username) && Boolean(token),

    login,
    logout,
    register,

    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
}
