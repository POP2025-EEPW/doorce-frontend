import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { CatalogDetailPresenter } from "./CatalogDetail.presenter";
import { uc } from "@/app/di";
import { buildMockClient } from "@/mocks/mockClient";
import { buildDatasetUC } from "@/use-cases/dataset.uc";
import { queryClient } from "@/app/query";

const meta: Meta<typeof CatalogDetailPresenter> = {
  title: "Presenters/Catalogs/CatalogDetailPresenter",
  component: CatalogDetailPresenter,
};
export default meta;

type Story = StoryObj<typeof CatalogDetailPresenter>;

export const Default: Story = {
  render: () => {
    const mock = buildMockClient();
    uc.dataset = buildDatasetUC(mock);
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/catalogs/sub1"]}>
          <Routes>
            <Route path="/catalogs/:id" element={<CatalogDetailPresenter />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );
  },
};
