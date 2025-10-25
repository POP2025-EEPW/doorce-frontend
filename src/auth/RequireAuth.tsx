// src/auth/RequireAuth.tsx
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/auth-store";

interface Props {
  children: ReactNode;
}

export function RequireAuth({ children }: Props) {
  const { userId } = useAuth();
  const loc = useLocation();

  if (!userId) {
    return <Navigate to="/login" replace state={{ from: loc }} />;
  }
  return <>{children}</>;
}
