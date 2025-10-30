import { type Role } from "@/domain/types/auth";
import type { ComponentType, SVGProps } from "react";
export type IconType = ComponentType<SVGProps<SVGSVGElement>>;

export interface MenuItem {
  title: string;
  url: string;
  icon: IconType;
  roles?: Role[]; // if undefined => visible to any authenticated user
}
