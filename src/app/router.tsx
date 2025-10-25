import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { RequireAuth } from "@/auth/RequireAuth";
import { LoginPresenter } from "@/presenters/auth/Login.presenter";
import { CatalogsPresenter } from "@/presenters/catalogs/Catalogs.presenter";
import { CatalogDetailPresenter } from "@/presenters/catalogs/CatalogDetail.presenter";
import { DatasetDetailPresenter } from "@/presenters/datasets/DatasetDetail.presenter";
import { AppLayout } from "@/app/Layout";

const router = createBrowserRouter([
  { path: "/login", element: <LoginPresenter /> },
  {
    path: "/",
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="catalogs" replace /> },
      { path: "catalogs", element: <CatalogsPresenter /> },
      { path: "catalogs/:id", element: <CatalogDetailPresenter /> },
      { path: "datasets/:id", element: <DatasetDetailPresenter /> },
    ],
  },
  { path: "*", element: <LoginPresenter /> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
