import { type MenuItem } from "./sidebar.type";
import { Folder, Table, Boxes, MessageSquare, Users } from "lucide-react";

export const MENU_ITEMS: MenuItem[] = [
  {
    title: "Catalogs",
    url: "/catalogs",
    icon: Folder,
    roles: ["DataUser", "MetadataManager"],
  },
  {
    title: "Datasets",
    url: "/datasets",
    icon: Table,
    roles: ["DataSupplier", "DataQualityManager"],
  },
  {
    title: "Schemas",
    url: "/schemas",
    icon: Boxes,
    roles: ["MetadataManager"],
  },
  {
    title: "Data Related Requests",
    url: "/datasets/requests",
    icon: MessageSquare,
  },
  {
    title: "Agents",
    url: "/agents",
    icon: Users,
    roles: ["MetadataManager"],
  },
];
