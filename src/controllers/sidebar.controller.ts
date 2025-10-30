import type { MenuItem } from "@/lib/types/sidebar";
import type { Role } from "@/domain/types/auth";

export function filterMenuByRoles(
  items: MenuItem[],
  roles: Role[],
): MenuItem[] {
  const isAdmin = roles.includes("Admin");
  return items.filter(
    (it) => !it.roles || isAdmin || it.roles.some((r) => roles.includes(r)),
  );
}
