import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { uc } from "@/app/di";
import { useAuth } from "@/auth/auth-store";
import { buildBaseMenu } from "@/domain/types/sidebar";
import { filterMenuByRoles } from "@/controllers/sidebar.controller";
import { AppSidebarView } from "@/views/sidebar/AppSidebar.view";
import { Folder, Shield } from "lucide-react";

export function AppSidebarPresenter() {
  const nav = useNavigate();
  const { userId, logout } = useAuth();
  const { data: me } = useQuery({
    queryKey: ["me"],
    queryFn: uc.auth.getMe,
    staleTime: 5 * 60 * 1000,
    enabled: !!userId,
  });

  const base = buildBaseMenu();
  // Hydrate icons here, keeping domain/UI decoupled
  const withIcons = base.map((i) => {
    if (i.title === "Catalogs") return { ...i, icon: Folder };
    if (i.title === "Admin") return { ...i, icon: Shield };
    return i;
  });

  const items = filterMenuByRoles(withIcons, me?.roles ?? []);

  return (
    <AppSidebarView
      items={items}
      userId={userId}
      onNavigate={nav}
      onLogout={logout}
    />
  );
}
