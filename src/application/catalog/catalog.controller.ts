import type {
  Catalog,
  CatalogSummary,
  CreateCatalogDto,
} from "@/domain/catalog/catalog.type";
import CatalogUseCase from "@/domain/catalog/catalog.uc";
import { useCallback, useEffect, useRef, useState } from "react";
import CatalogPresenter from "./catalog.presenter";
import { apiClient } from "@/api/client";
import type { DatasetSummary } from "@/domain/dataset/dataset.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function useCatalogController(catalogId: string | null) {
  const [catalogs, setCatalogs] = useState<CatalogSummary[]>([]);
  const navigate = useNavigate();
  const [currentCatalog, setCurrentCatalog] = useState<Catalog | null>(null);
  const [currentDataset, setCurrentDataset] = useState<DatasetSummary[]>([]);

  const deps = useRef<{
    useCase: CatalogUseCase;
    presenter: CatalogPresenter;
  } | null>(null);

  deps.current ??= {
    useCase: new CatalogUseCase(apiClient),
    presenter: new CatalogPresenter(),
  };

  const { useCase, presenter } = deps.current;
  const utils = useQueryClient();

  const { data: catalogsData, isLoading: isCatalogsLoading } = useQuery({
    queryKey: ["listCatalogs", catalogId],
    queryFn: () => useCase.listCatalogs(catalogId),
    select: (data) => presenter.listCatalogs(data),
  });

  useEffect(() => {
    if (catalogsData) {
      setCatalogs(catalogsData);
    }
  }, [setCatalogs, catalogsData]);

  const {
    data: currentCatalogData,
    isLoading: isCurrentCatalogLoading,
    error: catalogError,
  } = useQuery({
    queryKey: ["getCatalog", catalogId],
    queryFn: () => useCase.getCatalog({ catalogId: catalogId ?? "0" }),
    select: (data) => presenter.getCatalog(data),
    enabled: !!catalogId,
    retry: false,
  });

  useEffect(() => {
    if (catalogError) {
      toast.error(presenter.getErrorMessage(catalogError));
    }
  }, [catalogError, presenter]);

  useEffect(() => {
    if (currentCatalogData) {
      setCurrentCatalog(currentCatalogData);
    } else if (!catalogId) {
      setCurrentCatalog(null);
    }
  }, [currentCatalogData, catalogId, setCurrentCatalog]);

  const {
    data: currentDatasetData,
    isLoading: isCurrentDatasetLoading,
    error: datasetError,
  } = useQuery({
    queryKey: ["listCatalogDatasets", catalogId],
    queryFn: () => useCase.listCatalogDatasets({ catalogId: catalogId ?? "0" }),
    select: (data) => presenter.listCatalogDatasets(data),
    enabled: !!catalogId,
    retry: false,
  });

  useEffect(() => {
    if (datasetError) {
      toast.error(presenter.getErrorMessage(datasetError));
    }
  }, [datasetError, presenter]);

  useEffect(() => {
    if (currentDatasetData) {
      setCurrentDataset(
        Array.isArray(currentDatasetData) ? currentDatasetData : [],
      );
    } else {
      setCurrentDataset([]);
    }
  }, [currentDatasetData]);

  // Clear state when catalogId changes (React Query will automatically refetch with new key)
  useEffect(() => {
    setCurrentCatalog(null);
    setCurrentDataset([]);
  }, [catalogId]);

  const addCatalogMutation = useMutation({
    mutationFn: (vars: {
      parentCatalogId?: string;
      catalog: CreateCatalogDto;
    }) => useCase.addCatalog(vars),
    onSuccess: () => {
      utils.invalidateQueries({ queryKey: ["listCatalogs"] });
      toast.success("Catalog created");
    },
    onError: (error) => {
      toast.error("Failed to create catalog");
      console.error("addCatalog error", error);
    },
  });

  const onAddCatalogClick = useCallback(
    (catalog: CreateCatalogDto) => {
      addCatalogMutation.mutate({
        parentCatalogId: catalogId ?? undefined,
        catalog,
      });
    },
    [addCatalogMutation, catalogId],
  );

  const setSelectedCatalogId = useCallback(
    (newCatalogId: string) => {
      navigate(`/catalog/${newCatalogId}`);
    },
    [navigate],
  );

  return {
    catalogs,
    currentCatalog,
    currentDataset,
    catalogId,
    isCatalogsLoading,
    isCurrentCatalogLoading,
    isCurrentDatasetLoading,

    setSelectedCatalogId,
    onAddCatalogClick,
  };
}
