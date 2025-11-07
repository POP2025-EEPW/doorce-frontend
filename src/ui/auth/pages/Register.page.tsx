import { useAuthController } from "@/application/auth/auth.controller";
import { RegisterView } from "../components/Register.view";
import { roles } from "@/domain/auth/auth.const";

export default function RegisterPage() {
  const { register: registerUser } = useAuthController();

  return <RegisterView rolesOptions={roles} onRegister={registerUser} />;
}
