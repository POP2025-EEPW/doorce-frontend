import type { MenuItem } from "@/domain/types/sidebar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export function AppSidebarView({
  items,
  userId,
  onNavigate,
  onLogout,
}: {
  items: MenuItem[];
  userId: string | null;
  onNavigate: (url: string) => void;
  onLogout: () => void;
}) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a onClick={() => onNavigate(item.url)}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-between gap-2 px-2">
          <span className="text-sm text-muted-foreground truncate">
            {userId ?? "Guest"}
          </span>
          {userId && (
            <Button variant="ghost" size="sm" onClick={onLogout}>
              Logout
            </Button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
