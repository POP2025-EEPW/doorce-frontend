"use client";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/lib/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { MENU_ITEMS } from "./sidebar.const";
import BrowseDataRelatedRequestsModal from "@/ui/dataset/components/BrowseDataRelatedRequests.view";
import SubmitDataRelatedRequestModal from "@/ui/dataset/components/SubmitDataRelatedRequest.view";
import { useState } from "react";
import type { Role } from "@/domain/auth/auth.type";

interface SidebarViewProps {
  username: string | null;
  roles: Role[];
  onLogout: () => void;
}

export function SidebarView(props: SidebarViewProps) {
  const { username, roles, onLogout } = props;
  const nav = useNavigate();
  const [openBrowseRequestsModal, setOpenBrowseRequestsModal] = useState(false);
  const [openSubmitRequestsModal, setOpenSubmitRequestsModal] = useState(false);
  const [requestsDatasetId, setRequestsDatasetId] = useState<string | null>(
    null,
  );

  return (
    <>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {MENU_ITEMS.filter((item) =>
                  item.roles
                    ? item.roles.some((role) => roles.includes(role))
                    : true,
                ).map((item) => (
                  <SidebarMenuItem key={item.title}>
                    {item.url === "/datasets/requests" ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <SidebarMenuButton>
                            <item.icon />
                            <span>{item.title}</span>
                          </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="right" align="start">
                          <DropdownMenuItem
                            onSelect={() => setOpenBrowseRequestsModal(true)}
                          >
                            Browse
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => setOpenSubmitRequestsModal(true)}
                          >
                            Submit
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <SidebarMenuButton asChild>
                        <a
                          onClick={() => nav(item.url)}
                          className="flex items-center gap-2"
                        >
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    )}
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
      </Sidebar>

      {openBrowseRequestsModal && (
        <BrowseDataRelatedRequestsModal
          datasetId={requestsDatasetId}
          onDatasetIdChange={setRequestsDatasetId}
          onClose={() => setOpenBrowseRequestsModal(false)}
          onOpenSubmit={() => {
            setOpenBrowseRequestsModal(false);
            setOpenSubmitRequestsModal(true);
          }}
        />
      )}

      {openSubmitRequestsModal && (
        <SubmitDataRelatedRequestModal
          datasetId={requestsDatasetId}
          onDatasetIdChange={setRequestsDatasetId}
          onClose={() => setOpenSubmitRequestsModal(false)}
          onSubmitted={() => {
            setOpenSubmitRequestsModal(false);
            setOpenBrowseRequestsModal(true);
          }}
        />
      )}
    </>
  );
}
