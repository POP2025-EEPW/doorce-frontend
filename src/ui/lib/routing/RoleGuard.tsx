import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  anyOf: string[];
}

export function RoleGuard({ children, anyOf }: Props) {
  // TODO: Implement role guard BUT FIRST TALK WITH BACKEND

  console.log("anyOf", anyOf);

  return <>{children}</>;
}
