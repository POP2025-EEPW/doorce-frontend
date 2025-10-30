import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { RequireAuth } from "@/auth/RequireAuth";
import { LoginPresenter } from "@/presenters/auth/Login.presenter";
import { CatalogsPresenter } from "@/presenters/catalogs/Catalogs.presenter";
import { CatalogDetailsPresenter } from "@/presenters/catalogs/CatalogDetails.presenter";
import { DatasetDetailsPresenter } from "@/presenters/datasets/DatasetDetails.presenter";
import { DatasetsPresenter } from "@/presenters/datasets/Datasets.presenter";
import { QualityControllableDatasetsPresenter } from "@/presenters/datasets/QualityControllableDatasets.presenter";
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
      { path: "catalogs/:id", element: <CatalogDetailsPresenter /> },
      { path: "datasets/:id", element: <DatasetDetailsPresenter /> },
      { path: "datasets", element: <DatasetsPresenter /> },
      { path: "dataset/add", element: <DatasetsPresenter /> },
      {
        path: "quality-controll/datasets",
        element: <QualityControllableDatasetsPresenter />,
      },
    ],
  },
  { path: "*", element: <LoginPresenter /> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
