import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { uc } from "@/app/di";

type Props = { children: ReactNode; anyOf: string[] };

export function RoleGuard({ children, anyOf }: Props) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["me"],
    queryFn: uc.auth.getMe,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return <div>Loading…</div>;
  if (error || !data) return <div>Error</div>;

  const has = data.roles.some((r) => anyOf.includes(r));
  if (!has) return <div>Not allowed</div>;

  return <>{children}</>;
}
