import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebarPresenter } from "@/presenters/sidebar/AppSidebar.presenter";

export function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebarPresenter />
      <main className="flex-1">
        <div className="p-4">
          <SidebarTrigger />
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}
