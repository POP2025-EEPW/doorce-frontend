import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { CatalogsPresenter } from "./Catalogs.presenter";
import { uc } from "@/app/di";
import { buildMockClient } from "@/mocks/mockClient";
import { buildDatasetUC } from "@/use-cases/dataset.uc";
import { queryClient } from "@/app/query";

const meta: Meta<typeof CatalogsPresenter> = {
  title: "Presenters/Catalogs/CatalogsPresenter",
  component: CatalogsPresenter,
};
export default meta;

type Story = StoryObj<typeof CatalogsPresenter>;

export const Default: Story = {
  render: () => {
    // Force DI to use mocks for this story
    const mock = buildMockClient();
    uc.dataset = buildDatasetUC(mock);
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/catalogs"]}>
          <Routes>
            <Route path="/catalogs" element={<CatalogsPresenter />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );
  },
};
