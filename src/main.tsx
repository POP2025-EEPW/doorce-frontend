import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { ROUTES } from "@/consts/routes";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root container #root not found");

createRoot(rootEl).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<App />} />
      </Routes>
    </HashRouter>
  </StrictMode>
);
