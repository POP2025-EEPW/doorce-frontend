import { type Role } from "@/domain/auth/auth.type";
import type { ComponentType, SVGProps } from "react";
export type IconType = ComponentType<SVGProps<SVGSVGElement>>;

export interface MenuItem {
  title: string;
  url: string;
  icon: IconType;
  roles?: Role[]; // if undefined => visible to any authenticated user
}
