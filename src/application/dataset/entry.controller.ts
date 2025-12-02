// entry.controller.ts

import { useRef, useEffect, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/api/client";
import EntryUseCase from "@/domain/dataset/entry.uc";
import EntryPresenter from "./entry.presenter";

export function useEntryController(datasetId: string | null) {
  const queryClient = useQueryClient();

  const deps = useRef<{
    entryUseCase: EntryUseCase;
    presenter: EntryPresenter;
  } | null>(null);

  deps.current ??= {
    entryUseCase: new EntryUseCase(apiClient),
    presenter: new EntryPresenter(),
  };

  const { entryUseCase, presenter } = deps.current;

  const {
    data: entries = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["listEntries", datasetId],
    queryFn: () => entryUseCase.listEntries(datasetId ?? ""),
    select: (data) => presenter.listEntries(data),
    enabled: !!datasetId,
    retry: false,
  });

  useEffect(() => {
    if (error) {
      toast.error(presenter.getErrorMessage(error));
    }
  }, [error, presenter]);

  const setErroneousMutation = useMutation({
    mutationFn: (vars: { entryId: string; erroneous: boolean }) =>
      entryUseCase.setErroneous(datasetId ?? "", vars.entryId, vars.erroneous),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listEntries", datasetId] });
      toast.success("Entry updated");
    },
    onError: (error) => {
      toast.error(presenter.getErrorMessage(error));
    },
  });

  const setSuspiciousMutation = useMutation({
    mutationFn: (vars: { entryId: string; suspicious: boolean }) =>
      entryUseCase.setSuspicious(
        datasetId ?? "",
        vars.entryId,
        vars.suspicious,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listEntries", datasetId] });
      toast.success("Entry updated");
    },
    onError: (error) => {
      toast.error(presenter.getErrorMessage(error));
    },
  });

  const onSetErroneous = useCallback(
    (entryId: string, erroneous: boolean) => {
      setErroneousMutation.mutate({ entryId, erroneous });
    },
    [setErroneousMutation],
  );

  const onSetSuspicious = useCallback(
    (entryId: string, suspicious: boolean) => {
      setSuspiciousMutation.mutate({ entryId, suspicious });
    },
    [setSuspiciousMutation],
  );

  return {
    entries,
    isLoading,
    onSetErroneous,
    onSetSuspicious,
  };
}
