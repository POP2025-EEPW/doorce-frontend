import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as AuthController from "@/controllers/auth.controller";
import { LoginView } from "@/views/auth/Login.view";

export function LoginPresenter() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();
  const loc = useLocation();
  const from = (loc.state as any)?.from?.pathname ?? "/catalogs";

  async function handleSubmit() {
    const u = username.trim();
    const p = password;
    if (!u || !p) return;
    await AuthController.login(u, p);
    nav(from, { replace: true });
  }

  return (
    <LoginView
      username={username}
      password={password}
      onChangeUsername={setUsername}
      onChangePassword={setPassword}
      onSubmit={handleSubmit}
    />
  );
}
