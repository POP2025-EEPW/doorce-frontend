import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/ui/lib/components/ui/sidebar";
import { SidebarView } from "@/ui/lib/components/sidebar/Sidebar.view";
import { useAuth } from "@/application/auth/auth-store";
import { useAuthController } from "@/application/auth/auth.controller";

export function AppLayout() {
  const { username } = useAuth();
  const { logout } = useAuthController();
  return (
    <SidebarProvider>
      <SidebarView username={username} onLogout={logout} />
      <Outlet />
    </SidebarProvider>
  );
}
