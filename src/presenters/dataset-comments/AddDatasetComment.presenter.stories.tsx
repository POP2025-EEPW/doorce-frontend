import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { AddDatasetCommentPresenter } from "./AddDatasetComment.presenter";
import { uc } from "@/app/di";
import { buildMockClient } from "@/mocks/mockClient";
import { buildDatasetUC } from "@/use-cases/dataset.uc";
import { queryClient } from "@/app/query";

const meta: Meta<typeof AddDatasetCommentPresenter> = {
  title: "Presenters/Datasets/AddDatasetCommentPresenter",
  component: AddDatasetCommentPresenter,
};
export default meta;

type Story = StoryObj<typeof AddDatasetCommentPresenter>;

export const Default: Story = {
  render: () => {
    const mock = buildMockClient();
    uc.dataset = buildDatasetUC(mock);
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/datasets/ds1/comments"]}>
          <Routes>
            <Route
              path="/datasets/:datasetId/comments"
              element={<AddDatasetCommentPresenter />}
            />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );
  },
};
