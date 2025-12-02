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

  const addEntryMutation = useMutation({
    mutationFn: (content: string) =>
      entryUseCase.addEntry(datasetId ?? "", content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listEntries", datasetId] });
      toast.success("Entry added");
    },
    onError: (error) => {
      toast.error(presenter.getErrorMessage(error));
    },
  });

  const setErroneousMutation = useMutation({
    mutationFn: (entryId: string) => entryUseCase.setErroneous(entryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listEntries", datasetId] });
      toast.success("Entry marked as erroneous");
    },
    onError: (error) => {
      toast.error(presenter.getErrorMessage(error));
    },
  });

  const setSuspiciousMutation = useMutation({
    mutationFn: (entryId: string) => entryUseCase.setSuspicious(entryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listEntries", datasetId] });
      toast.success("Entry marked as suspicious");
    },
    onError: (error) => {
      toast.error(presenter.getErrorMessage(error));
    },
  });

  const onAddEntry = useCallback(
    (content: string) => {
      addEntryMutation.mutate(content);
    },
    [addEntryMutation],
  );

  const onSetErroneous = useCallback(
    (entryId: string) => {
      setErroneousMutation.mutate(entryId);
    },
    [setErroneousMutation],
  );

  const onSetSuspicious = useCallback(
    (entryId: string) => {
      setSuspiciousMutation.mutate(entryId);
    },
    [setSuspiciousMutation],
  );

  return {
    entries,
    isLoading,
    isAddingEntry: addEntryMutation.isPending,
    onAddEntry,
    onSetErroneous,
    onSetSuspicious,
  };
}
