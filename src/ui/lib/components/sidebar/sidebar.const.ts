import { type MenuItem } from "./sidebar.type";
import { Folder, Table, Boxes, BadgeCheck } from "lucide-react";

export const MENU_ITEMS: MenuItem[] = [
  {
    title: "Catalogs",
    url: "/catalogs",
    icon: Folder,
    roles: ["MetadataManager"],
  },
  {
    title: "Datasets",
    url: "/datasets",
    icon: Table,
    roles: ["DataSupplier"],
  },
  {
    title: "Schemas",
    url: "/schemas",
    icon: Boxes,
    roles: ["MetadataManager"],
  },
  {
    title: "Quality Controll",
    url: "/quality-controll/datasets",
    icon: BadgeCheck,
    roles: ["DataQualityManager"],
  },
];
