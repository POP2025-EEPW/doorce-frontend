import type { Meta, StoryObj } from "@storybook/react-vite";
import { AddDatasetFormView } from "./AddDatasetForm.view";

const meta: Meta<typeof AddDatasetFormView> = {
  title: "Views/Datasets/AddDatasetFormView",
  component: AddDatasetFormView,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof AddDatasetFormView>;

export const Default: Story = {
  args: {
    catalogId: "sub1",
    ownerId: "owner-123",
    onSubmit: () => {
      console.log("submit");
    },
  },
};
