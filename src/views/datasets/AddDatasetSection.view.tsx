import type { CreateDatasetInput } from "@/domain/types/dataset";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface AddDatasetSectionViewProps {
  catalogId: string;
  ownerId: string;
  onSubmit: (input: CreateDatasetInput) => void | Promise<void>;
  // Accept a render-prop for the actual form component
  FormComponent: (props: {
    catalogId: string;
    ownerId: string;
    onSubmit: (input: CreateDatasetInput) => void | Promise<void>;
  }) => React.ReactNode;
}

export function AddDatasetSectionView(props: AddDatasetSectionViewProps) {
  const { catalogId, ownerId, onSubmit, FormComponent } = props;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg leading-none">Add dataset</CardTitle>
      </CardHeader>
      <CardContent>
        <FormComponent
          catalogId={catalogId}
          ownerId={ownerId}
          onSubmit={onSubmit}
        />
      </CardContent>
    </Card>
  );
}
