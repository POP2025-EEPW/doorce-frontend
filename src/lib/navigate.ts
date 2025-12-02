import { useNavigate } from "react-router-dom";
import type { Role } from "@/domain/auth/auth.type";

export function navigateToRole(
  roles: Role[],
  navigate: ReturnType<typeof useNavigate>,
) {
  if (roles[0] === "MetadataManager") {
    navigate("/schemas");
  } else if (roles[0] === "DataSupplier" || roles[0] === "DataQualityManager") {
    navigate("/datasets");
  } else if (roles[0] === "DataUser") {
    navigate("/catalog");
  } else {
    navigate("/");
  }
}
