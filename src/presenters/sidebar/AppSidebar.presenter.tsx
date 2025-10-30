import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import * as AuthController from "@/controllers/auth.controller";
import { useAuth } from "@/auth/auth-store";
import { type Role } from "@/domain/types/auth";
import { filterMenuByRoles } from "@/controllers/sidebar.controller";
import { AppSidebarView } from "@/views/sidebar/AppSidebar.view";
import { MENU_ITEMS } from "@/lib/const/sidebar";

export function AppSidebarPresenter() {
  const nav = useNavigate();
  const { userId, logout } = useAuth();

  const { data: me } = useQuery({
    queryKey: ["me"],
    queryFn: AuthController.getMe,
    staleTime: 5 * 60 * 1000,
    enabled: !!userId,
  });

  const items = filterMenuByRoles(MENU_ITEMS, (me?.roles as Role[]) ?? []);

  return (
    <AppSidebarView
      items={items}
      userId={userId}
      onNavigate={nav}
      onLogout={logout}
    />
  );
}
