import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { DatasetEditPresenter } from "./DatasetEdit.presenter";
import { uc } from "@/app/di";
import { buildMockClient } from "@/mocks/mockClient";
import { buildDatasetUC } from "@/use-cases/dataset.uc";
import { queryClient } from "@/app/query";

const meta: Meta<typeof DatasetEditPresenter> = {
  title: "Presenters/Datasets/DatasetEditPresenter",
  component: DatasetEditPresenter,
};
export default meta;

type Story = StoryObj<typeof DatasetEditPresenter>;

export const Default: Story = {
  render: () => {
    const mock = buildMockClient();
    uc.dataset = buildDatasetUC(mock);

    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/datasets/ds1/edit"]}>
          <Routes>
            <Route
              path="/datasets/:id/edit"
              element={<DatasetEditPresenter />}
            />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );
  },
};
