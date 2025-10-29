import type { MenuItem, Role } from "@/domain/types/sidebar";

export function filterMenuByRoles(
  items: MenuItem[],
  roles: Role[],
): MenuItem[] {
  const isAdmin = roles.includes("Admin");
  return items.filter(
    (it) => !it.roles || isAdmin || it.roles.some((r) => roles.includes(r)),
  );
}
