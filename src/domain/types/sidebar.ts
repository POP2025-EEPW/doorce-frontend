import type { ComponentType } from "react";

export type Role = "Admin" | "MetadataManager" | "DataQualityManager" | string;

export type MenuItem = {
  title: string;
  url: string;
  icon: ComponentType<any>;
  roles?: Role[]; // if undefined => visible to any authenticated user
};

export function buildBaseMenu(): MenuItem[] {
  // Icons are provided by callers to keep domain pure if desired.
  // In this project we pass lucide-react icons from presenter.
  return [
    // Presenter will hydrate icons
    { title: "Catalogs", url: "/catalogs", icon: (() => null) as any },
    {
      title: "Admin",
      url: "/admin",
      icon: (() => null) as any,
      roles: ["Admin"],
    },
  ];
}
