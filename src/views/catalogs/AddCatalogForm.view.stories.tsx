import type { Meta, StoryObj } from "@storybook/react-vite";
import { AddCatalogFormView } from "./AddCatalogForm.view";

const meta: Meta<typeof AddCatalogFormView> = {
  title: "Views/Catalogs/AddCatalogFormView",
  component: AddCatalogFormView,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof AddCatalogFormView>;

export const Default: Story = {
  args: {
    parentCatalogId: null,
    onSubmit: () => {
      console.log("submit");
    },
  },
};
