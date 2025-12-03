import CatalogDetailsView from "../components/CatalogDetails.View";
import { useCatalogController } from "@/application/catalog/catalog.controller";
import { useParams } from "react-router-dom";
import { useAuth } from "@/application/auth/auth-store"; // <-- add this

export default function CatalogPage() {
  const { id } = useParams<{ id: string }>();
  const catalogId = id ?? null;
  const { roles } = useAuth(); // <-- add this

  const {
    catalogs,
    currentCatalog,
    currentDataset,
    isCatalogsLoading,
    isCurrentCatalogLoading,
    isCurrentDatasetLoading,

    setSelectedCatalogId,
    onAddCatalogClick,
    onNavigateToParent,
    onDatasetSelected,
  } = useCatalogController(catalogId);

  return (
    <main className="flex-1">
      <div className="p-4">
        <CatalogDetailsView
          catalog={currentCatalog}
          isCatalogLoading={isCurrentCatalogLoading}
          isCatalogsLoading={isCatalogsLoading}
          isDatasetsLoading={isCurrentDatasetLoading}
          catalogs={catalogs}
          datasets={currentDataset}
          setSelectedCatalogId={setSelectedCatalogId}
          onAddCatalogClick={onAddCatalogClick}
          onNavigateToParent={onNavigateToParent}
          onDatasetSelected={onDatasetSelected}
          userRoles={roles}
        />
      </div>
    </main>
  );
}
