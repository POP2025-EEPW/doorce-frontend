import { uc } from "@/app/di";
import { useAuth } from "@/auth/auth-store";

export async function login(username: string, password: string) {
  const res = await uc.auth.login(username, password);
  useAuth.getState().login(res.userId);
  return res;
}

export async function getMe() {
  return uc.auth.getMe();
}
