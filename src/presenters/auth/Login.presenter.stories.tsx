import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LoginPresenter } from "./Login.presenter";
import { uc } from "@/app/di";
import { buildMockClient } from "@/mocks/mockClient";
import { buildAuthUC } from "@/use-cases/auth.uc";

const meta: Meta<typeof LoginPresenter> = {
  title: "Presenters/Auth/LoginPresenter",
  component: LoginPresenter,
};
export default meta;

type Story = StoryObj<typeof LoginPresenter>;

export const Default: Story = {
  render: () => {
    const client = new QueryClient();
    const mock = buildMockClient();
    uc.auth = buildAuthUC(mock);
    return (
      <QueryClientProvider client={client}>
        <MemoryRouter initialEntries={["/login"]}>
          <Routes>
            <Route path="/login" element={<LoginPresenter />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );
  },
};
