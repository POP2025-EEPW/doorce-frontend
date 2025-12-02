import { useCallback, useEffect, useState } from "react";
import {
  listDataRelatedRequest,
  submitDataRelatedRequest,
} from "./dataset.controller";

export interface DataRelatedRequestPayload {
  subject: string;
  description: string;
}

export type DataRelatedRequest = any;

export function useDataRelatedRequests(initialDatasetId?: string) {
  const [datasetId, setDatasetId] = useState<string | undefined>(
    initialDatasetId,
  );
  const [requests, setRequests] = useState<DataRelatedRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const pageSize = 20;

  const load = useCallback(
    async (nextPage = 0) => {
      if (!datasetId) {
        setError("Please provide dataset ID");
        return;
      }
      setError(null);
      setLoadingList(true);
      try {
        const items = await listDataRelatedRequest(
          datasetId,
          nextPage,
          pageSize,
        );
        setRequests(items ?? []);
        setPage(nextPage);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load requests");
        setRequests([]);
      } finally {
        setLoadingList(false);
      }
    },
    [datasetId],
  );

  const submit = useCallback(
    async (payload: DataRelatedRequestPayload) => {
      if (!datasetId) {
        throw new Error("Dataset ID is required");
      }
      setError(null);
      setLoading(true);
      try {
        const res = await submitDataRelatedRequest(datasetId, payload);
        await load(0);
        return res;
      } catch (e: any) {
        setError(e?.message ?? "Failed to submit request");
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [datasetId, load],
  );

  useEffect(() => {
    if (datasetId) {
      load(0);
    } else {
      setRequests([]);
      setPage(0);
    }
  }, [datasetId, load]);

  return {
    datasetId,
    setDatasetId,
    requests,
    loading,
    loadingList,
    error,
    page,
    pageSize,
    load,
    submit,
    setPage,
    setError,
  };
}
