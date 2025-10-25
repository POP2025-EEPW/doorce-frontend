import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { DatasetDetailPresenter } from "./DatasetDetail.presenter";
import { uc } from "@/app/di";
import { buildMockClient } from "@/mocks/mockClient";
import { buildDatasetUC } from "@/use-cases/dataset.uc";
import { queryClient } from "@/app/query";

const meta: Meta<typeof DatasetDetailPresenter> = {
  title: "Presenters/Datasets/DatasetDetailPresenter",
  component: DatasetDetailPresenter,
};
export default meta;

type Story = StoryObj<typeof DatasetDetailPresenter>;

export const Default: Story = {
  render: () => {
    const mock = buildMockClient();
    uc.dataset = buildDatasetUC(mock);
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/datasets/ds1"]}>
          <Routes>
            <Route path="/datasets/:id" element={<DatasetDetailPresenter />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );
  },
};
