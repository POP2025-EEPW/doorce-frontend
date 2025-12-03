import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { RequireAuth } from "@/ui/lib/routing/RequireAuth";
import { AppLayout } from "@/app/Layout";
import LoginPage from "@/ui/auth/pages/Login.page";
import CatalogPage from "@/ui/catalog/pages/Catalog.page";
import RegisterPage from "@/ui/auth/pages/Register.page";
import DatasetDescriptionPage from "@/ui/dataset/pages/DatasetDescriptionPage.tsx";
import { DatasetsPage } from "@/ui/dataset/pages/DatasetsPage.tsx";

const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/",
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="catalog" replace /> },
      {
        path: "catalog/",
        element: <CatalogPage />,
        children: [{ path: ":id", element: <CatalogPage /> }],
      },
      {
        path: "schemas",
        element: <></>,
      },
      {
        path: "datasets",
        element: <DatasetsPage />,
      },
      {
        path: "dataset/:id",
        element: <DatasetDescriptionPage />,
      },
      // { path: "dataset/add", element: <DatasetsPresenter /> },
      // {
      //   path: "quality-controll/datasets",
      //   element: <QualityControllableDatasetsPresenter />,
      // },
      // { path: "datasets/:id/edit", element: <DatasetEditPresenter /> },
    ],
  },
  { path: "*", element: <LoginPage /> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
