import { useAuthController } from "@/application/auth/auth.controller";
import { LoginView } from "../components/Login.view";
import { Navigate } from "react-router-dom";

export default function LoginPage() {
  const { login, isAuthenticated } = useAuthController();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <LoginView onLogin={login} />;
}
