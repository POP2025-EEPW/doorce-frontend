import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { DatasetsPresenter } from "./Datasets.presenter";
import { uc } from "@/app/di";
import { buildMockClient } from "@/mocks/mockClient";
import { buildDatasetUC } from "@/use-cases/dataset.uc";
import { queryClient } from "@/app/query";

const meta: Meta<typeof DatasetsPresenter> = {
  title: "Presenters/Datasets/DatasetsPresenter",
  component: DatasetsPresenter,
};
export default meta;

type Story = StoryObj<typeof DatasetsPresenter>;

export const Default: Story = {
  render: () => {
    // Force DI to use mocks for this story
    const mock = buildMockClient();
    uc.dataset = buildDatasetUC(mock);
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/datasets"]}>
          <Routes>
            <Route path="/datasets" element={<DatasetsPresenter />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );
  },
};
