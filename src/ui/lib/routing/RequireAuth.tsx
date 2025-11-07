// src/auth/RequireAuth.tsx
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/application/auth/auth-store";

interface Props {
  children: ReactNode;
}

export function RequireAuth({ children }: Props) {
  const { token } = useAuth();
  const loc = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: loc }} />;
  }
  return <>{children}</>;
}
