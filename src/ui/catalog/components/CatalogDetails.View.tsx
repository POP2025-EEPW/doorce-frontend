import type { Catalog, CreateCatalogDto } from "@/domain/catalog/catalog.type";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/ui/lib/components/ui/card";
import type { DatasetSummary } from "@/domain/dataset/dataset.types";
import type { CatalogSummary } from "@/domain/catalog/catalog.type";
import { Separator } from "@/ui/lib/components/ui/separator";
import { CatalogListView } from "./CatalogList.view";
import { DatasetListView } from "@/ui/dataset/components/DatasetList.view";
import { AddCatalogFormView } from "./AddCatalogForm.view";
import { SidebarTrigger } from "@/ui/lib/components/ui/sidebar";
import { Button } from "@/ui/lib/components/ui/button.tsx";
import { ChevronLeft } from "lucide-react";
import type { Role } from "@/domain/auth/auth.type.ts";

interface CatalogDetailsViewProps {
  catalog: Catalog | null;
  catalogs: CatalogSummary[];
  datasets: DatasetSummary[];

  isCatalogLoading: boolean;
  isCatalogsLoading: boolean;
  isDatasetsLoading: boolean;

  setSelectedCatalogId: (catalogId: string) => void;
  onAddCatalogClick: (catalog: CreateCatalogDto) => void;
  onNavigateToParent: () => void;
  onDatasetSelected?: (datasetId: DatasetSummary["id"]) => void;

  canDownloadDataset?: boolean;

  userRoles: Role[];
}

export default function CatalogDetailsView(props: CatalogDetailsViewProps) {
  const {
    catalog,
    catalogs,
    datasets,

    isCatalogLoading,
    isCatalogsLoading,
    isDatasetsLoading,

    setSelectedCatalogId,
    onAddCatalogClick,
    onNavigateToParent,
    onDatasetSelected,
    canDownloadDataset,

    userRoles,
  } = props;

  const canGoBack = catalog !== null;

  const canAddCatalog = userRoles.includes("MetadataManager");
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        {canGoBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onNavigateToParent}
            aria-label="Go to parent catalog"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            <SidebarTrigger /> Catalog
          </h2>
          <div className="text-sm text-muted-foreground">{catalog?.title}</div>
        </div>
      </div>

      {isCatalogLoading && catalog === null ? (
        <div>Loading...</div>
      ) : catalog === null ? (
        <></>
      ) : (
        <Card className="max-w-3xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl leading-none">
              {catalog?.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-muted-foreground">
              {catalog?.description ?? "No description provided."}
            </div>
            {/*Wywalam to bo w danych z backendu nie ma zapisanego co jest rodzicem*/}
            {/*<div className="flex flex-wrap items-center gap-2 text-sm">*/}
            {/*  <span className="text-muted-foreground">Parent:</span>*/}
            {/*  {catalog.parentCatalogId ? (*/}
            {/*    <Badge variant="secondary" className="font-mono">*/}
            {/*      {catalog.parentCatalogId}*/}
            {/*    </Badge>*/}
            {/*  ) : (*/}
            {/*    <Badge variant="outline">Root catalog</Badge>*/}
            {/*  )}*/}
            {/*</div>*/}

            <div className="text-xs text-muted-foreground">
              ID: <span className="font-mono">{catalog.id}</span>
            </div>
          </CardContent>
          <Separator />
        </Card>
      )}

      <h2 className="text-xl font-semibold tracking-tight">Catalogs</h2>

      {isCatalogsLoading && catalogs.length === 0 ? (
        <div>Loading...</div>
      ) : catalogs.length === 0 ? (
        <div>No catalogs found</div>
      ) : (
        <CatalogListView
          catalogs={catalogs}
          setSelectedCatalogId={setSelectedCatalogId}
        />
      )}

      {canAddCatalog && (
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle className="text-lg leading-none">
              Add {catalog === null ? "root catalog" : "subcatalog"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AddCatalogFormView onAddCatalogClick={onAddCatalogClick} />
          </CardContent>
        </Card>
      )}

      <Separator />

      <h2 className="text-xl font-semibold tracking-tight">Datasets</h2>

      {isDatasetsLoading &&
      (!Array.isArray(datasets) || datasets.length === 0) ? (
        <div>Loading...</div>
      ) : !Array.isArray(datasets) || datasets.length === 0 ? (
        <div>No datasets found</div>
      ) : (
        <DatasetListView
          datasets={datasets}
          onDatasetSelected={onDatasetSelected}
          canDownload={canDownloadDataset}
        />
      )}
    </div>
  );
}
