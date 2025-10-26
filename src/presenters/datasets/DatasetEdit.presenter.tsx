import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { loadDataset, updateDataset } from "@/controllers/datasets.controller";
import { EditDatasetFormView } from "@/views/datasets/EditDatasetForm.view.tsx";
import type { UpdateDatasetInput } from "@/domain/types/dataset.ts";

export function DatasetEditPresenter() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: dataset, isLoading } = useQuery({
    queryKey: ["dataset", id],
    queryFn: () => loadDataset(id!),
    enabled: !!id,
  });

  const { mutate } = useMutation({
    mutationFn: updateDataset, // ✅ teraz działa!
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dataset", id] });
      queryClient.invalidateQueries({ queryKey: ["datasets"] });
      navigate(`/datasets/${id}`);
    },
  });

  if (isLoading || !dataset) {
    return <div className="container mx-auto py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Dataset</h1>
      <EditDatasetFormView
        dataset={dataset}
        onSubmit={(input: UpdateDatasetInput) => mutate({ id: id!, input })}
        onCancel={() => navigate(`/datasets/${id}`)}
      />
    </div>
  );
}
