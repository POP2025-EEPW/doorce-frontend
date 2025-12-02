import { type MenuItem } from "./sidebar.type";
import { Folder, Table, Boxes, MessageSquare } from "lucide-react";

export const MENU_ITEMS: MenuItem[] = [
  {
    title: "Catalogs",
    url: "/catalogs",
    icon: Folder,
    roles: ["DataUser"],
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
];
