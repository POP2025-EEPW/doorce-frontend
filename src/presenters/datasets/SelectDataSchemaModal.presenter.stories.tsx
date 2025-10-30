import type { Meta, StoryObj } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SelectDataSchemaModalPresenter } from "./SelectDataSchemaModal.presenter";
import type { DataSchema } from "@/domain/types/dataset";
import schemasJson from "@/mocks/mock_data/schemas.json";

const mockSchemas = schemasJson as DataSchema[];

const meta: Meta<typeof SelectDataSchemaModalPresenter> = {
  title: "Presenters/Datasets/SelectDataSchemaModalPresenter",
  component: SelectDataSchemaModalPresenter,
};
export default meta;

type Story = StoryObj<typeof SelectDataSchemaModalPresenter>;

export const Default: Story = {
  render: () => {
    const testQueryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    // Pre-populate cache with mock data
    testQueryClient.setQueryData(["dataSchemas"], mockSchemas);

    return (
      <QueryClientProvider client={testQueryClient}>
        <SelectDataSchemaModalPresenter
          open={true}
          datasetId="ds1"
          onSuccess={() => console.log("Success")}
          onCancel={() => console.log("Cancel")}
          onOpenChange={(open) => console.log("Open changed:", open)}
        />
      </QueryClientProvider>
    );
  },
};

export const Closed: Story = {
  render: () => {
    const testQueryClient = new QueryClient();

    return (
      <QueryClientProvider client={testQueryClient}>
        <SelectDataSchemaModalPresenter
          open={false}
          datasetId="ds1"
          onSuccess={() => console.log("Success")}
          onCancel={() => console.log("Cancel")}
          onOpenChange={(open) => console.log("Open changed:", open)}
        />
      </QueryClientProvider>
    );
  },
};
