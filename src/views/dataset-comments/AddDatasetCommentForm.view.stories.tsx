import type { Meta, StoryObj } from "@storybook/react-vite";
import { AddDatasetCommentFormView } from "./AddDatasetCommentForm.view";
import type { Dataset } from "@/domain/types/dataset";
import datasetsJson from "@/mocks/mock_data/datasets.json";

const meta: Meta<typeof AddDatasetCommentFormView> = {
  title: "Views/DatasetComments/AddDatasetCommentFormView",
  component: AddDatasetCommentFormView,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof AddDatasetCommentFormView>;

const mockDataset = datasetsJson[0] as Dataset;

export const Default: Story = {
  args: {
    dataset: mockDataset,
    onSubmit: (text: string) => {
      console.log("Submitted comment:", text);
    },
    isSubmitting: false,
  },
};

export const WithoutDataset: Story = {
  args: {
    onSubmit: (text: string) => {
      console.log("Submitted comment:", text);
    },
    isSubmitting: false,
  },
};

export const Submitting: Story = {
  args: {
    dataset: mockDataset,
    onSubmit: (text: string) => {
      console.log("Submitted comment:", text);
    },
    isSubmitting: true,
  },
};
