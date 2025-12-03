import type { CreateCatalogDto } from "@/domain/catalog/catalog.type";
import CatalogUseCase from "@/domain/catalog/catalog.uc";
import { useCallback, useEffect, useRef } from "react";
import CatalogPresenter from "./catalog.presenter";
import { apiClient } from "@/api/client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import type { DatasetSummary } from "@/domain/dataset/dataset.types.ts";

export function useCatalogController(catalogId: string | null) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const deps = useRef<{
    useCase: CatalogUseCase;
    presenter: CatalogPresenter;
  } | null>(null);

  deps.current ??= {
    useCase: new CatalogUseCase(apiClient),
    presenter: new CatalogPresenter(),
  };

  const { useCase, presenter } = deps.current;

  const { data: catalogs = [], isLoading: isCatalogsLoading } = useQuery({
    queryKey: ["listCatalogs", catalogId],
    queryFn: () => useCase.listCatalogs(catalogId),
    select: (data) => presenter.listCatalogs(data),
  });

  const {
    data: currentCatalog = null,
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

  const {
    data: currentDataset = [],
    isLoading: isCurrentDatasetLoading,
    error: datasetError,
  } = useQuery({
    queryKey: ["listCatalogDatasets", catalogId],
    queryFn: () => useCase.listCatalogDatasets({ catalogId: catalogId ?? "0" }),
    select: (data) => {
      const result = presenter.listCatalogDatasets(data);
      return Array.isArray(result) ? result : [];
    },
    enabled: !!catalogId,
    retry: false,
  });

  useEffect(() => {
    if (datasetError) {
      toast.error(presenter.getErrorMessage(datasetError));
    }
  }, [datasetError, presenter]);

  const addCatalogMutation = useMutation({
    mutationFn: (vars: {
      parentCatalogId?: string;
      catalog: CreateCatalogDto;
    }) => useCase.addCatalog(vars),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listCatalogs"] });
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

  const onNavigateToParent = useCallback(() => {
    if (currentCatalog?.parentCatalogId) {
      navigate(`/catalog/${currentCatalog.parentCatalogId}`);
    } else {
      // wróć do root catalog (lista bez wybranego katalogu)
      navigate("/catalog");
    }
  }, [currentCatalog?.parentCatalogId, navigate]);

  const onDatasetSelected = useCallback(
    (datasetId: DatasetSummary["id"]) => {
      navigate(`/dataset/${datasetId}`);
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
    onNavigateToParent,
    onDatasetSelected,
  };
}
