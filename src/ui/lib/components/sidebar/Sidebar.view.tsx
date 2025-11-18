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
} from "@/ui/lib/components/ui/sidebar";
import { Button } from "@/ui/lib/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MENU_ITEMS } from "./sidebar.const";
import AddDataRelatedRequestModal from "@/ui/dataset/components/AddDataRelatedRequest.view";

interface SidebarViewProps {
  username: string | null;
  onLogout: () => void;
}

export function SidebarView(props: SidebarViewProps) {
  const { username, onLogout } = props;
  const nav = useNavigate();
  const [openDataRequestModal, setOpenDataRequestModal] = useState(false);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {MENU_ITEMS.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      onClick={() =>
                        item.url === "/datasets/requests"
                          ? setOpenDataRequestModal(true)
                          : nav(item.url)
                      }
                      className="flex items-center gap-2"
                    >
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
            {username ?? "Guest"}
          </span>
          {username && (
            <Button variant="ghost" size="sm" onClick={onLogout}>
              Logout
            </Button>
          )}
        </div>
      </SidebarFooter>
      {openDataRequestModal && (
        <AddDataRelatedRequestModal
          onClose={() => setOpenDataRequestModal(false)}
        />
      )}
    </Sidebar>
  );
}
